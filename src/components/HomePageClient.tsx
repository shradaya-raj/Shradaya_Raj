'use client'

import React from 'react'
import { motion, MotionConfig } from 'framer-motion'
import ResponsiveBackdrop from '@/components/ResponsiveBackdrop'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image' // Changed from next/legacy/image to next/image


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

const smoothTransition = { duration: 0.4, ease: 'easeOut' }
export type HomeContent = {
  profileImage: string
  profileAlt: string
  name: string
  role: string
  highlights: string[]
  intro: { headingPrefix: string; headingHighlight: string; paragraph: string }
  stats: { number: string; label: string }[]
  toolsTitle: string
  toolsCategories: { title: string; items: string[] }[]
  cta: { primary: { text: string; href: string }; secondary: { text: string; href: string } }
}

const defaultHomeContent: HomeContent = {
  profileImage: '/profile-professional-2026.png',
  profileAlt: 'Shradaya Raj Poudel',
  name: 'Shradaya Raj Poudel',
  role: 'Geomatics Engineer',
  highlights: ['GNSS', 'GIS', '360 Mapping', '3D Modeling', 'Drone Mapping', 'Drone Delivery', 'Disaster Response'],
  intro: {
    headingPrefix: 'Mapping with',
    headingHighlight: 'heart, precision, and purpose.',
    paragraph:
      "I'm a Geomatics Engineering graduate from Tribhuvan University with experience in drone surveying, GIS, GNSS, 3D modeling and 360° mapping. My work includes high-resolution mapping with Airlift Technology, drone-delivery assistance and flood-impact mapping on Mt. Manaslu, and field capture and virtual tours with Galli Maps. I've also handled drone-delivery operations following the Rasuwa-Bhotekoshi flood in Nepal, operating DJI FlyCart 100 and FlyCart 30 drones. Alongside WebGIS development, I combine fieldwork and spatial analysis to support infrastructure, environmental assessment and disaster response.",
  },
  stats: [
    { number: '2+', label: 'Years of Experience' },
    { number: '12+', label: 'Projects Completed' },
    { number: '5+', label: 'Trainings Attended' },
  ],
  toolsTitle: 'Gadgets & Software',
  toolsCategories: [
    { title: 'Drones', items: ['DJI Neo 2', 'DJI Mavic 3E', 'DJI Matrice 4E', 'DJI FlyCart 30', 'DJI FlyCart 100', 'DJI Phantom 4 RTK', 'DJI Mini 4 Pro', 'DJI Matrice 350'] },
    { title: 'Photogrammetry', items: ['Pix 4D', 'AgiSoft Metashape', 'DJI Terra', 'DJI Modify', 'DJI Reality'] },
    { title: 'GIS & Mapping', items: ['ArcGIS', 'QGIS'] },
    {
      title: 'Surveying',
      items: ['Total Station', 'Drones', 'DJI FlightHub2', 'DRTK', 'DGPS', 'Kobo Collect', 'ODK Collect', 'SW Maps'],
    },
    { title: 'Designing', items: ['Revit', 'Canva'] },
    { title: 'GNSS Data Processing', items: ['RTKLIB', 'U-Center'] },
    { title: 'Virtual Tour Mapping', items: ['3D Vista', 'Insta 360 Pro 2', 'PanoX'] },
  ],
  cta: {
    primary: { text: 'View Projects', href: '/projects' },
    secondary: { text: 'Get in Touch', href: '/contact' },
  },
}

export type HomeFeaturedProject = {
  title: string
  description: string
  image: string
  tags: string[]
  link: string
}

export default function HomePageClient({ initialProjects, initialContent }: {
  initialProjects: HomeFeaturedProject[]
  initialContent: HomeContent | null
}) {
  const homeContent = initialContent ?? defaultHomeContent
  const projects = initialProjects




  return (
    <MotionConfig reducedMotion="user">
      <Navigation />
      <main id="main-content" tabIndex={-1} className="relative bg-black">
        {/* Hero Section */}
        <section className="portfolio-hero h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-black via-blue-900/20 to-black">
          <ResponsiveBackdrop />

          <div
            className="hero-content text-center z-10 px-4"
          >
            <div
              className="hero-portrait-block mb-12"
            >
              <div className="hero-portrait-shell mx-auto relative">
                <div className="hero-portrait relative w-full h-full overflow-hidden">
                  <Image
                    src={homeContent.profileImage}
                    alt={homeContent.profileAlt}
                    width={350}
                    height={350}
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
                    priority
                    className="hero-portrait-image object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            { /* Updated name and designation section with new background */}
            <div className="hero-title-card relative mt-6 max-w-5xl w-full mx-auto px-6 sm:px-12 py-10 flex flex-col items-center gap-6">
              {/* Animated background for name, designation, and actions */}
              <div className="hero-panel absolute inset-0 bg-gradient-to-r from-white via-white to-white backdrop-blur-sm rounded-[28px] transform rotate-[0.4deg] shadow-[0_18px_60px_rgba(36,76,53,0.06)]"></div>
              <div className="hero-panel-line absolute inset-0 bg-gradient-to-r from-white via-white to-white backdrop-blur-sm rounded-[28px] transform -rotate-[0.4deg] border border-blue-500/25"></div>

              <h1 className="text-5xl md:text-7xl font-bold relative text-center">
                <span
                  className="inline-block text-stone-900 relative z-10"
                >
                  {homeContent.name}
                </span>
                <span
                  className="block text-blue-700 relative z-10 text-4xl md:text-6xl"
                >
                  {homeContent.role}
                </span>
              </h1>

              <p
                className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto text-center relative z-10"
              >
                {homeContent.highlights.map((h, idx) => (
                  <React.Fragment key={h}>
                    <span className={`inline-block ${idx % 2 === 0 ? 'text-purple-400' : 'text-blue-400'}`}>{h}</span>
                    {idx < homeContent.highlights.length - 1 ? ' | ' : null}
                  </React.Fragment>
                ))}
              </p>

              <div
                className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
              >
                <Link href={homeContent.cta.primary.href} className="hero-primary-action bg-brand-accent text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors hover:bg-brand-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent inline-flex items-center justify-center hover:scale-105 active:scale-95">
                  {homeContent.cta.primary.text}
                </Link>
                <Link href={homeContent.cta.secondary.href} className="bg-transparent border-2 border-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all hover:bg-blue-500/10 h-[52px] inline-flex items-center justify-center hover:scale-105 active:scale-95">
                  {homeContent.cta.secondary.text}
                </Link>
              </div>
            </div>
          </div>

          {/* Animated Background */}
          <div className="hero-background-detail absolute inset-0 -z-9">
            <div className="bg-transparent border-4 mb-2 border-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all hover:bg-blue-500/10" />
          </div>
        </section>

        {/* Quick Introduction */}
        <section className="py-16 bg-black">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                {homeContent.intro.headingPrefix}{' '}
                <span className="text-blue-400">{homeContent.intro.headingHighlight}</span>
              </h2>
              <div className="text-gray-300 max-w-3xl mx-auto space-y-5 text-center leading-relaxed">
                {homeContent.intro.paragraph.split(/\n\s*\n/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 mb-6">
              {homeContent.stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <h3 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">
                    {stat.number}
                  </h3>
                  <p className="text-gray-300 text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Tools & Platforms */}
        <section className="py-16 bg-black">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">{homeContent.toolsTitle}</h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {homeContent.toolsCategories.map((category, idx) => (
                <motion.div
                  key={category.title}
                  variants={fadeInUp}
                  className="tool-card relative overflow-hidden rounded-2xl border border-blue-900/40 bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-gray-950 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  transition={{ ...smoothTransition, delay: idx * 0.05 }}
                >
                  <div className="absolute inset-px rounded-[18px] border border-blue-500/10" />
                  <div className="absolute -right-10 -top-12 w-44 h-44 bg-gradient-to-br from-blue-500/25 via-purple-500/20 to-pink-500/10 blur-3xl opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-100">
                        {category.items.length} {category.title.trim().toLowerCase() === 'drones' ? (category.items.length === 1 ? 'drone' : 'drones') : (category.items.length === 1 ? 'tool' : 'tools')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map(item => (
                        <span
                          key={item}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/30 via-purple-500/25 to-blue-400/20 border border-blue-500/30 text-blue-50 text-sm shadow-[0_0_0_1px_rgba(92,127,157,0.12)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Featured Projects */}
        <section className="py-16 bg-black">
          <div
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                Featured Projects
              </h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-100 text-sm font-medium hover:bg-blue-500/20 transition-colors"
              >
                View all projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {projects.map((project) => (
                <Link
                  key={project.link}
                  href={project.link}
                  className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer"
                >
                  <div className="aspect-[4/3] relative bg-gray-800 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      fill
                      className="group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 text-white">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="project-specialty-tag px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </MotionConfig>
  )
}
