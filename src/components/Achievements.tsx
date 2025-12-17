'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const trainings = [
  {
    title: 'Elevate Nepal : Drone Fundamentals',
    date: '2024',
    summary: 'Drone ecosystem fundamentals under DEAP with Impact Hub Kathmandu.',
    description: [
      'Attended Elevate Nepal: Drone Fundamentals Training under the Drone Ecosystem Acceleration Program (DEAP).',
      'Explored drone business applications across surveying/mapping, agriculture, urban development, cinematography, and disaster preparedness.',
      'Grateful to Impact Hub Kathmandu for hosting, with support from The World Bank, KWPF, Impact447, and Airlift Technology.'
    ],
    tags: ['#ElevateNepal', '#DroneFundamentals', '#WorldBank', '#airlifttechnology', '#DroneEcosystem', '#impact447', '#KWPF', '#impacthubkathmandu'],
    image: '/images/certificates/Elevate_Nepal_Drone_Training.jpg'
  },
  {
    title: 'UTOKYO / ICG GNSS Training',
    date: 'Jan 27 – Feb 1, 2025',
    summary: 'Hands-on GNSS data logging and RTKLIB processing in Kathmandu.',
    description: [
      'Participated in UTOKYO/ICG Global Navigation Satellite Systems (GNSS) training in Kathmandu, Nepal.',
      'Covered latest GNSS developments with global service providers; practiced u-center for data logging and RTKLIB for precise processing.',
      'Connected with international technical experts to exchange GNSS applications and insights.',
      'Special thanks to Dr. Dinesh Manandhar (CSIS, University of Tokyo) and hosts NAST and Tribhuvan University (IOE, CSSGS).'
    ],
    tags: ['#GNSS', '#GeospatialTechnology', '#uCenter', '#RTKLIB', '#SatelliteNavigation', '#GeomaticsEngineering', '#InternationalCollaboration', '#Networking', '#UTokyo', '#UNOOSA', '#ICG', '#Nepal'],
    image: '/images/certificates/Gnss_Training_2025.jpg'
  },
  {
    title: 'CLIGEOS-2024 Geospatial School',
    date: 'April, 2024',
    summary: '5-day intensive geo school in Lumle, Kaski, Nepal.',
    description: [
      'Completed the 5-day CLImbing for CLImate GEOspatial School (CLIGEOS-2024) in Lumle, Kaski.',
      'Deep dives into GIS/Remote Sensing, open-source tools, geo big data, XR (VR/AR/MR), and drone surveying/remote mapping.',
      'Hands-on learning focused on climate change research and monitoring with international peers.',
      'Organized by Università degli Studi di Udine (Italy), LJ University (India), and CSSGS.'
    ],
    tags: ['#CLIGEOS', '#Climate', '#GIS', '#RemoteSensing', '#XR', '#DroneSurveying'],
    image: '/images/certificates/Cligeos.jpeg'
  },
  {
    title: 'Esri MOOC: Cartography',
    date: '6-week program',
    summary: 'Advanced cartography with ArcGIS Pro, symbology, projections, 3D & animation.',
    description: [
      'Completed Esri’s prestigious 6-week MOOC on Cartography, mastering symbology standards, projection systems, and 3D terrain modeling.',
      'Built animated, data-rich map visualizations using ArcGIS Pro and refined spatial analysis workflows.',
      'Applying these skills to produce clear, compelling maps that communicate complex spatial stories.'
    ],
    tags: ['#Cartography', '#GIS', '#Esri', '#ArcGISPro', '#ProfessionalGrowth', '#GeospatialExcell'],
    image: '/images/certificates/Esri_cartography_page-0001.jpg'
  },
  {
    title: 'Humanitarian Use of OSM Data',
    date: '2024',
    summary: 'HOTOSM course on QGIS, uMap, OpenRouteService, and Disaster Ninja.',
    description: [
      'Completed the “Humanitarian Use of OpenStreetMap Data” course by HOTOSM.',
      'Strengthened practical use of QGIS, uMap, OpenRouteService, and Disaster Ninja for humanitarian initiatives.',
      'Thanks to Sam Colchester and the HOTOSM team for comprehensive materials and guidance.'
    ],
    tags: ['#OpenData', '#HumanitarianMapping', '#OSM', '#QGIS', '#DisasterManagement', '#GIS'],
    image: '/images/certificates/osm.jpeg'
  }
]

const academicInvolvements = [
  {
    title: 'OSM Hackfest Pokhara',
    period: 'Team Lead • 2022 • Pokhara',
    description:
      'Led a team to showcase optimal EV charging-station placement across Pokhara Valley’s downtown core.',
    highlight: 'Hands-on spatial planning with OpenStreetMap & routing tools'
  },
  {
    title: 'Designer at Geo-World Volume-VI',
    period: 'Editorial Design • 2022',
    description:
      'Designed the Geo-World magazine (Volume VI) and supporting visuals, ensuring cohesive print-ready layouts.',
    highlight: 'Brand-consistent spreads and publication assets'
  },
  {
    title: 'E-Bike',
    period: 'Team Lead • 2020',
    description:
      'Built an electric bike from a scrap bicycle using a Viper motor, coordinating a 6-person build team.',
    highlight: 'Converted to EV drivetrain, wiring, and fit-out from scratch'
  },
  {
    title: 'Smart City Model',
    period: '1st Runner Up • Pokhara University Fest 2020',
    description:
      'Created a smart city model promoting Visit Nepal 2020, focusing on tourism-forward urban experiences.',
    highlight: 'Interactive model with visitor flow and amenity zoning concepts'
  }
]

const Achievements = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const selectedTraining = openIndex !== null ? trainings[openIndex] : null

  return (
    <section id="achievements" className="py-20 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Achievements</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
        </motion.div>

        {/* Trainings Section */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-blue-500"
          >
            Trainings & Certifications
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trainings.map((training, index) => {
              const isOpen = openIndex === index
              const isPdf = training.image.toLowerCase().endsWith('.pdf')
              return (
                <motion.div
                  key={training.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-800/80 shadow-lg flex flex-col gap-4"
                >
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-800 bg-black/40">
                    {isPdf ? (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm bg-gray-900/60">
                        Certificate (PDF)
                      </div>
                    ) : (
                      <Image
                        src={training.image}
                        alt={`${training.title} certificate`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                      />
                    )}
                  </div>
                  <div className="text-left space-y-2">
                    <h4 className="text-xl font-semibold text-white">{training.title}</h4>
                    <p className="text-blue-400 text-sm">{training.date}</p>
                    <p className="text-gray-300 text-sm">{training.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {training.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-blue-900/40 border border-blue-700/40 text-xs text-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setOpenIndex(index)}
                    className="self-start px-4 py-2 rounded-full border border-blue-500 text-blue-100 text-sm hover:bg-blue-500/10 transition-colors"
                  >
                    View Details
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Academic & Extracurricular Section */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5}}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-blue-500"
          >
            Academic & Extracurricular
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {academicInvolvements.map((involvement, index) => (
              <motion.div
                key={involvement.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: index * 0.12 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-xl border border-blue-900/40 bg-gradient-to-br from-gray-900/90 via-gray-950 to-gray-900 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
              >
                <div className="absolute inset-px rounded-[14px] border border-blue-500/10" />
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 blur-3xl" />
                <div className="absolute -left-8 -bottom-10 w-28 h-28 bg-purple-500/10 blur-3xl" />
                <div className="relative p-6 flex flex-col gap-3">
                  <h4 className="text-xl font-semibold text-white">{involvement.title}</h4>
                  <p className="text-blue-300 text-sm">{involvement.period}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{involvement.description}</p>
                  {involvement.highlight && (
                    <div className="text-xs text-blue-100 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2">
                      {involvement.highlight}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal overlay for details */}
      {selectedTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpenIndex(null)}
          />
          <div className="relative z-10 w-full max-w-5xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-start px-6 py-4 border-b border-gray-800">
              <div>
                <h3 className="text-2xl font-semibold text-white">{selectedTraining.title}</h3>
                <p className="text-blue-400 text-sm">{selectedTraining.date}</p>
              </div>
              <button
                onClick={() => setOpenIndex(null)}
                className="text-gray-300 hover:text-white border border-gray-700 rounded-full px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-800 bg-black/60">
                {selectedTraining.image.toLowerCase().endsWith('.pdf') ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-200 text-sm">
                    <span>Certificate (PDF)</span>
                    <a
                      href={selectedTraining.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full border border-blue-500 text-blue-100 hover:bg-blue-500/10 transition-colors text-sm"
                    >
                      Open Full Certificate
                    </a>
                  </div>
                ) : (
                  <Image
                    src={selectedTraining.image}
                    alt={`${selectedTraining.title} certificate`}
                    fill
                    className="object-contain bg-black"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                )}
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-gray-200 text-sm leading-relaxed">{selectedTraining.summary}</p>
                <div className="space-y-2 text-gray-200 text-sm leading-relaxed border-t border-gray-800 pt-3">
                  {selectedTraining.description.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTraining.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-blue-900/40 border border-blue-700/40 text-xs text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {!selectedTraining.image.toLowerCase().endsWith('.pdf') && (
                  <a
                    href={selectedTraining.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex px-4 py-2 rounded-full border border-blue-500 text-blue-100 text-sm hover:bg-blue-500/10 transition-colors w-fit"
                  >
                    Open Full Certificate
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Achievements 