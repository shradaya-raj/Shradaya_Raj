import { getItemBySlug } from '@/lib/data';
import { itemMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import MappingCaseStudy from '@/components/MappingCaseStudy';

export async function generateMetadata() { return itemMetadata('projects', 'mustang-drone-delivery-feasibility-assessment'); }
export default async function ProjectPage() {
  const item = await getItemBySlug('projects', 'mustang-drone-delivery-feasibility-assessment');
  if (!item) notFound();
  return <MappingCaseStudy item={item} landscapeMaps fieldAssessment />;
}
