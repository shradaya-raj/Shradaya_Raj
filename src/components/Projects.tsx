'use client'

import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import type { Item } from '@/lib/types'

const Projects = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Item[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const smoothTransition = { duration: 1.2, ease: 'easeOut' }

  const resolveImageSrc = (item: Item) => {
    const firstImage = item.images?.[0]
    if (!firstImage) return '/images/project-placeholder.jpg'
    return firstImage.startsWith('/')
      ? firstImage
      : `/images/${item.category}/${item.slug}/${firstImage}`
  }

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/featured')
        const data = await res.json()
        if (Array.isArray(data)) setFeaturedProjects(data)
      } catch (err) {
        console.error('Failed to fetch featured projects for slider', err)
      }
    }

    fetchFeatured()
  }, [])

  useEffect(() => {
    if (featuredProjects.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === featuredProjects.length - 1 ? 0 : prevIndex + 1
      )
    }, 7000)

    return () => clearInterval(timer)
  }, [featuredProjects.length])

  useEffect(() => {
    if (currentIndex >= featuredProjects.length) setCurrentIndex(0)
  }, [featuredProjects.length, currentIndex])

  const active = featuredProjects[currentIndex]

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto" />
        </motion.div>

        <div className="relative h-[500px] overflow-hidden rounded-xl">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className="absolute inset-0 cursor-pointer"
                onClick={() => (window.location.href = `/projects/${active.slug}`)}
              >
                <div className="absolute inset-0">
                  <Image
                    src={resolveImageSrc(active)}
                    alt={active.title}
                    fill
                    className="object-cover"
                    priority={currentIndex === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                </div>

                <div className="relative h-full w-full rounded-xl p-8 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-200 text-xs font-bold uppercase tracking-wider">
                        Featured
                      </span>
                      <span className="text-xs text-gray-300 bg-black/30 border border-white/10 px-3 py-1 rounded-full">
                        {new Date(active.date).getFullYear()}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-white">{active.title}</h3>
                    <p className="text-gray-200 text-lg mb-6">{active.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {active.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm border border-blue-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-2 mt-6">
                    {featuredProjects.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentIndex(index)
                        }}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                          index === currentIndex ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                        aria-label={`Show featured project ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-white text-lg font-semibold">Loading featured projects...</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default Projects