import { NextResponse } from 'next/server';
import { getAllItems } from '@/lib/data';

export async function GET() {
    try {
        const projects = await getAllItems('projects');
        const achievements = await getAllItems('achievements');
        const eca = await getAllItems('eca');

        return NextResponse.json({
            projects,
            achievements,
            eca
        });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}
