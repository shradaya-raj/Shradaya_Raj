import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/adminAuth';
import { isSitePage, validateSiteContent } from '@/lib/siteContent';
import { createCmsBranch, createPullRequest, upsertFile } from '@/lib/github';
import { getAllItems } from '@/lib/data';

export const dynamic = 'force-dynamic';

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

export async function PUT(req: Request, { params }: { params: { page: string } }) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  if (!isSitePage(params.page)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  let content: any;
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw) > 200000) throw new Error('Page content is too large.');
    content = JSON.parse(raw);
    validateSiteContent(params.page, content);
    if (content.featuredProjects?.mode === 'manual') {
      const projects = await getAllItems('projects');
      if (content.featuredProjects.slugs.some((slug: string) => !projects.some(project => project.slug === slug))) {
        throw new Error('A selected project no longer exists. Reload the editor.');
      }
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid page content.' }, { status: 400 });
  }
  try {
    const repoPath = `data/site/${params.page}.json`;
    const serialized = JSON.stringify(content, null, 2) + '\n';
    if (process.env.NODE_ENV === 'production') {
      const branch = await createCmsBranch(`site/${params.page}`);
      await upsertFile({ branch, path: repoPath, contentBase64: Buffer.from(serialized).toString('base64'), message: `cms: edit ${params.page}` });
      const pr = await createPullRequest({ branch, title: `CMS: edit ${params.page}`, body: `Updates ${params.page} content from the page editor. Merge and deploy to publish.` });
      return NextResponse.json({ mode: 'pull-request', prUrl: pr.url });
    }
    const filePath = path.join(process.cwd(), repoPath);
    const tempPath = `${filePath}.${crypto.randomUUID()}.tmp`;
    await fs.writeFile(tempPath, serialized, 'utf8');
    try { await fs.rename(tempPath, filePath); }
    finally { await fs.rm(tempPath, { force: true }); }
    return NextResponse.json({ mode: 'local', message: 'Saved locally. Refresh the public page to see your changes.' });
  } catch (error) {
    console.error('Site save failed:', error);
    return NextResponse.json({ error: 'Could not save this page. Check the server publishing configuration.' }, { status: 500 });
  }
}

