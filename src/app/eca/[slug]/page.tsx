import { itemMetadata } from '@/lib/metadata';
import { getAllItems, getItemBySlug } from '@/lib/data';
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return itemMetadata('eca', (await params).slug);
}

export async function generateStaticParams() { return (await getAllItems('eca')).map(item => ({ slug: item.slug })); }
