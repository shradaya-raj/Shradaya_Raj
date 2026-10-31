import About, { type AboutContent } from '@/components/About'
import { promises as fs } from 'fs'
import path from 'path'
import Navigation from '@/components/Navigation'

export const dynamic = 'force-static'

export default async function AboutPage() {
  const content = JSON.parse(await fs.readFile(path.join(process.cwd(), 'data/site/about.json'), 'utf8')) as AboutContent
  
  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="min-h-screen pt-16">
        <About initialContent={content} />
      </main>
    </>
  )
} 