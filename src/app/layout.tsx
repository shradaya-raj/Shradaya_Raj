import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '../components/Providers'
import DetailBackLink from '../components/DetailBackLink'
import PortfolioTheme from '../components/PortfolioTheme'
import Script from 'next/script'
import homeContent from '../../data/site/home.json'
import { siteUrl } from '@/lib/metadata'

const inter = Inter({ subsets: ['latin'] })
const siteDescription = `${homeContent.name}, ${homeContent.role}. Projects and field experience in ${homeContent.highlights.join(', ')}.`

const metadataBase = process.env.NODE_ENV === 'production'
  ? siteUrl
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(metadataBase),
  title: homeContent.name,
  alternates: { canonical: '/' },
  description: siteDescription,
  keywords: homeContent.highlights,
  authors: [{ name: 'Shradaya Raj Poudel' }],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/profile1.jpg',
  },
  openGraph: {
    title: `${homeContent.name} | ${homeContent.role}`,
    description: siteDescription,
    type: 'website',
    images: [
      {
        url: homeContent.profileImage,
        alt: 'Shradaya Raj Poudel - Portfolio'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${homeContent.name} | ${homeContent.role}`,
    description: siteDescription,
    images: [homeContent.profileImage],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.dataset.portfolioTheme=localStorage.getItem('portfolio-theme')==='dark'?'dark':'light'}catch{document.documentElement.dataset.portfolioTheme='light'}` }} />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <a href="#main-content" className="skip-navigation">Skip to content</a>
        <Providers>
          <PortfolioTheme>
            {children}
            <DetailBackLink />
          </PortfolioTheme>
        </Providers>
      </body>
    </html>
  )
} 
