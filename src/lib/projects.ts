import { readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

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
    const projectsDirectory = join(process.cwd(), 'src/app/projects')
    const projectFolders = readdirSync(projectsDirectory)

    const projects = projectFolders.map((folder) => {
      const projectPath = join(projectsDirectory, folder)
      const pageFilePath = join(projectPath, 'page.tsx')
      
      if (!existsSync(pageFilePath)) {
        return null
      }

      const content = readFileSync(pageFilePath, 'utf8')
      
      // Extract title from h1 tag
      const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/)
      const title = titleMatch ? titleMatch[1].trim() : folder.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')

      // Extract description from first p tag in prose div
      const descriptionMatch = content.match(/<p className="text-lg text-gray-300">([^<]+)<\/p>/)
      const description = descriptionMatch ? descriptionMatch[1].trim() : ''

      // Extract technologies from the tags array
      const techMatch = content.match(/\[([^\]]+)\]\.map\(tag/)
      const technologies = techMatch 
        ? techMatch[1].split(',').map(tech => 
            tech.trim().replace(/['"]/g, '')
          )
        : []

      // Get image path
      const imageMatch = content.match(/src="([^"]+)"/)
      const image = imageMatch ? imageMatch[1] : '/images/project-placeholder.jpg'

      return {
        id: folder,
        title,
        description,
        image,
        technologies,
        slug: folder
      }
    }).filter((project): project is Project => project !== null)

    return projects
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
} 