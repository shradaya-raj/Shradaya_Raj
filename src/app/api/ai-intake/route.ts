import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

const allowedDocExtensions = new Set(['.pdf', '.doc', '.docx', '.txt']);

function getExt(name: string) {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx).toLowerCase() : '';
}

export async function POST(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { error: 'DEEPSEEK_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const filesFromArray = formData.getAll('files').filter((f): f is File => f instanceof File);
    const legacySingleFile = formData.get('file');
    const files = filesFromArray.length
      ? filesFromArray
      : legacySingleFile instanceof File
        ? [legacySingleFile]
        : [];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const docFile = files.find((candidate) => allowedDocExtensions.has(getExt(candidate.name)));
    if (!docFile) {
      return NextResponse.json(
        {
          error: 'Please include at least one PDF, DOC, DOCX, or TXT file for AI intake.',
          allowed: Array.from(allowedDocExtensions),
        },
        { status: 400 }
      );
    }

    const ext = getExt(docFile.name);
    const arrayBuffer = await docFile.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    let extractedText = '';
    const attachedMedia = files
      .filter((f) => f.name !== docFile.name)
      .map((f) => f.name);

    try {
      if (ext === '.pdf') {
        const pdfParse = require('pdf-parse');
        const data = await (pdfParse as any)(fileBuffer);
        extractedText = data.text || '';
      } else if (ext === '.doc' || ext === '.docx') {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer as ArrayBuffer });
        extractedText = result.value || '';
      } else if (ext === '.txt') {
        extractedText = fileBuffer.toString('utf8');
      }
    } catch (extractionError) {
      console.error('AI intake extraction failed:', extractionError);
      return NextResponse.json(
        { error: 'Could not extract text from the provided file.' },
        { status: 400 }
      );
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'No readable text found in the file.' },
        { status: 400 }
      );
    }

    const prompt = `You are helping an admin convert a document into a portfolio entry.
Return STRICT JSON only, in this exact shape:
{
  "category": "projects",
  "title": "short clear title",
  "description": "1-3 sentence concise summary",
  "tags": ["tag1", "tag2"],
  "importance": 0
}

Rules:
- category must be exactly one of: projects, achievements, eca.
- title should be concise and portfolio-friendly.
- description should be clear and professional.
- tags should be 3-7 concise tags.
- importance must be integer 0-10.
- No Markdown, no code fences, no commentary.

Document filename: ${docFile.name}
Attached filenames (non-text inputs): ${attachedMedia.join(', ') || '(none)'}
Document content:
${extractedText.slice(0, 16000)}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Return STRICT JSON only.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek ai-intake failed:', response.status, errorText);
      return NextResponse.json({ error: 'AI intake request failed.' }, { status: 500 });
    }

    const json = await response.json();
    const rawText: string = json.choices?.[0]?.message?.content?.trim?.() ?? '';
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error('Failed to parse AI intake JSON:', err, 'rawText:', rawText);
      return NextResponse.json({ error: 'AI response was not valid JSON.' }, { status: 500 });
    }

    const category =
      parsed?.category === 'projects' || parsed?.category === 'achievements' || parsed?.category === 'eca'
        ? parsed.category
        : 'projects';

    const tags = Array.isArray(parsed?.tags)
      ? parsed.tags.map((t: any) => String(t).trim()).filter(Boolean).slice(0, 10)
      : [];

    const importanceRaw = Number(parsed?.importance);
    const importance = Number.isFinite(importanceRaw)
      ? Math.max(0, Math.min(10, Math.round(importanceRaw)))
      : 0;

    return NextResponse.json(
      {
        category,
        title: typeof parsed?.title === 'string' ? parsed.title.trim() : '',
        description: typeof parsed?.description === 'string' ? parsed.description.trim() : '',
        tags,
        importance,
        attachedMedia,
        extractedPreview: extractedText.slice(0, 1200),
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('ai-intake error:', err);
    return NextResponse.json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}
