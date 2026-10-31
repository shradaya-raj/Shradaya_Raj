import { NextResponse } from 'next/server';
import { getAllItems } from '@/lib/data';
import { selectFeaturedProjects } from '@/lib/featuredProjects';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const projects = await getAllItems('projects');
        const home = JSON.parse(await fs.readFile(path.join(process.cwd(), 'data/site/home.json'), 'utf8'));
        const featured = selectFeaturedProjects(projects, home.featuredProjects);
        return NextResponse.json(featured);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
