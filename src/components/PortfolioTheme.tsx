'use client'

import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'light' | 'dark'
const ThemeContext = createContext({ theme: 'light' as Theme, toggle: () => {} })
export function usePortfolioTheme() { return useContext(ThemeContext) }
type ThemeTransition = { finished: Promise<void>; ready: Promise<void>; skipTransition: () => void }

export function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext)
  return (
    <button type="button" onClick={toggle} aria-label="Dark theme" aria-pressed={theme === 'dark'}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="theme-toggle inline-flex h-11 min-w-11 justify-center shrink-0 items-center gap-2 rounded-full border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        {theme === 'dark'
          ? <><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" /></>
          : <path strokeLinecap="round" strokeLinejoin="round" d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" />}
      </svg>
      <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  )
}

export default function PortfolioTheme({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [theme, setTheme] = useState<Theme>('light')
  const switching = useRef(false)
  const activeTransition = useRef<ThemeTransition>()
  useEffect(() => {
    const read = () => setTheme(document.documentElement.dataset.portfolioTheme === 'dark' ? 'dark' : 'light')
    read()
    const sync = (event: StorageEvent) => {
      if (event.key !== 'portfolio-theme') return
      document.documentElement.dataset.portfolioTheme = event.newValue === 'dark' ? 'dark' : 'light'
      read()
    }
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('storage', sync)
      activeTransition.current?.skipTransition()
      document.documentElement.classList.remove('theme-crossfade')
    }
  }, [])
  const toggle = () => {
    if (switching.current) return
    const root = document.documentElement
    const next = root.dataset.portfolioTheme === 'dark' ? 'light' : 'dark'
    const apply = () => {
      root.dataset.portfolioTheme = next
      flushSync(() => setTheme(next))
      try { localStorage.setItem('portfolio-theme', next) } catch { /* Switching remains available without storage. */ }
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return }

    const transitionDocument = document as Document & { startViewTransition?: (update: () => void) => ThemeTransition }
    switching.current = true
    const finish = () => {
      root.classList.remove('theme-crossfade')
      switching.current = false
      activeTransition.current = undefined
    }
    if (transitionDocument.startViewTransition) {
      root.classList.add('theme-crossfade')
      try {
        const transition = transitionDocument.startViewTransition(apply)
        activeTransition.current = transition
        void transition.ready.catch(() => {}) // Hidden tabs may skip the animation while still applying the theme.
        void transition.finished.then(finish, finish)
        return
      } catch { root.classList.remove('theme-crossfade') }
    }

    apply()
    finish()
  }
  return <ThemeContext.Provider value={{ theme, toggle }}>
    <div className={pathname?.startsWith('/admin') ? undefined : 'portfolio-public'}>
      {children}
      <div className="reading-progress" aria-hidden="true" />
    </div>
  </ThemeContext.Provider>
}
