import About from '@/components/About'
import { getProjects } from '@/lib/projects'
import Navigation from '@/components/Navigation'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const projects = await getProjects()
  
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <About initialProjects={projects} />
      </main>
    </>
  )
} 