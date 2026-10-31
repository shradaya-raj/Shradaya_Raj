'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const CinematicBackdrop = dynamic(() => import('./CinematicBackdrop'), { ssr: false })

// Keep the detailed survey artwork on wide screens without hydrating hundreds
// of decorative SVG nodes on a phone. The small-screen background stays static.
export default function ResponsiveBackdrop() {
  const [detailed, setDetailed] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1100px) and (prefers-reduced-motion: no-preference)')
    const update = () => setDetailed(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return detailed ? <CinematicBackdrop /> : <div aria-hidden="true" className="cinematic-scene" data-running="false"><div className="survey-art"><div className="survey-orb survey-orb-one" /><div className="survey-orb survey-orb-two" /></div></div>
}
