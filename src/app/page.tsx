import { promises as fs } from 'fs';
import path from 'path';
import HomePageClient, { type HomeContent } from '@/components/HomePageClient';
import { getAllItems } from '@/lib/data';
import { selectFeaturedProjects, type FeaturedSettings } from '@/lib/featuredProjects';
import { getPrimaryImagePath } from '@/lib/media';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [projects, home] = await Promise.all([
    getAllItems('projects'),
    fs.readFile(path.join(process.cwd(), 'data/site/home.json'), 'utf8')
      .then(text => JSON.parse(text) as HomeContent & { featuredProjects?: FeaturedSettings })
      .catch(() => null),
  ]);
  const featured = selectFeaturedProjects(projects, home?.featuredProjects).map(project => ({
    title: project.title,
    description: project.description,
    image: getPrimaryImagePath(project) ?? '/images/project-placeholder.svg',
    tags: project.tags,
    link: `/projects/${project.slug}`,
  }));

  return <HomePageClient initialProjects={featured} initialContent={home} />;
}
