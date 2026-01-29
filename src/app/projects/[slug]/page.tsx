import { getItemBySlug } from '@/lib/data';
import ItemDetail from '@/app/components/ItemDetail';
import { notFound } from 'next/navigation';

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
    const item = await getItemBySlug('projects', params.slug);

    if (!item) {
        notFound();
    }

    return <ItemDetail item={item} />;
}
