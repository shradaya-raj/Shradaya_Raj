'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/lib/projects'

interface AboutProps {
  initialProjects: Project[]
}

const About = ({ initialProjects }: AboutProps) => {
  const smoothTransition = { duration: 1.2, ease: 'easeOut' }
  const [siteAbout, setSiteAbout] = useState<{
    heading?: string
    paragraphs?: string[]
    skills?: string[]
  } | null>(null)

  useEffect(() => {
    const fetchSiteAbout = async () => {
      try {
        const res = await fetch('/api/site/about')
        if (!res.ok) return
        const data = await res.json()
        setSiteAbout(data)
      } catch {
        // ignore; use defaults
      }
    }
    fetchSiteAbout()
  }, [])

  const heading = siteAbout?.heading ?? 'About Me'
  const paragraphs =
    siteAbout?.paragraphs ?? [
      "Welcome to my digital space! I’m a passionate and driven Geomatics Engineer with a deep interest in geospatial science, mapping technologies, and the innovative use of spatial data to solve real-world challenges. My work revolves around the integration of GIS, remote sensing, GNSS, and surveying to deliver accurate, insightful, and practical solutions across various sectors.",
      "Whether it’s monitoring the environment, supporting infrastructure planning, or conducting spatial analysis, I work on turning complex geographic data into clear, actionable insights. I’m especially interested in the intersection of technology and geography—using tools like QGIS, ArcGIS, and Python for geospatial processing and visualization.",
      'This website showcases my work, ongoing projects, and ideas around geomatics, spatial data science, and how we can better understand the world through data.',
    ]
  const skills = siteAbout?.skills ?? ['GNSS', 'GIS', 'Remote Sensing', '3D Mapping', '3D Modeling', 'Drone Mapping']

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{heading}</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ ...smoothTransition, delay: 0.09 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {paragraphs.map((p) => (
              <p key={p} className="text-xl text-gray-300 text-justify">
                {p}
              </p>
            ))}
            <div className="flex flex-wrap gap-4">
              {skills.map((s) => (
                <Skill key={s}>{s}</Skill>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ ...smoothTransition, delay: 0.1 }}
            viewport={{ once: true }}
            className="h-full"
          >
            {initialProjects.length > 0 && <ProjectsSection projects={initialProjects} />}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

interface ProjectsSectionProps {
  projects: Project[]
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({})
  const slideTransition = { duration: 1.4, ease: 'easeInOut' }
  const slideOffset = 220

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    )
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === projects.length - 1 ? 0 : prevIndex + 1
      )
    }, 7000)

    return () => clearInterval(timer)
  }, [projects.length])

  const getProjectImage = (project: Project) => {
    if (project.image) {
      return project.image
    }

    switch (project.slug) {
      case 'utility-management-system':
        return '/images/UMS/webportal.png'
      case 'deurali-basic-school':
        return '/images/deurali-basic-school/deurali-basic-school.png'
      case 'drone-mapping':
        return '/images/drone-mapping/drone-mapping.jpg'
      case 'lidar-scanning':
        return '/images/lidar-scanning/lidar-scan.jpg'
      case 'gis-mapping':
        return '/images/gis-mapping/gis-mapping.jpg'
      case 'airlift-kailas-cleanup-campaign':
        return '/images/Manaslu/Mount Manaslu.jpg'
      default:
        return '/images/project-placeholder.jpg'
    }
  }

  const activeProject = projects[currentIndex]
  const activeImageSrc = activeProject ? getProjectImage(activeProject) : '/images/project-placeholder.jpg'
  const displayImageSrc =
    imageErrorMap[activeImageSrc] || !activeImageSrc ? '/images/project-placeholder.jpg' : activeImageSrc

  return (
    <div className="relative h-[500px] overflow-hidden rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: slideOffset }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -slideOffset }}
          transition={slideTransition}
          className="absolute inset-0"
        >
          <Link href={`/projects/${activeProject.slug}`} className="block h-full">
            <div className="relative h-full w-full bg-gray-800 rounded-xl overflow-hidden group">
              <div className="absolute inset-0">
                <Image
                  src={displayImageSrc}
                  alt={activeProject.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  onError={() => {
                    setImageErrorMap((prev) => ({ ...prev, [activeImageSrc]: true }))
                  }}
                />
                <div className="absolute inset-0 bg-black/60 transition-opacity duration-500 group-hover:bg-black/40" />
              </div>
              <div className="relative h-full w-full p-8 flex flex-col justify-between z-10">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{activeProject.title}</h3>
                  <p className="text-gray-300 text-lg mb-6">{activeProject.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.technologies.map((tech: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-4 px-8 z-20">
        <button
          type="button"
          aria-label="Previous project"
          onClick={goToPrevious}
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/75 backdrop-blur-sm"
        >
          ‹
        </button>

        <div className="pointer-events-auto flex justify-center space-x-2">
          {projects.map((_: Project, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next project"
          onClick={goToNext}
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/75 backdrop-blur-sm"
        >
          ›
        </button>
      </div>
    </div>
  )
}

const Skill = ({ children }: { children: React.ReactNode }) => (
  <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
    {children}
  </span>
)

export default About 