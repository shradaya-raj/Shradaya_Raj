import { getItemBySlug } from '@/lib/data';
import { itemMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import WebGISCaseStudy from '@/components/WebGISCaseStudy';

export async function generateMetadata() { return itemMetadata('projects', 'webgis-utility-management-system-unified-june-1-2024'); }
export default async function ProjectPage() {
  const item = await getItemBySlug('projects', 'webgis-utility-management-system-unified-june-1-2024');
  if (!item) notFound();
  return <WebGISCaseStudy item={item} />;
}
