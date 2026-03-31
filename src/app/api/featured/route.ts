import { NextResponse } from 'next/server';
import { getAllItems } from '@/lib/data';

export async function GET() {
    try {
        const projects = await getAllItems('projects');
        // Home page should only show featured projects.
        // Return only the top 3 newest featured projects.
        const getTime = (value: string) => {
            const t = new Date(value).getTime();
            return Number.isFinite(t) ? t : 0;
        };

        const featured = projects
            .filter((i) => i.featured)
            .sort((a, b) => getTime(b.date) - getTime(a.date))
            .slice(0, 3);

        return NextResponse.json(featured);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
