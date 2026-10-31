import { promises as fs } from 'fs';
import path from 'path';
import { selectFeaturedProjects } from '@/lib/featuredProjects';
import { getAllItems } from '@/lib/data';
import ProjectArchive from '@/components/ProjectArchive';
import Navigation from '@/components/Navigation';
import PortfolioMotion from '@/components/PortfolioMotion';
import Projects from '@/components/Projects';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('Projects', 'Drone logistics, disaster response, mapping and WebGIS projects. Explore fieldwork, methods and deliverables across my project portfolio.', '/projects');

export default async function ProjectsPage() {
  const allItems = await getAllItems('projects');
  const home = await fs.readFile(path.join(process.cwd(), 'data/site/home.json'), 'utf8').then(JSON.parse).catch(() => ({}));
  const cardData = ({ slug, title, description, date, tags, images, category, featured }: typeof allItems[number]) => ({ slug, title, description, date, tags, images, category, featured });
  const featured = selectFeaturedProjects(allItems, home.featuredProjects).map(cardData);
  const archive = allItems.map(cardData);
  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-black pt-20 pb-16">
        <Projects initialProjects={featured} />
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 border-t border-white/10 pt-16">
          <PortfolioMotion className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Projects</h1>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Explore my engineering projects, from WebGIS and 3D modeling to drone surveys and environmental campaigns.
            </p>
          </PortfolioMotion>

          <ProjectArchive items={archive} />
        </section>
      </main>
    </>
  );
}
