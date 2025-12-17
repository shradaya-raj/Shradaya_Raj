import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '../components/Providers'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

const metadataBase = process.env.NODE_ENV === 'production'
  ? 'https://shradayarajpoudel.com.np'
  : 'http://localhost:3001'

export const metadata: Metadata = {
  metadataBase: new URL(metadataBase),
  title: 'Shradaya Raj Poudel',
  description: 'Welcome to my portfolio website showcasing my work as a developer and designer. Explore my projects, skills, and achievements.',
  keywords: 'portfolio, developer, designer, web development, projects',
  authors: [{ name: 'Shradaya Raj Poudel' }],
  openGraph: {
    title: 'Shradaya Raj Poudel | Developer & Designer',
    description: 'Welcome to my portfolio website showcasing my work as a developer and designer.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Shradaya Raj Poudel - Portfolio'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shradaya Raj Poudel | Developer & Designer',
    description: 'Welcome to my portfolio website showcasing my work as a developer and designer.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 