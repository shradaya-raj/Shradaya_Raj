'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function DroneMappingProject() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">
            ← Back to Home
          </Link>
          
          <div className="relative aspect-video w-full mb-8 rounded-xl overflow-hidden">
            <Image
              src="/images/drone-mapping.jpg"
              alt="Drone Mapping"
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">Drone Mapping</h1>
          
          <div className="flex gap-2 mb-8">
            {["UAV", "Photogrammetry", "Remote Sensing", "Agriculture"].map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-300">
              Aerial surveying and mapping project using UAV technology for precision agriculture.
              This project demonstrates the application of drone technology and photogrammetry
              for agricultural planning and monitoring.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Project Overview</h2>
            <p className="text-gray-300">
              Using advanced UAV equipment and photogrammetry software, we created high-resolution
              orthomosaics and elevation models to help farmers optimize crop management and
              resource allocation through precise spatial data.
            </p>
          </div>
        </div>
      </main>
    </>
  )
} 