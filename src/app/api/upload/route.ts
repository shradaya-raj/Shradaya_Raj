import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
// Defer heavy/problematic imports
// import pdfParse from 'pdf-parse';
// import mammoth from 'mammoth';
import { slugify } from '../../../../lib/slugify';
import { formatDate } from '../../../../lib/dateFormatter';

export async function POST(req: Request) {
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

        if (!file && !editSlug) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);
        const slug = slugify(`${title}-${formatDate(date)}`);

        // Prepare directories
        const dataDir = path.join(process.cwd(), 'data', category);
        const imagesDir = path.join(process.cwd(), 'public', 'images', category, slug);
        await fs.mkdir(dataDir, { recursive: true });
        await fs.mkdir(imagesDir, { recursive: true });

        let images: string[] = [];
        let extractedText = '';
        let aiContent = '';

        // Handle file upload if present
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer);
            const originalFilePath = path.join(imagesDir, file.name);
            await fs.writeFile(originalFilePath, fileBuffer);
            images = [file.name];

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

        // AI Analysis (for new content or when a new file is uploaded)
        if (extractedText && process.env.GEMINI_API_KEY && (file || !editSlug)) {
            try {
                const { GoogleGenerativeAI } = require('@google/generative-ai');
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

                const prompt = `Analyze the following technical or descriptive content and provide a structured summary in Markdown format.
                Include:
                - **Executive Summary**: A 2-sentence high-level overview.
                - **Key Features / Highlights**: A bulleted list of 3-5 major points.
                - **Technologies & Tools** (if applicable): A list of technologies identified.
                - **Impact**: The potential or actual impact of this project, achievement, or activity.
                
                Do not use H1 (#) headers. Start with H2 (##) or bolding.
                
                Content:
                ${extractedText.slice(0, 15000)}`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                aiContent = response.text();
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
