import type { Metadata } from 'next'
import home from '../../data/site/home.json'
import { getItemBySlug } from './data'
import { getPrimaryImagePath } from './media'

export const siteUrl = (process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://shradaya-raj.vercel.app')).replace(/\/$/, '')

export function pageMetadata(title: string, description: string, pathname: string, image = home.profileImage): Metadata {
  const fullTitle = `${title} | ${home.name}`
  const summary = description.length > 180 ? description.slice(0, 177).replace(/\s+\S*$/, '') + '…' : description
  return {
    title: fullTitle, description: summary,
    alternates: { canonical: pathname },
    openGraph: { title: fullTitle, description: summary, url: pathname, type: 'website', images: [{ url: image, alt: title }] },
    twitter: { card: 'summary_large_image', title: fullTitle, description: summary, images: [image] },
  }
}

export async function itemMetadata(category: 'projects' | 'achievements' | 'eca', slug: string): Promise<Metadata> {
  const item = await getItemBySlug(category, slug)
  return item ? pageMetadata(item.title, item.description, `/${category}/${slug}`, getPrimaryImagePath(item)) : { title: 'Page not found', robots: { index: false } }
}
