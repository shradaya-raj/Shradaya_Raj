import { getAllItems } from './data'
import type { Item } from './types'

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  slug: string
}

export async function getProjects(): Promise<Project[]> {
  'use server'

  try {
    const items: Item[] = await getAllItems('projects')

    return items.map((item) => {
      const firstImage = item.images?.[0]
      const image =
        firstImage && typeof firstImage === 'string'
          ? firstImage.startsWith('/')
            ? firstImage
            : `/images/projects/${item.slug}/${firstImage}`
          : '/images/project-placeholder.jpg'

      return {
        id: item.slug,
        title: item.title,
        description: item.description,
        image,
        technologies: item.tags,
        slug: item.slug,
      }
    })
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
} 