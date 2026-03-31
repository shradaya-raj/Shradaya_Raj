import { getAllItems } from '@/lib/data';
import ItemCard from '@/app/components/ItemCard';
import Navigation from '@/components/Navigation';
import Projects from '@/components/Projects';

export default async function ProjectsPage() {
  const allItems = await getAllItems('projects');
  const sortedByDate = [...allItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const yearGroups = sortedByDate.reduce<Record<string, typeof sortedByDate>>((acc, item) => {
    const d = new Date(item.date);
    const key = Number.isFinite(d.getTime()) ? String(d.getFullYear()) : 'Unknown';
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {});

  const yearKeys = Object.keys(yearGroups).sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);
    if (Number.isNaN(na) && Number.isNaN(nb)) return a.localeCompare(b);
    if (Number.isNaN(na)) return 1;
    if (Number.isNaN(nb)) return -1;
    return nb - na;
  });

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

          {allItems.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full py-20">No projects found.</p>
          ) : (
            <div className="space-y-16">
              {yearKeys.map((year) => (
                <section key={year}>
                  <h2 className="text-3xl font-bold text-white mb-8">
                    {year}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {yearGroups[year].map((item: any) => (
                      <ItemCard
                        key={item.slug}
                        slug={item.slug}
                        title={item.title}
                        description={item.description}
                        image={item.images?.[0]?.startsWith('/')
                          ? item.images[0]
                          : item.images?.[0]
                            ? `/images/projects/${item.slug}/${item.images[0]}`
                            : undefined}
                        tags={item.tags}
                        featured={item.featured}
                        category="projects"
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
