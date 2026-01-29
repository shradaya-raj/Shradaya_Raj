import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getItemBySlug } from '@/lib/data';

export async function GET(
    req: Request,
    { params }: { params: { category: string; slug: string } }
) {
    const { category, slug } = params;
    const item = await getItemBySlug(category as any, slug);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
}

export async function DELETE(
    req: Request,
    { params }: { params: { category: string; slug: string } }
) {
    const { category, slug } = params;
    try {
        const jsonPath = path.join(process.cwd(), 'data', category, `${slug}.json`);
        const imagesDir = path.join(process.cwd(), 'public', 'images', category, slug);

        // Delete JSON data
        await fs.unlink(jsonPath);

        // Delete images directory (optional, but clean)
        await fs.rm(imagesDir, { recursive: true, force: true });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (err: any) {
        console.error('Delete error:', err);
        return NextResponse.json({ error: 'Failed to delete: ' + err.message }, { status: 500 });
    }
}
