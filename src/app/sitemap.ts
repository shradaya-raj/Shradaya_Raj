import type { MetadataRoute } from 'next'
import { getAllItems } from '@/lib/data'
import { siteUrl } from '@/lib/metadata'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const groups = await Promise.all((['projects', 'achievements', 'eca'] as const).map(async category =>
    (await getAllItems(category)).map(item => ({ url: `${siteUrl}/${category}/${item.slug}` }))))
  return [...['', '/projects', '/about', '/achievements', '/eca', '/contact'].map(path => ({ url: `${siteUrl}${path}` })), ...groups.flat()]
}
