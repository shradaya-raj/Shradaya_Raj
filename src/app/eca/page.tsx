import { getAllItems } from '@/lib/data';
import ItemCard from '@/app/components/ItemCard';
import Navigation from '@/components/Navigation';

export default async function ECAPage() {
    const items = await getAllItems('eca');

    return (
        <>
            <Navigation />
            <main className="min-h-screen bg-black pt-20 pb-16">
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Extra-Curricular Activities</h1>
                        <p className="text-gray-300 max-w-3xl mx-auto">
                            Beyond academics and work—my engagements in community, leadership, and personal projects.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item) => (
                            <ItemCard
                                key={item.slug}
                                slug={item.slug}
                                title={item.title}
                                description={item.description}
                                image={item.images?.[0] ? `/images/eca/${item.slug}/${item.images[0]}` : undefined}
                                tags={item.tags}
                                featured={item.featured}
                                category="eca"
                            />
                        ))}
                        {items.length === 0 && (
                            <p className="text-gray-500 text-center col-span-full py-20">No activities added yet.</p>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
