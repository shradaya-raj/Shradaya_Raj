export interface VisualizationConfig {
    title: string;
    type: 'bar' | 'pie' | 'line';
    labels: string[];
    values: number[];
}

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
    attachments?: string[];
    dataPointsRaw?: string;
    visualizations?: VisualizationConfig[];
    autoReport?: string;
    importance?: number;
}
