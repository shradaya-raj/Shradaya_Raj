'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, MotionConfig, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'
import Image, { getImageProps } from 'next/image'
export type AboutPhoto = { imageSrc: string; imageAlt: string; position: string; fit?: string }
export type AboutContent = { heading: string; paragraphs: string[]; skills: string[]; photos?: AboutPhoto[] }

interface AboutProps {
  initialContent: AboutContent
}

const About = ({ initialContent }: AboutProps) => {
  const smoothTransition = { duration: 0.4, ease: 'easeOut' }
  const [siteAbout, setSiteAbout] = useState<AboutContent>(initialContent)

  useEffect(() => {
    let active = true
    const refresh = () => {
      fetch('/api/site/about', { cache: 'no-store' }).then(response => response.ok ? response.json() : null).then(content => { if (active && content) setSiteAbout(content) }).catch(() => {})
    }
    const onVisible = () => { if (!document.hidden) refresh() }
    refresh()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVisible)
    return () => { active = false; window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', onVisible) }
  }, [])

  const heading = siteAbout?.heading ?? 'About Me'
  const paragraphs =
    siteAbout?.paragraphs ?? [
      "I'm a Geomatics Engineering graduate from Tribhuvan University, based in Kathmandu, Nepal. My work combines drone surveying, GIS, GNSS, photogrammetry, 3D modeling and 360° mapping to turn field data into practical spatial solutions.",
      "My experience includes high-resolution mapping with Airlift Technology, drone-delivery assistance and flood-impact mapping on Mt. Manaslu. I've also handled drone-delivery operations following the Rasuwa-Bhotekoshi flood in Nepal, operating DJI FlyCart 100 and FlyCart 30 drones.",
      "My field-mapping experience with Galli Maps includes 360° capture across Pokhara, Butwal, Chitwan and Lumbini, alongside virtual-tour creation. I've also developed WebGIS solutions, including utility management with metric house numbering. Using tools such as DJI Terra, DJI Modify, DJI Reality, QGIS and ArcGIS, I focus on careful fieldwork and useful spatial data for infrastructure, environmental assessment and disaster response.",
    ]
  const skills = siteAbout?.skills ?? ['GNSS', 'GIS', 'Remote Sensing', '3D Mapping', '3D Modeling', 'Drone Mapping']

  return (
    <MotionConfig reducedMotion="user"><section id="about" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">{heading}</h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.09 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {paragraphs.map((p) => (
              <p key={p} className="text-lg sm:text-xl text-gray-300 text-left sm:text-justify">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.1 }}
            viewport={{ once: true }}
            className="h-full"
          >
            {!!siteAbout.photos?.length && <PhotoGallery key={JSON.stringify(siteAbout.photos)} photos={siteAbout.photos} />}
          </motion.div>
        </div>
      </div>
    </section></MotionConfig>
  )
}

function PhotoGallery({ photos }: { photos: AboutPhoto[] }) {
  const gallery = useRef<HTMLDivElement>(null)
  const visible = useInView(gallery)
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<number | null>(null)
  const active = photos[index]

  useEffect(() => {
    if (!visible || photos.length < 2) return
    const next = photos[(index + 1) % photos.length]
    const { props } = getImageProps({ src: next.imageSrc, alt: next.imageAlt, fill: true, sizes: '(max-width: 1024px) 100vw, 600px' })
    const image = new window.Image()
    image.sizes = props.sizes || ''
    image.srcset = props.srcSet || ''
    image.src = props.src
  }, [photos, index, visible])

  useEffect(() => {
    if (photos.length < 2 || !visible || reduceMotion || paused) return
    const timer = setInterval(() => { if (!document.hidden) setIndex(current => (current + 1) % photos.length) }, 5000)
    return () => clearInterval(timer)
  }, [photos.length, visible, reduceMotion, paused, index])

  const move = (direction: number) => setIndex(current => (current + direction + photos.length) % photos.length)
  return <div ref={gallery} data-media-surface role="region" tabIndex={0} aria-label="Photos of Shradaya Raj Poudel" aria-roledescription="carousel" aria-describedby="about-photo-instructions"
    onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); move(1) } else if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) } else if (event.key === ' ') { event.preventDefault(); setPaused(value => !value) } }}
    onTouchStart={event => { touchStart.current = event.touches[0].clientX }}
    onTouchEnd={event => { if (touchStart.current === null) return; const delta = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1); touchStart.current = null }}
    className="relative h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
    <p id="about-photo-instructions" className="sr-only">Use left and right arrow keys or swipe to browse photos. Space pauses or resumes the slideshow.</p>
    <AnimatePresence mode="sync" initial={false}>
      <motion.div key={active.imageSrc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.8, ease: 'easeInOut' }} className="absolute inset-0">
        <Image src={active.imageSrc} alt={active.imageAlt} fill sizes="(max-width: 1024px) 100vw, 600px" priority={index === 0} className={active.fit === 'contain' ? 'object-contain' : 'object-cover'} style={{ objectPosition: active.position }} />
      </motion.div>
    </AnimatePresence>

  </div>
}

const Skill = ({ children }: { children: React.ReactNode }) => (
  <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
    {children}
  </span>
)

export default About
