import { getAllItems } from '@/lib/data';
import ItemCard from '@/app/components/ItemCard';
import Navigation from '@/components/Navigation';
import Projects from '@/components/Projects';

export default async function ProjectsPage() {
  const allItems = await getAllItems('projects');

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-black pt-20 pb-16">
        <Projects />
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 border-t border-white/10 pt-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Projects</h1>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Explore my engineering projects, from WebGIS and 3D modeling to drone surveys and environmental campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allItems.map((item: any) => (
              <ItemCard
                key={item.slug}
                slug={item.slug}
                title={item.title}
                description={item.description}
                image={item.images?.[0]?.startsWith('/')
                  ? item.images[0]
                  : item.images?.[0] ? `/images/projects/${item.slug}/${item.images[0]}` : undefined}
                tags={item.tags}
                featured={item.featured}
                category="projects"
              />
            ))}
            {allItems.length === 0 && (
              <p className="text-gray-500 text-center col-span-full py-20">No projects found.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
