'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Item } from '@/lib/types'
import { getPrimaryImagePath } from '@/lib/media'

export default function Projects({ initialProjects }: { initialProjects: Item[] }) {
  const carousel = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    if (carousel.current) observer.observe(carousel.current)
    return () => { query.removeEventListener('change', update); observer.disconnect() }
  }, [])
  useEffect(() => {
    if (!visible || paused || interacting || reducedMotion || initialProjects.length < 2) return
    const timer = setInterval(() => {
      if (!document.hidden) setIndex(current => (current + 1) % initialProjects.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [visible, paused, interacting, reducedMotion, initialProjects.length])
  const active = initialProjects[index]
  if (!active) return null
  return <section id="projects" className="py-12 sm:py-20 bg-gradient-to-b from-gray-900 to-black">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 sm:mb-12"><h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Projects</h2><div className="w-24 h-1 bg-blue-500 mx-auto" /></div>
      <div data-media-surface ref={carousel} aria-label="Featured projects" aria-roledescription="carousel" className="relative h-[540px] sm:h-[500px] overflow-hidden rounded-xl"
        onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false) }}>
        <Link href={`/projects/${active.slug}`} prefetch={false} className="absolute inset-0 block">
          <Image key={active.slug} src={getPrimaryImagePath(active) ?? '/images/project-placeholder.svg'} alt={active.title} fill sizes="(max-width: 1200px) 100vw, 1152px" className="object-cover" priority={index === 0} fetchPriority={index === 0 ? 'high' : 'auto'} />
          <div className="featured-project-shade absolute inset-0" />
          <div className="relative h-full w-full p-4 sm:p-8 pb-24 sm:pb-24 flex flex-col justify-end">
            <div className="featured-project-copy max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-4"><span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-200 text-xs font-bold uppercase tracking-wider">Featured</span><span className="text-xs text-gray-300 bg-black/30 border border-white/10 px-3 py-1 rounded-full">{active.date.slice(0, 4)}</span></div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">{active.title}</h3><p className="text-gray-200 text-sm sm:text-base mb-4">{active.description}</p>
              <div className="flex flex-wrap gap-2">{active.tags.map(tag => <span key={tag} className="featured-project-tag px-3 py-1 rounded-full text-sm">{tag}</span>)}</div>
            </div>
          </div>
        </Link>
        {initialProjects.length > 1 && <div className="absolute inset-x-0 bottom-3 flex flex-wrap justify-center items-center gap-1 px-3">
          {initialProjects.map((project, position) => <button key={project.slug} type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60" aria-label={`Show featured project ${position + 1}: ${project.title}`} aria-pressed={index === position} onClick={() => { setIndex(position); setPaused(true) }}><span aria-hidden="true" className={`block w-3 h-3 rounded-full ${position === index ? 'bg-green-400' : 'bg-gray-300'}`} /></button>)}
          {!reducedMotion && <button type="button" className="min-h-11 rounded-full bg-black/70 px-4 text-sm text-white border border-white/20" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume featured slideshow' : 'Pause featured slideshow'}>{paused ? 'Resume' : 'Pause'}</button>}
        </div>}
      </div>
    </div>
  </section>
}
