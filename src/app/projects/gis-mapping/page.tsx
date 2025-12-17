'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function GISMappingProject() {
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
              src="/images/gis-mapping.jpg"
              alt="GIS Mapping System"
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">GIS Mapping System</h1>
          
          <div className="flex gap-2 mb-8">
            {["QGIS", "Python", "PostGIS", "Spatial Analysis"].map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-300">
              A comprehensive GIS mapping system developed for urban planning using QGIS and Python.
              This project demonstrates the integration of various spatial data sources and analysis
              techniques to support informed urban development decisions.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Project Overview</h2>
            <p className="text-gray-300">
              The system combines multiple data layers including land use, transportation networks,
              and demographic information to create interactive maps that aid in urban planning
              decision-making processes.
            </p>
          </div>
        </div>
      </main>
    </>
  )
} 