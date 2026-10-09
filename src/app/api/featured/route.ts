import { NextResponse } from 'next/server';
import { getAllItems } from '@/lib/data';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const projects = await getAllItems('projects');
        const home = JSON.parse(await fs.readFile(path.join(process.cwd(), 'data/site/home.json'), 'utf8'));
        const settings = home.featuredProjects;
        const limit = Math.min(30, Math.max(1, Number(settings?.limit) || 3));
        if (settings?.mode === 'manual' && Array.isArray(settings.slugs)) {
            const selected = settings.slugs.map((slug: string) => projects.find(project => project.slug === slug)).filter(Boolean);
            return NextResponse.json(selected.slice(0, limit));
        }
        // Home page should only show featured projects.
        // Return only the top 3 newest featured projects.
        const getTime = (value: string) => {
            const t = new Date(value).getTime();
            return Number.isFinite(t) ? t : 0;
        };

        const featured = projects
            .filter((i) => i.featured)
            .sort((a, b) => getTime(b.date) - getTime(a.date))
            .slice(0, limit);

        return NextResponse.json(featured);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
