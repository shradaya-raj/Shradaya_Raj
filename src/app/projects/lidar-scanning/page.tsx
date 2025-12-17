'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LiDARScanningProject() {
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
              src="/images/lidar-scanning.jpg"
              alt="3D LiDAR Scanning"
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">3D LiDAR Scanning</h1>
          
          <div className="flex gap-2 mb-8">
            {["LiDAR", "3D Modeling", "AutoCAD", "Point Cloud"].map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-300">
              High-precision 3D scanning and modeling of historical buildings using LiDAR technology.
              This project showcases the application of advanced scanning techniques for heritage
              preservation and documentation.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Project Overview</h2>
            <p className="text-gray-300">
              Using state-of-the-art LiDAR equipment, we captured detailed point cloud data of
              historical structures, which was then processed into accurate 3D models for
              preservation, restoration planning, and documentation purposes.
            </p>
          </div>
        </div>
      </main>
    </>
  )
} 