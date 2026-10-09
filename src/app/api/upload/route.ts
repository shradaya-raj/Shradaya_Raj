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
import { VisualizationConfig } from '@/lib/types';

const allowedExtensions = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.mp4',
  '.webm',
]);
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

function getExt(name: string) {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx).toLowerCase() : '';
}

function buildFallbackAiContent(extractedText: string, tags: string[], title: string): string {
  const lines = extractedText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const summary = lines.slice(0, 3).join(' ').slice(0, 420);
  const highlights = lines
    .filter((l) => l.startsWith('-'))
    .slice(0, 5)
    .map((l) => l.replace(/^-+\s*/, '').trim());

  return [
    '## Executive Summary',
    summary || `${title} was uploaded and processed successfully.`,
    '',
    '## Key Features / Highlights',
    ...(highlights.length > 0 ? highlights.map((h) => `- ${h}`) : ['- Structured content extracted from the uploaded document.']),
    '',
    '## Technologies & Tools',
    ...(tags.length > 0 ? tags.map((t) => `- ${t}`) : ['- Not explicitly provided']),
    '',
    '## Impact',
    'This entry captures the uploaded information in a clear, portfolio-ready format for review and publication.',
  ].join('\n');
}

function buildAutoReportTemplate(input: {
  title: string;
  category: string;
  date: string;
  description: string;
  tags: string[];
  extractedText: string;
  points: { label: string; value: number }[];
}): string {
  const { title, category, date, description, tags, extractedText, points } = input;

  const excerpt = extractedText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(' ')
    .slice(0, 500);

  const metricsBlock =
    points.length > 0
      ? points.map((p) => `- **${p.label}**: ${p.value}`).join('\n')
      : '- No numeric metrics were provided.';

  const topMetric = points.length > 0 ? [...points].sort((a, b) => b.value - a.value)[0] : null;

  return [
    `## Report Template: ${title}`,
    '',
    '### 1) Project Context',
    `- **Category**: ${category}`,
    `- **Date**: ${date}`,
    `- **Focus**: ${description || 'No short description provided.'}`,
    '',
    '### 2) Collected Data Summary',
    excerpt || 'No extracted long-form content was available. The record is based on manually entered fields.',
    '',
    '### 3) Key Metrics',
    metricsBlock,
    '',
    '### 4) Observations',
    topMetric
      ? `- The strongest reported metric is **${topMetric.label} (${topMetric.value})**.`
      : '- Add numeric data points to produce stronger quantitative observations.',
    points.length >= 3
      ? '- Multiple indicators are available; compare them with timeline updates in future revisions.'
      : '- Add more data points for deeper comparisons and trend analysis.',
    '',
    '### 5) Recommended Next Actions',
    '- Validate field observations against map outputs and supporting documents.',
    '- Keep the same metric labels in future updates for consistent trend tracking.',
    '- Use generated charts to communicate progress clearly with stakeholders.',
    '',
    '### 6) Keywords',
    tags.length > 0 ? tags.map((tag) => `- ${tag}`).join('\n') : '- No keywords provided.',
  ].join('\n');
}

function parseDataPoints(raw: string): { label: string; value: number }[] {
  if (!raw.trim()) return [];

  const points: { label: string; value: number }[] = [];
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    const normalized = line.replace(/[,;]\s*/g, ':');
    const match = normalized.match(/^(.+?)\s*:\s*(-?\d+(?:\.\d+)?)$/);
    if (!match) continue;
    points.push({
      label: match[1].trim(),
      value: Number(match[2]),
    });
  }

  return points.filter((p) => Number.isFinite(p.value));
}

function isLikelyTimeSeries(labels: string[]): boolean {
  if (labels.length < 3) return false;
  const yearLike = labels.every((l) => /^\d{4}$/.test(l.trim()));
  const monthLike = labels.every((l) => /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(l.trim()));
  return yearLike || monthLike;
}

function buildVisualizations(title: string, points: { label: string; value: number }[]): VisualizationConfig[] {
  if (points.length < 2) return [];

  const labels = points.map((p) => p.label);
  const values = points.map((p) => p.value);
  const total = values.reduce((sum, value) => sum + value, 0);
  const looksLikePercentDistribution = values.every((v) => v >= 0 && v <= 100) && total >= 95 && total <= 105;

  let type: VisualizationConfig['type'] = 'bar';
  if (looksLikePercentDistribution) type = 'pie';
  else if (isLikelyTimeSeries(labels)) type = 'line';

  return [
    {
      title: `${title} - Key Metrics`,
      type,
      labels,
      values,
    },
  ];
}

export async function POST(req: Request) {
    const guard = requireAdmin(req);
    if (guard) return guard;

    try {
        const formData = await req.formData();
        const filesFromArray = formData.getAll('files').filter((f): f is File => f instanceof File);
        const legacySingleFile = formData.get('file');
        const files = filesFromArray.length
          ? filesFromArray
          : legacySingleFile instanceof File
            ? [legacySingleFile]
            : [];
        const category = (formData.get('category') as string) ?? 'projects';
        const title = (formData.get('title') as string) ?? '';
        const description = (formData.get('description') as string) ?? '';
        const date = (formData.get('date') as string) ?? new Date().toISOString();
        const tagsRaw = (formData.get('tags') as string) ?? '';
        const featured = (formData.get('featured') as string) === 'true';
        const importanceRaw = (formData.get('importance') as string) ?? '0';
        const importance = Number.isNaN(Number(importanceRaw)) ? 0 : Number(importanceRaw);
        const dataPointsRaw = (formData.get('dataPointsRaw') as string) ?? '';
        const editSlug = formData.get('editSlug') as string | null;
        const oldCategory = formData.get('oldCategory') as string | null;

        const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);
        const parsedPoints = parseDataPoints(dataPointsRaw);
        const visualizations = buildVisualizations(title, parsedPoints);
        const slug = slugify(`${title}-${formatDate(date)}`);

        const shouldUseGitHubPr =
          process.env.NODE_ENV === 'production' &&
          !!process.env.GITHUB_TOKEN &&
          !!process.env.GITHUB_OWNER &&
          !!process.env.GITHUB_REPO;

        // Validate all uploaded files.
        for (const file of files) {
          const ext = getExt(file.name);
          if (!allowedExtensions.has(ext)) {
              return NextResponse.json(
                  {
                      error: `Unsupported file type (${ext || 'unknown'}) for "${file.name}".`,
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
                      error: `File "${file.name}" is too large (${Math.round(file.size / 1024 / 1024)}MB).`,
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
        let attachments: string[] = [];
        let extractedText = '';
        let aiContent = '';
        let autoReport = '';

        // Handle file uploads if present
        if (files.length > 0) {
            images = files
              .filter((f) => imageExtensions.has(getExt(f.name)))
              .map((f) => f.name);
            attachments = files
              .filter((f) => !imageExtensions.has(getExt(f.name)))
              .map((f) => f.name);
            const extractedChunks: string[] = [];

            for (const file of files) {
              const ext = getExt(file.name);
              const arrayBuffer = await file.arrayBuffer();
              const fileBuffer = Buffer.from(arrayBuffer);

              if (!shouldUseGitHubPr) {
                  const originalFilePath = path.join(imagesDir, file.name);
                  await fs.writeFile(originalFilePath, fileBuffer);
              }

              try {
                  if (ext === '.pdf') {
                      const pdfParseMod = require('pdf-parse');
                      const pdfParse = (pdfParseMod as any).default ?? pdfParseMod;
                      const data = await (pdfParse as any)(fileBuffer);
                      const text = String(data.text || '').trim();
                      if (text) extractedChunks.push(`Source: ${file.name}\n${text}`);
                  } else if (ext === '.doc' || ext === '.docx') {
                      const mammoth = require('mammoth');
                      const result = await mammoth.extractRawText({ buffer: fileBuffer });
                      const text = String(result.value || '').trim();
                      if (text) extractedChunks.push(`Source: ${file.name}\n${text}`);
                  } else if (ext === '.txt') {
                      const text = fileBuffer.toString('utf8').trim();
                      if (text) extractedChunks.push(`Source: ${file.name}\n${text}`);
                  }
              } catch (extractionError) {
                  console.warn('Text extraction failed but proceeding with upload:', file.name, extractionError);
              }
            }

            extractedText = extractedChunks.join('\n\n---\n\n');
        } else if (editSlug) {
            // If editing without new file, get old data
            const oldPath = path.join(dataDir, `${editSlug}.json`);
            try {
                const oldData = JSON.parse(await fs.readFile(oldPath, 'utf8'));
                images = oldData.images || [];
                attachments = oldData.attachments || [];
                extractedText = oldData.fullText || '';
                aiContent = oldData.aiContent || '';
                autoReport = oldData.autoReport || '';
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
        if (extractedText && (files.length > 0 || !editSlug)) {
            aiContent = buildFallbackAiContent(extractedText, tags, title);
        }

        if ((description || extractedText || parsedPoints.length > 0) && (files.length > 0 || !editSlug)) {
            autoReport = buildAutoReportTemplate({
                title,
                category,
                date,
                description,
                tags,
                extractedText,
                points: parsedPoints,
            });
        }

        if (extractedText && process.env.DEEPSEEK_API_KEY && (files.length > 0 || !editSlug)) {
            const prompt = `Analyze the following technical or descriptive content and provide a structured summary in Markdown format.
Include:
- **Executive Summary**: A 2-sentence high-level overview.
- **Key Features / Highlights**: A bulleted list of 3-5 major points.
- **Technologies & Tools** (if applicable): A list of technologies identified.
- **Impact**: The potential or actual impact of this project, achievement, or activity.

Do not use H1 (#) headers. Start with H2 (##) or bolding.

Content:
${extractedText.slice(0, 15000)}

Attached files:
${images.join(', ') || '(none)'}`;

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
            attachments,
            dataPointsRaw,
            visualizations,
            autoReport,
            importance,
        };

        const processingSummary = {
            filesReceived: files.length,
            imagesDetected: images.length,
            attachmentsDetected: attachments.length,
            textExtracted: !!extractedText.trim(),
            aiSummaryGenerated: !!aiContent.trim(),
            reportGenerated: !!autoReport.trim(),
            chartsGenerated: visualizations.length,
            mode: shouldUseGitHubPr ? 'pr' : 'local',
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
            for (const file of files) {
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
                {
                  slug,
                  category,
                  message: 'PR created',
                  mode: 'pr',
                  prUrl: pr.url,
                  prNumber: pr.number,
                  filesSaved: files.map((f) => f.name),
                  processingSummary,
                },
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

        return NextResponse.json(
          {
            slug,
            category,
            message: 'Upload successful',
            mode: 'local',
            filesSaved: files.map((f) => f.name),
            jsonPath: `data/${category}/${slug}.json`,
            mediaDir: `public/images/${category}/${slug}`,
            processingSummary,
          },
          { status: 200 }
        );
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
