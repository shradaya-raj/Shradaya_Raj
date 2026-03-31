import { getAllItems } from '@/lib/data';
import ItemCard from '@/app/components/ItemCard';
import Navigation from '@/components/Navigation';

function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();

    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
    if (Number.isNaN(aTime)) return 1;
    if (Number.isNaN(bTime)) return -1;

    return bTime - aTime;
  });
}

export default async function AchievementsPage() {
  const achievements = sortByDateDesc(await getAllItems('achievements'));
  const eca = sortByDateDesc(await getAllItems('eca'));

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-black pt-20 pb-16">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Achievements</h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Professional trainings, certifications, and academic involvements in the field of Geomatics and Geospatial Engineering.
            </p>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-blue-500 mb-8 px-2">Trainings & Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((item) => (
                <ItemCard
                  key={item.slug}
                  slug={item.slug}
                  title={item.title}
                  description={item.description}
                  image={item.images?.[0]?.startsWith('/')
                    ? item.images[0]
                    : item.images?.[0] ? `/images/achievements/${item.slug}/${item.images[0]}` : undefined}
                  tags={item.tags}
                  featured={item.featured}
                  category="achievements"
                />
              ))}
              {achievements.length === 0 && (
                <p className="text-gray-500 text-center col-span-full py-10">No achievements found.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-blue-500 mb-8 px-2">Academic & Extracurricular</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eca.map((item) => (
                <ItemCard
                  key={item.slug}
                  slug={item.slug}
                  title={item.title}
                  description={item.description}
                  image={item.images?.[0]?.startsWith('/')
                    ? item.images[0]
                    : item.images?.[0] ? `/images/eca/${item.slug}/${item.images[0]}` : undefined}
                  tags={item.tags}
                  featured={item.featured}
                  category="eca"
                />
              ))}
              {eca.length === 0 && (
                <p className="text-gray-500 text-center col-span-full py-10">No activities found.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
