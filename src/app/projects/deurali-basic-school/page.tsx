'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function DeuraliBasicSchoolProject() {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <>
      <Navigation />
      {isImageOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageOpen(false)}
        >
          <div 
            className="relative w-[90vw] h-[90vh] max-w-7xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/images/catchment-area.png"
              alt="School Catchment Area Analysis"
              fill
              className="object-contain"
              quality={100}
              priority
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2"
              onClick={() => setIsImageOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <main className="min-h-screen bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          
          
          <div className="relative aspect-[21/9] w-full mb-8 rounded-xl overflow-hidden">
            <Image
              src="/images/deurali-basic-school/deurali-basic-school.png"
              alt="Deurali Basic School"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Deurali Basic School Project</h1>
              <div className="flex flex-wrap gap-2">
                {["Education", "Community Development", "Infrastructure", "Transportation", "Social Impact"].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-lg text-gray-300">
                A comprehensive study and implementation project at Deurali Basic School in Lahachok, Machhapuchhre Rural Municipality-4, Nepal, focusing on improving student accessibility through school bus service restoration and analyzing enrollment growth potential.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4">School Background</h2>
              <p className="text-gray-300">
                Established in 2057 B.S., Deurali Basic School is a government-funded institution serving as a crucial educational hub for students across several wards, including parts of Pokhara Metropolitan City. The school has earned recognition as the "Best Basic School" by the local municipality and is known for its innovative curriculum, including a locally initiated computer science program.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4">Project Overview</h2>
              <p className="text-gray-300">
                The project, scheduled for August 15, 2024, addresses a critical challenge: a sharp decline in student enrollment from 160 to 92 students post-COVID, primarily due to the discontinuation of school bus service. Our comprehensive study aims to evaluate and implement solutions to restore enrollment through improved transportation accessibility.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4">Methodology & Approach</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Conducted detailed surveys using KoboCollect for data collection</li>
                <li>Mapped student household locations with GPS coordinates</li>
                <li>Analyzed distance-based catchment areas using GIS technology</li>
                <li>Gathered community insights through interviews and feedback sessions</li>
                <li>Created comprehensive spatial analysis using ArcMap GIS software</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-6">Key Findings</h2>
              <div className="space-y-8">
                <div className="text-gray-300">
                  <h3 className="text-xl font-semibold mb-4">High Potential Areas for Enrollment</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Varthar (1-2 km): ~38 potential students</li>
                    <li>Mardi (3-4 km): ~25 potential students</li>
                    <li>Gaichaur (0-1 km): ~16 potential students</li>
                    <li>Bhalabot (3-4 km): ~14 potential students</li>
                    <li>Khaneypani (1-2 km): ~12 potential students</li>
                  </ul>
                  <p className="mt-4 font-semibold">Total estimated increase potential: Up to 97 additional students</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-6">Catchment Area Analysis</h3>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div 
                        className="w-full md:w-1/2 relative aspect-[10/10] rounded-xl overflow-hidden bg-white/5 cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => setIsImageOpen(true)}
                      >
                        <Image
                          src="/images/deurali-basic-school/catchment-area.png"
                          alt="School Catchment Area Analysis"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="w-full md:w-1/2 space-y-4">
                        <p className="text-gray-300">
                          Our detailed analysis of the school's catchment area reveals significant potential for enrollment growth across different zones. The study utilized advanced GIS mapping to identify optimal transportation routes and student distribution patterns.
                        </p>
                        <p className="text-sm text-gray-400">
                          Map showing student distribution across different zones with color-coded distance markers: 0-1 km (Yellow), 1-2 km (Blue), 2-3 km (Beige), and 3-4 km (Pink) from the school.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4 text-justify">Community Insights</h2>
              <div className="text-gray-300 space-y-4">
                <p>Local residents have expressed strong support for the bus service restoration:</p>
                <ul className="list-disc list-inside space-y-0 text-justify">
                  <li>Parents willing to transfer children from boarding schools due to cost benefits</li>
                  <li>Current safety concerns with unreliable local bus services</li>
                  <li>Need for safe and reliable transportation during adverse weather conditions</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4">Challenges & Considerations</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-justify">
                <li>Seasonal infrastructure challenges with non-asphalted roads</li>
                <li>Complex route planning requirements for optimal coverage</li>
                <li>Safety considerations for pick-up and drop-off points</li>
                <li>Weather-related accessibility issues during monsoon season</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4">Impact & Future Outlook</h2>
              <p className="text-gray-300 text-justify">
                This initiative demonstrates the crucial link between transportation infrastructure and educational access in rural Nepal. The implementation of a reliable school bus service has the potential to not only restore previous enrollment levels but also create new opportunities for educational inclusion and community development. The project's findings provide valuable insights for both immediate implementation and long-term educational planning in the region.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 