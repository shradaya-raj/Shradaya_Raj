'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image' // Changed from next/legacy/image to next/image
import {
  DemographicsChart,
  BuildingStructureChart,
  InternetAccessChart,
  WaterSupplyChart,
  RoofTypesChart,
  WallTypesChart,
  EmploymentChart,
  EducationChart
} from '@/components/charts'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: 'easeOut' }
}

const smoothTransition = { duration: 1.2, ease: 'easeOut' }

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const projects = [
    {
      title: "Utility Management System",
      description: "Developed a WebGIS Utility Management System Integrated with Metric House Number",
      image: "/images/UMS/webportal.png",
      imageWidth: 1920,
      imageHeight: 1080,
      tags: ["QGIS", "Python", "FMTM", "WebGIS", "MAPTILER","Metric House Number"],
      link: "/projects/utility-management-system"
    },
    {
      title: "Deurali Basic School Project", 
      description: "Infrastructure development project focused on improving educational facilities and learning environment",
      image: "/images/deurali-basic-school/deurali-basic-school.png",
      tags: ["Education", "Community Development", "Infrastructure", "Social Impact"],
      link: "/projects/deurali-basic-school"
    },
    {
      title: "Drone Mapping",
      description: "Aerial surveying and mapping project using UAV technology for precision agriculture",
      image: "/images/drone-mapping.jpg",
      tags: ["UAV", "Photogrammetry", "Remote Sensing", "Agriculture"],
      link: "/projects/drone-mapping"
    }
  ]


  // Generate static positions for floating shapes
  const floatingShapes = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    initialX: Math.floor(Math.random() * 100),
    initialY: Math.floor(Math.random() * 100),
    animateX: Math.floor(Math.random() * 100),
    animateY: Math.floor(Math.random() * 100),
    left: `${Math.floor(Math.random() * 100)}%`,
    top: `${Math.floor(Math.random() * 100)}%`,
  }))

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Navigation />
      <main className="relative bg-black">
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-black via-blue-900/20 to-black">
          {/* Dynamic gradient background that follows mouse */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.3), transparent 40%)`
            }}
          />

          {/* Floating shapes */}
          <div className="absolute inset-0 overflow-hidden">
            {floatingShapes.map((shape) => (
              <motion.div
                key={shape.id}
                className="absolute w-64 h-64 bg-blue-500/5 rounded-full"
                initial={{ x: shape.initialX, y: shape.initialY }}
                animate={{
                  x: [shape.initialX, shape.animateX],
                  y: [shape.initialY, shape.animateY],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
                style={{
                  left: shape.left,
                  top: shape.top,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={smoothTransition}
            className="text-center z-10 px-4 mt-20"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...smoothTransition, duration: 1.3 }}
              className="mb-12"
            >
              <div className="w-40 h-40 md:w-48 md:h-48 mx-auto relative group">
                {/* Outer glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 blur-md group-hover:blur-xl transition-all duration-300"></div>
                
                {/* Main image container */}
                <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-blue-500 ring-offset-8 ring-offset-black shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:ring-purple-500 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 mt-8">
                  <Image
                    src="/profile1.jpg"
                    alt="Shradaya Raj Poudel"
                    width={350}
                    height={350}
                    priority
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500 translate-y-4"
                  />
                </div>
              </div>
            </motion.div>
            
            { /* Updated name and designation section with new background */}
            <div className="relative mt-6 max-w-5xl w-full mx-auto px-6 sm:px-12 py-10 flex flex-col items-center gap-6">
              {/* Animated background for name, designation, and actions */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/25 via-purple-900/25 to-blue-900/25 backdrop-blur-sm rounded-[28px] transform rotate-[0.4deg] shadow-[0_18px_60px_rgba(59,130,246,0.25)]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/15 via-purple-900/15 to-blue-900/15 backdrop-blur-sm rounded-[28px] transform -rotate-[0.4deg] border border-blue-500/25"></div>
              
              <h1 className="text-5xl md:text-7xl font-bold relative text-center">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...smoothTransition, delay: 0.2 }}
                  className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white relative z-10"
                >
                  Shradaya Raj Poudel
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...smoothTransition, delay: 0.4 }}
                  className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 relative z-10 text-4xl md:text-6xl" 
                >
                  Geomatics Engineer
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...smoothTransition, delay: 0.6 }}
                className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto text-center relative z-10"
              >
                <span className="text-purple-400">GNSS</span> |{' '}
                <span className="text-blue-400">GIS</span> |{' '}
                <span className="text-purple-400">360 Mapping</span> |{' '}
                <span className="text-blue-400">3D Modeling</span> |{' '}
                <span className="text-pink-400">Drone Mapping</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...smoothTransition, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
              >
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    View Projects
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border-2 border-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all hover:bg-blue-500/10 h-[52px]"
                  >
                    Get in Touch
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Animated Background */}
          <div className="absolute inset-0 -z-9">
            <div  className="bg-transparent border-4 mb-2 border-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all hover:bg-blue-500/10" />
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
                Mapping with{' '}
                <span className="text-blue-400">heart, precision, and purpose.</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Hi! I'm a Geomatics Engineering graduate from Tribhuvan University with a big passion for everything geospatial. From 3D Modeling, GIS and 360° mapping to drone surveys, fieldwork, GNSS technologies and remote sensing, I love working with tools and technologies that help us better understand the world around us. I'm always eager to learn, explore new ideas, and be part of projects that make a real impact through smart mapping and spatial solutions.
              </p>
            </motion.div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-6">
              {[
                { number: "1+", label: "Years of Experience", className: "flex flex-col items-center justify-center" },
                { number: "5+", label: "Projects Completed", className: "flex flex-col items-center justify-center" },
                { number: "5+", label: "Training Attended", className: "flex flex-col items-center justify-center" },
                { number: "1", label: "Artical Published", className: "flex flex-col items-center justify-center" }
              ].map((stat, index) => (
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Gadgets & Software</h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Photogrammetry', items: ['Pix 4D', 'AgiSoft Metashape', 'DJI Terra', 'DJI Modify'] },
                { title: 'GIS & Mapping', items: ['ArcGIS', 'QGIS', 'uMap', 'OpenRoute Service'] },
                { title: 'Surveying', items: ['Total Station', 'Drones (Mavic 3E, Phantom 4 RTK)', 'DJI FlightHub2', 'DRTK', 'DGPS', 'Kobo Collect', 'ODK Collect'] },
                { title: 'Designing', items: ['Revit', 'Canva'] },
                { title: 'GNSS Data Processing', items: ['RTKLIB', 'U-Center'] },
                { title: 'Virtual Tour Mapping', items: ['3D Vista', 'Insta 360 Pro 2','PanoX'] },
              ].map((category, idx) => (
                <motion.div
                  key={category.title}
                  variants={fadeInUp}
                  className="relative overflow-hidden rounded-2xl border border-blue-900/40 bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-gray-950 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                    transition={{ ...smoothTransition, delay: idx * 0.05 }}
                >
                  <div className="absolute inset-px rounded-[18px] border border-blue-500/10" />
                  <div className="absolute -right-10 -top-12 w-44 h-44 bg-gradient-to-br from-blue-500/25 via-purple-500/20 to-pink-500/10 blur-3xl opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-100">
                        {category.items.length} tools
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map(item => (
                        <span
                          key={item}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/30 via-purple-500/25 to-blue-400/20 border border-blue-500/30 text-blue-50 text-sm shadow-[0_0_0_1px_rgba(59,130,246,0.15)]"
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
            <motion.div variants={fadeInUp} className="text-center mb-10">
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
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  variants={fadeInUp}
                  onClick={() => window.location.href = project.link}
                  className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer"
                >
                  <div className="aspect-[4/3] relative bg-gray-800 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{objectFit: 'cover'}}
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
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-gradient-to-b from-black to-black">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-12 py-5 rounded-full text-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                Connect with me
              </motion.button>
            </Link>
          </motion.div>
        </section>
      </main>
    </>
  )
} 