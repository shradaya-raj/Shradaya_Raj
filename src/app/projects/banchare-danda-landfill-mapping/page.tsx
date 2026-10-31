import { getItemBySlug } from '@/lib/data';
import { itemMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import MappingCaseStudy from '@/components/MappingCaseStudy';

export async function generateMetadata() { return itemMetadata('projects', 'banchare-danda-landfill-mapping'); }
export default async function ProjectPage() {
  const item = await getItemBySlug('projects', 'banchare-danda-landfill-mapping');
  if (!item) notFound();
  return <MappingCaseStudy item={item} />;
}
