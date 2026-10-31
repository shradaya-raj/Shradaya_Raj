import type { Item } from './types';

export type FeaturedSettings = { mode?: string; slugs?: string[]; limit?: string | number };

export function selectFeaturedProjects(projects: Item[], settings?: FeaturedSettings): Item[] {
    const limit = Math.min(30, Math.max(1, Number(settings?.limit) || 3));
    if (settings?.mode === 'manual' && Array.isArray(settings.slugs)) {
        return settings.slugs
            .map(slug => projects.find(project => project.slug === slug))
            .filter((project): project is Item => Boolean(project))
            .slice(0, limit);
    }
    const timestamp = (value: string) => {
        const time = new Date(value).getTime();
        return Number.isFinite(time) ? time : 0;
    };
    return projects.filter(project => project.featured)
        .sort((a, b) => timestamp(b.date) - timestamp(a.date))
        .slice(0, limit);
}
