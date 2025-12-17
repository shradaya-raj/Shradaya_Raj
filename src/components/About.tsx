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
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
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
            <p className="text-xl text-gray-300 text-justify">
              Welcome to my digital space! I'm a passionate and driven Geomatics Engineer with a deep interest in geospatial science, mapping technologies, and the innovative use of spatial data to solve real-world challenges. My work revolves around the integration of GIS, remote sensing, GNSS, and surveying to deliver accurate, insightful, and practical solutions across various sectors.
            </p>
            <p className="text-xl text-gray-300 text-justify">
              Whether it's monitoring the environment, supporting infrastructure planning, or conducting spatial analysis, I work on turning complex geographic data into clear, actionable insights. I'm especially interested in the intersection of technology and geography—using tools like QGIS, ArcGIS, and Python for geospatial processing and visualization.
            </p>
            <p className="text-xl text-gray-300 text-justify">
              This website showcases my work, ongoing projects, and ideas around geomatics, spatial data science, and how we can better understand the world through data.
            </p>
            <div className="flex flex-wrap gap-4">
              <Skill>GNSS</Skill>
              <Skill>GIS</Skill>
              <Skill>Remote Sensing</Skill>
              <Skill>3D Mapping</Skill>
              <Skill>3D Modeling</Skill>
              <Skill>Drone Mapping</Skill>
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
  const slideTransition = { duration: 1.4, ease: 'easeInOut' }
  const slideOffset = 220

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === projects.length - 1 ? 0 : prevIndex + 1
      )
    }, 7000)

    return () => clearInterval(timer)
  }, [projects.length])

  const getProjectImage = (project: Project) => {
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
      default:
        return '/images/project-placeholder.jpg'
    }
  }

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
          <Link href={`/projects/${projects[currentIndex].slug}`} className="block h-full">
            <div className="relative h-full w-full bg-gray-800 rounded-xl overflow-hidden group">
              <div className="absolute inset-0">
                <Image
                  src={getProjectImage(projects[currentIndex])}
                  alt={projects[currentIndex].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-black/60 transition-opacity duration-500 group-hover:bg-black/40" />
              </div>
              <div className="relative h-full w-full p-8 flex flex-col justify-between z-10">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{projects[currentIndex].title}</h3>
                  <p className="text-gray-300 text-lg mb-6">{projects[currentIndex].description}</p>
                  <div className="flex flex-wrap gap-2">
                    {projects[currentIndex].technologies.map((tech: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center space-x-2 mt-6">
                  {projects.map((_: Project, index: number) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentIndex(index)
                      }}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        index === currentIndex ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const Skill = ({ children }: { children: React.ReactNode }) => (
  <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
    {children}
  </span>
)

export default About 