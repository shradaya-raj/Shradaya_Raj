import { promises as fs } from 'fs';
import path from 'path';
import { Item } from './types';

export async function getAllItems(category: 'projects' | 'achievements' | 'eca'): Promise<Item[]> {
    const dataDir = path.join(process.cwd(), 'data', category);
    try {
        const files = await fs.readdir(dataDir);
        const items = await Promise.all(
            files
                .filter((f) => f.endsWith('.json'))
                .map(async (file) => {
                    const content = await fs.readFile(path.join(dataDir, file), 'utf8');
                    return JSON.parse(content);
                })
        );
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return items;
    } catch (e) {
        console.error('Failed to read items for', category, e);
        return [];
    }
}

export async function getItemBySlug(category: 'projects' | 'achievements' | 'eca', slug: string): Promise<Item | null> {
    const filePath = path.join(process.cwd(), 'data', category, `${slug}.json`);
    try {
        const content = await fs.readFile(filePath, 'utf8');
        return JSON.parse(content);
    } catch (e) {
        console.error('Item not found', category, slug, e);
        return null;
    }
}
