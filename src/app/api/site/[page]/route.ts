import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const allowedPages = new Set(['home', 'about', 'contact']);

export async function GET(
  _req: Request,
  { params }: { params: { page: string } }
) {
  const page = params.page;
  if (!allowedPages.has(page)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'data', 'site', `${page}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(raw);
    return NextResponse.json(json, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to read site content', details: err.message },
      { status: 500 }
    );
  }
}

