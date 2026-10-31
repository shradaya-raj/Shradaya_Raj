import ItemCard from '@/app/components/ItemCard'
import { getPrimaryImagePath } from '@/lib/media'
import type { Item } from '@/lib/types'

export default function ProjectArchive({ items }: { items: Item[] }) {
  const yearOf = (item: Item) => item.date.match(/^\d{4}/)?.[0] ?? 'Unknown'
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date))
  const years = Array.from(new Set(sorted.map(yearOf))).sort().reverse()

  if (!sorted.length) return <p className="py-12 text-center text-gray-300">No projects available yet.</p>

  return <div className="space-y-16">{years.map(year => (
    <section key={year} aria-label={`${year} projects`}>
      <h2 className="text-3xl font-bold mb-8">{year}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sorted.filter(item => yearOf(item) === year).map(item => (
          <ItemCard key={item.slug} slug={item.slug} title={item.title} description={item.description} image={getPrimaryImagePath(item)} tags={item.tags} featured={item.featured} category="projects" />
        ))}
      </div>
    </section>
  ))}</div>
}
