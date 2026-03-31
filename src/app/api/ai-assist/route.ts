import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

interface AiAssistRequest {
  title?: string;
  description?: string;
  tags?: string;
  category?: string;
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
    const body = (await req.json()) as AiAssistRequest;
    const { title = '', description = '', tags = '', category = '' } = body;

    const combined = [title, description, tags ? `Tags: ${tags}` : '']
      .filter(Boolean)
      .join('\n\n')
      .trim();

    if (!combined) {
      return NextResponse.json(
        { error: 'No content provided for AI assistance.' },
        { status: 400 }
      );
    }

    const prompt = `You are helping manage content in a personal portfolio CMS.
Return STRICT JSON only, with no extra text, in this exact shape:
{
  "description": "improved short description as a single paragraph",
  "tags": ["tag1", "tag2", "tag3"],
  "importance": 0
}

- "description": rewrite or refine the description to be clear, concise, and suitable for a portfolio card.
- "tags": 3-7 concise tags based on the content (technologies, themes, domains).
- "importance": integer between 0 and 10 (higher = more important/impactful on the portfolio).

If some fields cannot be improved, reuse the existing values.
Do NOT include any Markdown code fences or commentary.

INPUT:
Title: ${title}
Category: ${category}
Description: ${description}
Tags: ${tags}`;

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
              'You are a helpful assistant that returns STRICT JSON for managing items in a personal portfolio CMS.',
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
      console.error('DeepSeek ai-assist failed:', response.status, errorText);
      return NextResponse.json(
        { error: 'AI assist request failed. Please try again.' },
        { status: 500 }
      );
    }

    const json = await response.json();
    const rawText: string = json.choices?.[0]?.message?.content?.trim?.() ?? '';

    // Strip optional ```json code fences if the model added them
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error('Failed to parse AI JSON:', err, 'rawText:', rawText);
      return NextResponse.json(
        { error: 'AI response could not be understood. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('AI assist error:', err);
    return NextResponse.json(
      { error: 'Server error while calling AI assist.', details: err.message },
      { status: 500 }
    );
  }
}

