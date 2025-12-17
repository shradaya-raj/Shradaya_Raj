import { getProjects } from '@/lib/projects'
import Navigation from '@/components/Navigation'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const cardGradient =
  'relative overflow-hidden rounded-2xl border border-blue-900/40 bg-gradient-to-br from-gray-900/90 via-gray-950 to-gray-900 shadow-[0_20px_60px_rgba(0,0,0,0.35)]'

const coverForSlug = (slug: string) => {
  switch (slug) {
    case 'utility-management-system':
      return '/images/UMS/Poster for ums.png'
    case 'deurali-basic-school':
      return '/images/deurali-basic-school/deurali-basic-school.png'
    case 'drone-mapping':
      return '/images/drone-mapping/drone-mapping.jpg'
    case 'lidar-scanning':
      return '/images/lidar-scanning/lidar-scan.jpg'
    case 'gis-mapping':
      return '/images/gis-mapping/gis-mapping.jpg'
    default:
      return '/images/project-placeholder.jpg'
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-black pt-20 pb-16">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">All Projects</h1>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Explore the full collection of my work—web GIS platforms, drone mapping, lidar, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className={`${cardGradient} group transition-transform duration-300 hover:-translate-y-1`}
              >
                <div className="absolute inset-px rounded-[18px] border border-blue-500/10" />
                <div className="absolute -right-12 -top-12 w-44 h-44 bg-blue-500/15 blur-3xl opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-purple-500/10 blur-3xl" />

                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-900/60">
                  <Image
                    src={coverForSlug(project.slug)}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={project.slug === projects[0]?.slug}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                <div className="relative p-6 flex flex-col gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">{project.title}</h2>
                    <p className="text-gray-300 text-sm line-clamp-3">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs text-blue-50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-blue-200">
                    <span className="inline-flex items-center gap-2">
                      View project
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-wide">
                      {project.technologies[0] || 'Project'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

