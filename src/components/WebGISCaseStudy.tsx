'use client'

import { useEffect, useRef, useState } from 'react'
import Image, { getImageProps } from 'next/image'
import DeferredVideo from '@/components/DeferredVideo'
import Navigation from '@/components/Navigation'
import PortfolioMotion from '@/components/PortfolioMotion'
import SurveyCharts from '@/components/SurveyCharts'
import type { Item } from '@/lib/types'

const chapterNames: Record<string, string> = {
  'PROJECT CONTEXT': 'Project overview',
  'FIELDWORK AND SPATIAL DATABASE': 'Fieldwork & mapping',
  'METRIC HOUSE NUMBERING': 'Metric House Numbering (MHN)',
  'WEBGIS IMPLEMENTATION': 'How the portal works',
  'SURVEY RESULTS': 'Survey results',
  'SCOPE AND NEXT STEPS': 'What could come next',
  'TEAM AND SUPERVISION': 'Team & supervision',
  'MY ROLE': 'My role: project lead, backend & database',
  'KEY FINDINGS': 'What we found',
}

export default function WebGISCaseStudy({ item }: { item: Item }) {
  const [image, setImage] = useState<string | null>(null)
  const imageTrigger = useRef<HTMLElement | null>(null)
  const openImage = (src: string) => {
    imageTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setImage(src)
  }
  const chapters = (item.fullText ?? '').split('\n\n').map((block) => {
    const [heading, ...body] = block.split('\n')
    return { heading, body: body.join('\n') }
  })
  const videoUrl = chapters.find((chapter) => chapter.heading === 'PROJECT VIDEO')?.body
  const videoSrc = item.attachments?.find((src) => /\.mp4$/i.test(src))
  const videoPoster = item.images[0] ? getImageProps({ src: item.images[0], alt: '', width: 960, height: 540, quality: 65 }).props.src : undefined
  const visuals = item.attachments?.filter((src) => /\.(png|jpe?g|webp)$/i.test(src)) ?? []
  const posterSrc = visuals.find((src) => /poster/i.test(src))
  const shell = 'rounded-2xl border border-blue-900/35 bg-gray-900/60 overflow-hidden'

  useEffect(() => {
    if (!image) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setImage(null)
      if (event.key === 'Tab') event.preventDefault()
    }
    window.addEventListener('keydown', close)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', close)
      imageTrigger.current?.focus({ preventScroll: true })
    }
  }, [image])

  return <>
    <Navigation />
    <main id="main-content" tabIndex={-1} className="webgis-case-study min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <header className={shell}>
          <div className="grid lg:grid-cols-5">
            <button type="button" onClick={() => openImage(item.images[0])} className="relative lg:col-span-3 min-h-[260px] lg:min-h-[440px] bg-white" aria-label="Enlarge WebGIS project dashboard">
              <Image src={item.images[0]} alt="WebGIS utility management dashboard" fill sizes="(min-width: 1024px) 650px, 100vw" className="object-contain p-3" priority />
            </button>
            <div className="lg:col-span-2 p-6 sm:p-8 space-y-5">
              <p className="text-sm text-blue-300 uppercase tracking-wider">Geomatics capstone · Shuklagandaki–8</p>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{item.title}</h1>
              <p className="text-gray-300 leading-relaxed">{item.description}</p>
              <div className="flex flex-wrap gap-2">{item.tags.map((tag) => <span key={tag} className="portfolio-tag text-xs rounded-md px-2.5 py-1">{tag}</span>)}</div>
              {videoUrl && <a href="#video" className="inline-flex rounded-full bg-blue-600 text-white px-5 py-3 font-semibold focus-visible:outline focus-visible:outline-offset-4">Watch project demonstration</a>}
            </div>
          </div>
        </header>

        <nav aria-label="Project sections" className="flex flex-wrap gap-3 text-sm">
          {[['overview', 'Overview'], ['methodology', 'Methodology'], ['metric-house-numbering', 'House numbering (MHN)'], ['results', 'Survey charts'], ['gallery', 'Project images'], ...(posterSrc ? [['poster', 'Project poster']] : []), ...(videoUrl ? [['video', 'Project video']] : [])].map(([id, label]) => <a key={id} href={`#${id}`} className="rounded-full border border-blue-900/35 px-4 py-2 text-blue-300 hover:underline">{label}</a>)}
        </nav>

        {chapters.filter((chapter) => !['PROJECT VIDEO', 'PROJECT VISUALS'].includes(chapter.heading)).map((chapter) => {
          const id = chapter.heading === 'PROJECT CONTEXT' ? 'overview' : chapter.heading === 'FIELDWORK AND SPATIAL DATABASE' ? 'methodology' : chapter.heading.toLowerCase().replaceAll(' ', '-')
          return <PortfolioMotion key={chapter.heading}>
            <section id={id} className={`${shell} p-5 sm:p-7 scroll-mt-24`}>
              <h2 className="text-2xl sm:text-3xl font-semibold text-blue-300 mb-4">{chapterNames[chapter.heading] ?? chapter.heading}</h2>
              {chapter.heading === 'KEY FINDINGS'
                ? <ul className="space-y-4 text-gray-300 text-base sm:text-lg leading-relaxed list-disc pl-5 marker:text-blue-300">{chapter.body.split('\n').filter(Boolean).map((finding) => <li key={finding} className="pl-1">{finding}</li>)}</ul>
                : <p className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap w-full">{chapter.body}</p>}
              {['FIELDWORK AND SPATIAL DATABASE', 'METRIC HOUSE NUMBERING'].includes(chapter.heading) && <div className="mt-8 grid sm:grid-cols-2 gap-6">{visuals.filter((src) => chapter.heading === 'METRIC HOUSE NUMBERING' ? /FLowchart|MHN-sample/.test(src) : /Methodology/.test(src)).map((src) => <button key={src} type="button" onClick={() => openImage(src)} className="relative h-[420px] rounded-xl bg-white overflow-hidden focus-visible:outline focus-visible:outline-blue-400" aria-label={`Enlarge ${src.split('/').pop()}`}><Image src={src} alt={src.includes('FLowchart') ? 'Metric house numbering workflow' : src.includes('MHN-sample') ? 'Metric house numbers assigned to buildings along Khaireyghari Marga' : 'Main project methodology'} fill sizes="(min-width: 640px) 480px, 90vw" className="object-contain p-4" /></button>)}</div>}
              {chapter.heading === 'SURVEY RESULTS' && item.visualizations && <div id="results" className="mt-8 scroll-mt-24"><SurveyCharts visualizations={item.visualizations} /></div>}
            </section>
          </PortfolioMotion>
        })}

        <section id="gallery" className={`${shell} p-6 sm:p-8 scroll-mt-24`}>
          <h2 className="text-2xl sm:text-3xl font-semibold text-blue-300 mb-3">Project images</h2>
          <p className="text-gray-300 mb-6">Our portal, study area and survey form. Select an image for a closer look.</p>
          <div className="grid sm:grid-cols-2 gap-6">{visuals.filter((src) => !/Methodology|FLowchart|MHN-sample|poster/i.test(src)).map((src) => <button key={src} type="button" onClick={() => openImage(src)} className="rounded-xl overflow-hidden border border-blue-900/35 text-left focus-visible:outline focus-visible:outline-blue-400"><div className="relative h-[280px] bg-white"><Image src={src} alt={src.split('/').pop()?.replaceAll('-', ' ') ?? 'Project image'} fill sizes="(min-width: 640px) 480px, 90vw" className="object-contain p-3" /></div><p className="px-4 py-3 text-sm text-blue-300">{src.includes('webportal') ? 'Interactive utility portal' : src.includes('Study_Area') ? 'Study area: Shuklagandaki Ward No. 8' : 'FMTM field-collection form'}</p></button>)}</div>
        </section>

        {posterSrc && <section id="poster" className={`${shell} p-6 sm:p-8 scroll-mt-24`}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-blue-300">Project poster</h2>
          </div>
          <p className="text-gray-300 mb-6">Our project poster, covering the study area, mapping workflow, house numbering and results.</p>
          <button type="button" onClick={() => openImage(posterSrc)} className="relative block w-full aspect-[7/5] rounded-xl overflow-hidden bg-white focus-visible:outline focus-visible:outline-blue-400" aria-label="Enlarge project poster"><Image src={posterSrc} alt="Academic poster: Developing Utility Management System through WebGIS and Metric House Numbering in Shuklagandaki Municipality Ward No. 8" fill sizes="(min-width: 1152px) 1056px, 90vw" className="object-contain" /></button>
          <div className="flex flex-wrap gap-4 mt-5"><button type="button" onClick={() => openImage(posterSrc)} className="rounded-full border border-blue-900/35 text-blue-300 px-5 py-3 font-semibold">View full-size poster</button></div>
        </section>}

        {videoUrl && <section id="video" className={`${shell} p-6 sm:p-8 scroll-mt-24`}>
          <h2 className="text-2xl sm:text-3xl font-semibold text-blue-300 mb-4">Project demonstration</h2>
          {videoSrc && <DeferredVideo controls playsInline preload="none" poster={videoPoster} className="w-full aspect-video object-contain rounded-xl bg-black mb-6" aria-label="WebGIS utility management project demonstration"><source src={videoSrc} type="video/mp4" />Your browser does not support video playback.</DeferredVideo>}
          <p className="text-gray-300 mb-6">Watch the portal walkthrough here or open the original LinkedIn post.</p>
          <a href={videoUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-blue-600 text-white px-6 py-3 font-semibold">Watch on LinkedIn ↗</a>
        </section>}
      </div>
    </main>
    {image && <div data-media-surface role="dialog" aria-modal="true" aria-label="Project image viewer" className="fixed inset-0 z-[100] bg-black/95 p-4 flex items-center justify-center" onClick={() => setImage(null)}>
      <div className="relative w-full max-w-6xl h-[85vh]" onClick={(event) => event.stopPropagation()}><Image src={image} alt="Enlarged project image" fill className="object-contain" sizes="100vw" /><button type="button" autoFocus onClick={() => setImage(null)} className="absolute right-0 top-0 rounded-full bg-white text-black px-5 py-3 font-semibold" aria-label="Close project image">Close</button></div>
    </div>}
  </>
}
