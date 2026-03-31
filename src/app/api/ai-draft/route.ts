import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

type DraftBody = {
  mode: 'site' | 'item';
  sitePage?: 'home' | 'about' | 'contact';
  category?: 'projects' | 'achievements' | 'eca';
  slug?: string;
  instruction: string;
  current: any;
};

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
    const body = (await req.json()) as DraftBody;

    if (!body?.instruction?.trim()) {
      return NextResponse.json({ error: 'Missing instruction.' }, { status: 400 });
    }
    if (!body?.current) {
      return NextResponse.json({ error: 'Missing current JSON.' }, { status: 400 });
    }

    const scope =
      body.mode === 'site'
        ? `site page "${body.sitePage}"`
        : `item "${body.category}/${body.slug}"`;

    const prompt = `You are an expert editor for a personal portfolio website.

TASK:
Apply the user's instruction to the CURRENT_JSON and return STRICT JSON only, with no extra text.

SCOPE:
${scope}

RULES:
- Output must be valid JSON.
- Keep the same overall shape/keys as CURRENT_JSON unless the instruction explicitly requires structural changes.
- Fix typos and keep tone consistent with a professional portfolio.
- Do not include Markdown fences, commentary, or explanations.

USER_INSTRUCTION:
${body.instruction}

CURRENT_JSON:
${JSON.stringify(body.current, null, 2)}
`;

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
            content: 'Return STRICT JSON only.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek ai-draft failed:', response.status, errorText);
      return NextResponse.json({ error: 'AI draft request failed.' }, { status: 500 });
    }

    const json = await response.json();
    const rawText: string = json.choices?.[0]?.message?.content?.trim?.() ?? '';
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    let proposed: any;
    try {
      proposed = JSON.parse(cleaned);
    } catch (err) {
      console.error('Failed to parse AI JSON:', err, 'rawText:', rawText);
      return NextResponse.json({ error: 'AI response was not valid JSON.' }, { status: 500 });
    }

    return NextResponse.json({ proposed }, { status: 200 });
  } catch (err: any) {
    console.error('ai-draft error:', err);
    return NextResponse.json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}

