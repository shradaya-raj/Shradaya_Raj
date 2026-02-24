export interface Item {
    slug: string;
    title: string;
    description: string;
    fullText?: string;
    aiContent?: string;
    date: string;
    tags: string[];
    featured: boolean;
    category: 'projects' | 'achievements' | 'eca';
    images: string[];
    importance?: number;
}
