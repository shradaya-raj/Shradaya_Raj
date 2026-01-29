import { NextResponse } from 'next/server';
import { getAllItems } from '@/lib/data';

export async function GET() {
    try {
        const projects = await getAllItems('projects');
        const achievements = await getAllItems('achievements');
        const eca = await getAllItems('eca');

        const featured = [
            ...projects.filter(i => i.featured)
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json(featured);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
