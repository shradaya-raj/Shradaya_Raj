'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

const callbacks = new Map<Element, () => void>()
let observer: IntersectionObserver | undefined

// Register only after this wrapper hydrates; never mutate streamed React markup.
export default function PortfolioMotion({ children, className = '' }: { children: ReactNode; className?: string }) {
  const element = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const target = element.current
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    if (!observer) observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        callbacks.get(entry.target)?.()
        callbacks.delete(entry.target)
        observer?.unobserve(entry.target)
      }
    }, { threshold: .08 })
    callbacks.set(target, () => setRevealed(true))
    observer.observe(target)
    return () => {
      callbacks.delete(target)
      observer?.unobserve(target)
      if (!callbacks.size) { observer?.disconnect(); observer = undefined }
    }
  }, [])
  return <div ref={element} data-reveal className={`${className}${revealed ? ' is-revealed' : ''}`}>{children}</div>
}
