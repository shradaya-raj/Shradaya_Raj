import { getItemBySlug } from '@/lib/data';
import ItemDetail from '@/app/components/ItemDetail';
import { notFound } from 'next/navigation';

export default async function ECADetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = await getItemBySlug('eca', slug);

    if (!item) {
        notFound();
    }

    return <ItemDetail item={item} />;
}
