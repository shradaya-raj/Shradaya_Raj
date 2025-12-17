'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed w-full z-50 bg-gradient-to-r from-black/90 via-blue-900/50 to-purple-900/50 backdrop-blur-md border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Shradaya Raj
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/" isActive={pathname === '/'}>Home</NavLink>
              <NavLink href="/projects" isActive={pathname?.startsWith('/projects') ?? false}>Projects</NavLink>
              <NavLink href="/achievements" isActive={pathname === '/achievements'}>Achievements</NavLink>
              <NavLink href="/about" isActive={pathname === '/about'}>About</NavLink>
              <NavLink href="/contact" isActive={pathname === '/contact'}>Contact</NavLink>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-400 hover:text-white hover:bg-blue-500/20 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className="md:hidden"
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink href="/" isActive={pathname === '/'}>Home</MobileNavLink>
          <MobileNavLink href="/projects" isActive={pathname?.startsWith('/projects') ?? false}>Projects</MobileNavLink>
          <MobileNavLink href="/about" isActive={pathname === '/about'}>About</MobileNavLink>
          <MobileNavLink href="/achievements" isActive={pathname === '/achievements'}>Achievements</MobileNavLink>
          <MobileNavLink href="/contact" isActive={pathname === '/contact'}>Contact</MobileNavLink>
        </div>
      </motion.div>
    </nav>
  )
}

const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
  <Link
    href={href}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/10'
        : 'text-gray-300 hover:text-white hover:bg-blue-500/10'
    }`}
  >
    {children}
  </Link>
)

const MobileNavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
  <Link
    href={href}
    className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
      isActive
        ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/10'
        : 'text-gray-300 hover:text-white hover:bg-blue-500/10'
    }`}
  >
    {children}
  </Link>
)

export default Navigation