'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const lists: Record<string, string> = {
  projects: 'Projects',
  achievements: 'Achievements',
  eca: 'Activities',
}

export default function DetailBackLink() {
  const pathname = usePathname()
  const segments = pathname?.split('/').filter(Boolean) ?? []
  const label = lists[segments[0]]

  if (segments.length !== 2 || !label) return null

  return (
    <Link
      href={`/${segments[0]}`}
      aria-label={`Back to ${label}`}
      className="portfolio-back-link fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-slate-900/95 px-5 py-3 text-sm font-medium text-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-colors hover:border-blue-400/50 hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300 sm:right-6"
    >
      <span>Back to {label}</span>
    </Link>
  )
}
