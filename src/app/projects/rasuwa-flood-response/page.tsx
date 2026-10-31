import { getItemBySlug } from '@/lib/data';
import { itemMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import RasuwaCaseStudy from '@/components/RasuwaCaseStudy';

export async function generateMetadata() { return itemMetadata('projects', 'rasuwa-flood-response'); }
export default async function ProjectPage() {
  const item = await getItemBySlug('projects', 'rasuwa-flood-response');
  if (!item) notFound();
  return <RasuwaCaseStudy item={item} />;
}
