import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createCmsBranch, createPullRequest, upsertFile } from '@/lib/github';
import { getItemBySlug } from '@/lib/data';
import { promises as fs } from 'fs';
import path from 'path';

type Body = {
  mode: 'site' | 'item';
  sitePage?: 'home' | 'about' | 'contact';
  category?: 'projects' | 'achievements' | 'eca';
  slug?: string;
  instruction: string;
};

async function readSiteJson(page: string) {
  const filePath = path.join(process.cwd(), 'data', 'site', `${page}.json`);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
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
    const body = (await req.json()) as Body;
    if (!body?.instruction?.trim()) {
      return NextResponse.json({ error: 'Missing instruction.' }, { status: 400 });
    }

    let current: any;
    let filePathInRepo = '';
    let scopeLabel = '';

    if (body.mode === 'site') {
      const page = body.sitePage;
      if (!page) return NextResponse.json({ error: 'Missing sitePage.' }, { status: 400 });
      current = await readSiteJson(page);
      filePathInRepo = `data/site/${page}.json`;
      scopeLabel = `site/${page}`;
    } else {
      const category = body.category;
      const slug = body.slug;
      if (!category || !slug) {
        return NextResponse.json({ error: 'Missing category/slug.' }, { status: 400 });
      }
      const item = await getItemBySlug(category, slug);
      if (!item) return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
      current = item;
      filePathInRepo = `data/${category}/${slug}.json`;
      scopeLabel = `${category}/${slug}`;
    }

    const prompt = `You are an expert editor for a personal portfolio website.

Apply the user's instruction to the CURRENT_JSON and return STRICT JSON only, with no extra text.

RULES:
- Output must be valid JSON.
- Keep the same overall shape/keys as CURRENT_JSON unless the instruction explicitly requires structural changes.
- Fix typos and keep tone consistent with a professional portfolio.
- Do not include Markdown fences, commentary, or explanations.

USER_INSTRUCTION:
${body.instruction}

CURRENT_JSON:
${JSON.stringify(current, null, 2)}
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
          { role: 'system', content: 'Return STRICT JSON only.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek ai-to-pr failed:', response.status, errorText);
      return NextResponse.json({ error: 'AI request failed.' }, { status: 500 });
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

    const branch = await createCmsBranch(`ai/${scopeLabel}`);
    await upsertFile({
      branch,
      path: filePathInRepo,
      contentBase64: Buffer.from(JSON.stringify(proposed, null, 2), 'utf8').toString('base64'),
      message: `ai: update ${scopeLabel}`,
    });

    const pr = await createPullRequest({
      branch,
      title: `AI: update ${scopeLabel}`,
      body: [
        '## Summary',
        `- Target: **${scopeLabel}**`,
        '',
        '## Instruction',
        body.instruction.trim(),
        '',
        '## Notes',
        '- This PR was generated from `/admin/ai`.',
      ].join('\n'),
    });

    return NextResponse.json({ prUrl: pr.url, prNumber: pr.number }, { status: 200 });
  } catch (err: any) {
    console.error('ai-to-pr error:', err);
    return NextResponse.json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}

