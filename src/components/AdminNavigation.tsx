'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  ['Dashboard', '/admin'],
  ['Home', '/admin/pages/home'],
  ['About', '/admin/pages/about'],
  ['Contact', '/admin/pages/contact'],
  ['Content library', '/admin/upload'],
  ['AI assistant', '/admin/ai'],
];

export default function AdminNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const renderLinks = () => links.map(([name, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? 'page' : undefined} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${pathname === href ? 'bg-gradient-to-r from-blue-500/25 to-purple-500/25 text-white shadow-lg shadow-blue-500/10' : 'text-gray-300 hover:bg-blue-500/10 hover:text-white'}`}>{name}</Link>);
  return <nav aria-label="Admin navigation" className="fixed top-0 left-0 w-full z-50 border-b border-blue-500/20 bg-gradient-to-r from-black/90 via-blue-900/50 to-purple-900/50 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6"><div className="h-16 flex items-center justify-between gap-4">
      <Link href="/admin" onClick={() => setOpen(false)} className="shrink-0 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Shradaya Raj <span className="text-xs text-blue-200 font-medium">Admin</span></Link>
      <div className="hidden lg:flex items-center gap-1">{renderLinks()}<Link href="/" className="ml-2 text-sm text-blue-300 px-3 py-2">View website ↗</Link></div>
      <button type="button" aria-expanded={open} aria-controls="admin-menu" aria-label={open ? 'Close admin menu' : 'Open admin menu'} onClick={() => setOpen(!open)} className="lg:hidden rounded-lg px-3 py-2 text-blue-200 border border-blue-500/30">{open ? 'Close ✕' : 'Menu ☰'}</button>
    </div>{open && <div id="admin-menu" className="lg:hidden flex flex-col gap-1 pb-4">{renderLinks()}<Link href="/" onClick={() => setOpen(false)} className="px-3 py-2 text-blue-300 text-sm">View website ↗</Link></div>}</div>
  </nav>;
}
