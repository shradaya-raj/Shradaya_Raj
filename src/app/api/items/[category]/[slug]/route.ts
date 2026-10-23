import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getItemBySlug } from '@/lib/data';
import { requireAdmin } from '@/lib/adminAuth';
import { isCategory, isSlug } from '@/lib/contentValidation';
import { createCmsBranch, createPullRequest, deleteFile } from '@/lib/github';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ category: string; slug: string }> }
) {
    const { category, slug } = await params;
    if (!isCategory(category) || !isSlug(slug)) return NextResponse.json({ error: 'Invalid category or identifier.' }, { status: 400 });
    const item = await getItemBySlug(category as any, slug);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ category: string; slug: string }> }
) {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const { category, slug } = await params;
    if (!isCategory(category) || !isSlug(slug)) return NextResponse.json({ error: 'Invalid category or identifier.' }, { status: 400 });
    try {
        if (!await getItemBySlug(category, slug)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (process.env.NODE_ENV === 'production') {
            if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) return NextResponse.json({ error: 'Configure GitHub publishing before deleting content.' }, { status: 503 });
            const branch = await createCmsBranch(`delete/${category}/${slug}`);
            await deleteFile({ branch, path: `data/${category}/${slug}.json`, message: `cms: remove ${category}/${slug}` });
            const pr = await createPullRequest({ branch, title: `CMS: remove ${category}/${slug}`, body: 'Removes the content record after merge and deployment. Media is retained to preserve references from other entries.' });
            return NextResponse.json({ mode: 'pr', prUrl: pr.url });
        }
        const jsonPath = path.join(process.cwd(), 'data', category, `${slug}.json`);

        // Delete JSON data
        await fs.unlink(jsonPath);

        // Media may be referenced by moved entries. Clean unused assets separately.

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (err: any) {
        console.error('Delete error:', err);
        return NextResponse.json({ error: 'Failed to delete: ' + err.message }, { status: 500 });
    }
}
