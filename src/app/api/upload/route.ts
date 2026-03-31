import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
// Defer heavy/problematic imports
// import pdfParse from 'pdf-parse';
// import mammoth from 'mammoth';
import { slugify } from '../../../../lib/slugify';
import { formatDate } from '../../../../lib/dateFormatter';
import { requireAdmin } from '@/lib/adminAuth';
import { createCmsBranch, createPullRequest, deleteFile, upsertFile } from '@/lib/github';

const allowedExtensions = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.mp4',
  '.webm',
]);

function getExt(name: string) {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx).toLowerCase() : '';
}

export async function POST(req: Request) {
    const guard = requireAdmin(req);
    if (guard) return guard;

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const category = (formData.get('category') as string) ?? 'project';
        const title = (formData.get('title') as string) ?? '';
        const description = (formData.get('description') as string) ?? '';
        const date = (formData.get('date') as string) ?? new Date().toISOString();
        const tagsRaw = (formData.get('tags') as string) ?? '';
        const featured = (formData.get('featured') as string) === 'true';
        const importanceRaw = (formData.get('importance') as string) ?? '0';
        const importance = Number.isNaN(Number(importanceRaw)) ? 0 : Number(importanceRaw);
        const editSlug = formData.get('editSlug') as string | null;
        const oldCategory = formData.get('oldCategory') as string | null;

        const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);
        const slug = slugify(`${title}-${formatDate(date)}`);

        const shouldUseGitHubPr =
          process.env.NODE_ENV === 'production' &&
          !!process.env.GITHUB_TOKEN &&
          !!process.env.GITHUB_OWNER &&
          !!process.env.GITHUB_REPO;

        if (file) {
            const ext = getExt(file.name);
            if (!allowedExtensions.has(ext)) {
                return NextResponse.json(
                    {
                        error: `Unsupported file type (${ext || 'unknown'}).`,
                        allowed: Array.from(allowedExtensions),
                    },
                    { status: 400 }
                );
            }

            // GitHub Contents API is best for small/medium assets. Keep uploads small for a smooth PR workflow.
            const maxBytes = shouldUseGitHubPr ? 900_000 : 25_000_000;
            if (file.size > maxBytes) {
                return NextResponse.json(
                    {
                        error: `File is too large (${Math.round(file.size / 1024 / 1024)}MB).`,
                        maxMB: Math.round(maxBytes / 1024 / 1024),
                        hint:
                            'For large videos, prefer external hosting (YouTube/Vimeo) and store the URL in the item JSON. If you want to store large binaries in git, consider Git LFS.',
                    },
                    { status: 413 }
                );
            }
        }

        // Prepare directories
        const dataDir = path.join(process.cwd(), 'data', category);
        const imagesDir = path.join(process.cwd(), 'public', 'images', category, slug);
        if (!shouldUseGitHubPr) {
            await fs.mkdir(dataDir, { recursive: true });
            await fs.mkdir(imagesDir, { recursive: true });
        }

        let images: string[] = [];
        let extractedText = '';
        let aiContent = '';

        // Handle file upload if present
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer);
            images = [file.name];
            if (!shouldUseGitHubPr) {
                const originalFilePath = path.join(imagesDir, file.name);
                await fs.writeFile(originalFilePath, fileBuffer);
            }

            try {
                if (file.name.endsWith('.pdf')) {
                    const pdfParse = require('pdf-parse');
                    const data = await (pdfParse as any)(fileBuffer);
                    extractedText = data.text;
                } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                    const mammoth = require('mammoth');
                    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer as ArrayBuffer });
                    extractedText = result.value;
                }
            } catch (extractionError) {
                console.warn('Text extraction failed but proceeding with upload:', extractionError);
            }
        } else if (editSlug) {
            // If editing without new file, get old data
            const oldPath = path.join(dataDir, `${editSlug}.json`);
            try {
                const oldData = JSON.parse(await fs.readFile(oldPath, 'utf8'));
                images = oldData.images || [];
                extractedText = oldData.fullText || '';
                aiContent = oldData.aiContent || '';
            } catch (e) {
                // ignore
            }
        } else {
            // New item without file: use provided details as source text
            const tagsJoined = tagsRaw || '';
            const detailsParts = [
                title,
                description,
                tagsJoined ? `Tags: ${tagsJoined}` : ''
            ].filter(Boolean);
            extractedText = detailsParts.join('\n\n');
        }

        // AI Analysis (for new content or when a new file is uploaded) using DeepSeek
        if (extractedText && process.env.DEEPSEEK_API_KEY && (file || !editSlug)) {
            const prompt = `Analyze the following technical or descriptive content and provide a structured summary in Markdown format.
Include:
- **Executive Summary**: A 2-sentence high-level overview.
- **Key Features / Highlights**: A bulleted list of 3-5 major points.
- **Technologies & Tools** (if applicable): A list of technologies identified.
- **Impact**: The potential or actual impact of this project, achievement, or activity.

Do not use H1 (#) headers. Start with H2 (##) or bolding.

Content:
${extractedText.slice(0, 15000)}`;

            try {
                const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: 'deepseek-chat',
                        messages: [
                            {
                                role: 'system',
                                content:
                                    'You are a helpful assistant that writes concise, well-structured Markdown summaries for a personal portfolio website.',
                            },
                            {
                                role: 'user',
                                content: prompt,
                            },
                        ],
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('DeepSeek AI generation failed:', response.status, errorText);
                } else {
                    const json = await response.json();
                    aiContent = json.choices?.[0]?.message?.content?.trim?.() ?? '';
                }
            } catch (aiError) {
                console.error('AI generation failed:', aiError);
            }
        }

        // Build JSON payload
        const payload = {
            slug,
            title,
            description: description || (extractedText ? extractedText.slice(0, 200) : ''),
            fullText: extractedText,
            aiContent,
            date,
            tags,
            featured,
            category,
            images,
            importance,
        };

        if (shouldUseGitHubPr) {
            const branch = await createCmsBranch(`${category}/${slug}`);
            const commitMessage = `cms: update ${category}/${slug}`;

            // 1) JSON content
            await upsertFile({
                branch,
                path: `data/${category}/${slug}.json`,
                contentBase64: Buffer.from(JSON.stringify(payload, null, 2), 'utf8').toString('base64'),
                message: commitMessage,
            });

            // 2) Media/document file (optional)
            if (file) {
                const arrayBuffer = await file.arrayBuffer();
                const fileBuffer = Buffer.from(arrayBuffer);
                await upsertFile({
                    branch,
                    path: `public/images/${category}/${slug}/${file.name}`,
                    contentBase64: fileBuffer.toString('base64'),
                    message: commitMessage,
                });
            }

            // 3) If slug/category changed during edit, delete old JSON (best-effort)
            if (editSlug) {
                const sameCategory = !oldCategory || oldCategory === category;
                if (editSlug !== slug || !sameCategory) {
                    const deleteCat = oldCategory || category;
                    await deleteFile({
                        branch,
                        path: `data/${deleteCat}/${editSlug}.json`,
                        message: `cms: remove old ${deleteCat}/${editSlug}`,
                    });
                }
            }

            const pr = await createPullRequest({
                branch,
                title: editSlug
                    ? `CMS: update ${category}/${slug}`
                    : `CMS: add ${category}/${slug}`,
                body: [
                    '## Summary',
                    `- Category: **${category}**`,
                    `- Slug: **${slug}**`,
                    editSlug ? `- Edited from: **${editSlug}**` : null,
                    '',
                    '## Notes',
                    '- This PR was generated from the site admin UI.',
                ]
                    .filter(Boolean)
                    .join('\n'),
            });

            return NextResponse.json(
                { slug, message: 'PR created', prUrl: pr.url, prNumber: pr.number },
                { status: 200 }
            );
        }

        const jsonPath = path.join(dataDir, `${slug}.json`);
        await fs.writeFile(jsonPath, JSON.stringify(payload, null, 2), 'utf8');

        // If slug or category changed during edit, remove old file
        if (editSlug) {
            const sameCategory = !oldCategory || oldCategory === category;
            if (editSlug !== slug || !sameCategory) {
                try {
                    const deleteCat = oldCategory || category;
                    await fs.unlink(path.join(process.cwd(), 'data', deleteCat, `${editSlug}.json`));
                } catch (e) { }
            }
        }

        return NextResponse.json({ slug, message: 'Upload successful' }, { status: 200 });
    } catch (err: any) {
        console.error('Upload error:', err);
        return NextResponse.json({
            error: 'Server error',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }, { status: 500 });
    }
}

export async function DELETE(
  req: Request,
  { params }: { params: { category: string; slug: string } }
) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  try {
    const { category, slug } = params;

    if (!category || !slug) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Path to JSON data
    const dataPath = path.join(
      process.cwd(),
      'data',
      category,
      `${slug}.json`
    );

    // Check if file exists
    try {
      await fs.access(dataPath);
    } catch {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Delete JSON file
    await fs.unlink(dataPath);

    // Delete associated images folder (if exists)
    const imagesDir = path.join(
      process.cwd(),
      'public',
      'images',
      category,
      slug
    );

    try {
      await fs.rm(imagesDir, { recursive: true, force: true });
    } catch {
      // Ignore if folder doesn't exist
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Delete error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}
