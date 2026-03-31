'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import Image from 'next/image'
import { getCloudinaryVideoUrl } from '@/lib/cloudinary'

const sectionShell =
  'relative overflow-hidden rounded-2xl border border-blue-900/35 bg-gradient-to-br from-gray-950 via-gray-950/85 to-gray-900/70 shadow-[0_22px_70px_rgba(0,0,0,0.35)]'
const innerBorder = 'absolute inset-px rounded-[15px] border border-blue-500/10 pointer-events-none'

export default function AirliftKailasCleanupCampaign() {
  const [showBaseCampVideo, setShowBaseCampVideo] = useState(false)
  const [showHoverTestVideo, setShowHoverTestVideo] = useState(false)
  const [showMarshallingVideo, setShowMarshallingVideo] = useState(false)
  const baseCampVideoSrc =
    getCloudinaryVideoUrl('manaslu/morning-on-base-camp') ?? '/images/Manaslu/Morning on Base Camp.mp4'
  const hoverTestVideoSrc =
    getCloudinaryVideoUrl('manaslu/hover-test-at-base-camp') ?? '/images/Manaslu/Hover test at Base Camp.mp4'
  const marshallingVideoSrc =
    getCloudinaryVideoUrl('manaslu/marshelling') ?? '/images/Manaslu/Marshelling.mp4'

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero */}
          <section className={`${sectionShell} mb-12`}>
            <div className={innerBorder} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              <div className="relative lg:col-span-3 aspect-[16/10] lg:h-[360px] rounded-2xl lg:rounded-r-none overflow-hidden">
                <Image
                  src="/images/Manaslu/Mount Manaslu.jpg"
                  alt="Mount Manaslu – Airlift Kailas Cleanup Campaign"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/55 border border-white/10 text-xs text-gray-100 backdrop-blur">
                    Mt. Manaslu • 8,163 m
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs text-blue-50 backdrop-blur">
                    Sept 4–27, 2025 • 24-day deployment
                  </span>
                </div>
              </div>

              <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col gap-5">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                    Airlift Kailas Cleanup Campaign
                  </h1>
                  <p className="text-gray-300 mt-3 text-sm">
                    High-altitude drone logistics and environmental reconnaissance expedition at Mt. Manaslu,
                    advancing autonomous systems for Himalayan waste management and climate monitoring.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['Drone Logistics', 'High-Altitude UAV', 'Climate Monitoring', 'Geospatial Analysis'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-blue-500/12 border border-blue-500/25 text-xs text-blue-50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <dl className="grid grid-cols-2 gap-3 mt-1 text-sm">
                  <div className="rounded-xl border border-blue-900/35 bg-black/30 px-4 py-3">
                    <dt className="text-gray-400 text-xs">Coverage</dt>
                    <dd className="text-blue-200 font-semibold text-base">5.5 km²</dd>
                  </div>
                  <div className="rounded-xl border border-blue-900/35 bg-black/30 px-4 py-3">
                    <dt className="text-gray-400 text-xs">Drone Platform</dt>
                    <dd className="text-blue-200 font-semibold text-base">DJI FC30</dd>
                  </div>
                  <div className="rounded-xl border border-blue-900/35 bg-black/30 px-4 py-3">
                    <dt className="text-gray-400 text-xs">Elevation Band</dt>
                    <dd className="text-blue-200 font-semibold text-base">2,630–6,000 m</dd>
                  </div>
                  <div className="rounded-xl border border-blue-900/35 bg-black/30 px-4 py-3">
                    <dt className="text-gray-400 text-xs">Team Size</dt>
                    <dd className="text-blue-200 font-semibold text-base">6 members</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          <div className="space-y-16">
            {/* Executive Summary */}
            <section className={sectionShell}>
              <div className={innerBorder} />
              <div className="relative p-8 space-y-6">
                <h2 className="text-3xl font-bold mb-2 text-blue-400">Executive Summary</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  The Airlift Kailas Cleanup Campaign (September 4–27, 2025) advanced high-altitude drone logistics
                  and environmental reconnaissance at Mt. Manaslu (8,163 m). Although full-scale waste transport
                  between Base Camp and Camp 1 was deferred due to technical constraints, the expedition delivered
                  detailed terrain mapping, validated operational envelopes, and produced geospatial datasets that
                  de-risk future autonomous logistics missions in extreme environments.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Over 24 days, the team mapped 5.5 km² with high-resolution photogrammetry, characterized
                  microclimate behaviour, and documented communication line-of-sight limitations. These results
                  now inform humanitarian logistics, sustainable mountaineering, and climate research across the
                  Manaslu Conservation Area.
                </p>
              </div>
            </section>

            {/* Expedition Overview */}
            <section className={sectionShell}>
              <div className={innerBorder} />
              <div className="relative p-8 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-blue-400">Expedition Overview</h2>
                    <h3 className="text-xl font-semibold text-white">Context & Significance</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Mount Manaslu, located in Nepal&apos;s Gorkha District within the 1,663 km² Manaslu Conservation Area,
                      faces mounting environmental pressure as expedition traffic grows—374 summit permits were issued in 2025.
                      Waste recovery at high camps still depends largely on human porterage in terrain with an historical
                      fatality rate of ~9%, making alternative logistics pathways both a safety and conservation priority.
                    </p>
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image
                      src="/images/Manaslu/View from Base camp.jpg"
                      alt="View from Manaslu Base Camp"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <p className="absolute bottom-3 left-4 text-xs text-gray-200">
                      View towards Birendra Lake catchment and upper Manaslu massif from Base Camp.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Strategic Objectives</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>
                        Establish and validate DJI FC30 drone delivery protocols between Base Camp (4,800 m) and Camp 1
                        (5,800 m) for future waste transport.
                      </li>
                      <li>
                        Generate orthomosaics and 3D models of Base Camp, Birendra Lake catchment, and glacial periphery
                        for planning and environmental monitoring.
                      </li>
                      <li>
                        Assess UAV-supported agricultural transport feasibility from Nubri Valley apple farms in Namrung and Lho.
                      </li>
                      <li>
                        Document micro-weather patterns and local perspectives on climate change from Sherpa communities.
                      </li>
                    </ul>
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image
                      src="/images/Manaslu/Team Image.jpg"
                      alt="Airlift Kailas technical team at Manaslu Base Camp"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <p className="absolute bottom-3 left-4 text-xs text-gray-200">
                      Technical team for Manaslu during the Airlift Kailas Cleanup Campaign.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Methodology & Field Operations */}
            <section className={sectionShell}>
              <div className={innerBorder} />
              <div className="relative p-8 space-y-8">
                <h2 className="text-3xl font-bold text-blue-400 mb-4">Methodology & Field Operations</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold text-white">Technical Framework</h3>
                    <p className="text-gray-300">
                      Operations combined FC30 cargo testing with DJI M3E mapping and DJI Terra / DJI Modify processing
                      to produce high-fidelity terrain products for logistics and hazard analysis.
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-blue-900/40 bg-black/40">
                      <table className="min-w-full text-sm text-left">
                        <thead className="bg-blue-900/40 text-blue-100">
                          <tr>
                            <th className="px-4 py-2 font-semibold">Component</th>
                            <th className="px-4 py-2 font-semibold">Specifications</th>
                            <th className="px-4 py-2 font-semibold">Purpose</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          <tr>
                            <td className="px-4 py-2">Platform</td>
                            <td className="px-4 py-2">DJI FlyCart 30 (FC30)</td>
                            <td className="px-4 py-2">Cargo transport and delivery envelope testing</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">Mapping System</td>
                            <td className="px-4 py-2">DJI M3E photogrammetry suite</td>
                            <td className="px-4 py-2">High-resolution terrain mapping</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">Processing</td>
                            <td className="px-4 py-2">DJI Terra &amp; DJI Modify</td>
                            <td className="px-4 py-2">3D model generation &amp; analysis</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">Team</td>
                            <td className="px-4 py-2">6 technical members</td>
                            <td className="px-4 py-2">Field operations &amp; data collection</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">Deployment</td>
                            <td className="px-4 py-2">24 days (4–27 Sept 2025)</td>
                            <td className="px-4 py-2">Continuous high-altitude assessment</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                    <Image
                      src="/images/Manaslu/Drone on ready to takeoff.jpg"
                      alt="Drone ready to take off at Manaslu Base Camp"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <p className="absolute bottom-3 left-4 text-xs text-gray-200">
                      FC30 pre-flight checks at Base Camp launch pad.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Operational Sites</h3>
                  <div className="overflow-x-auto rounded-xl border border-blue-900/40 bg-black/40">
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-blue-900/40 text-blue-100">
                        <tr>
                          <th className="px-4 py-2 font-semibold">Location</th>
                          <th className="px-4 py-2 font-semibold">Elevation</th>
                          <th className="px-4 py-2 font-semibold">Primary Purpose</th>
                          <th className="px-4 py-2 font-semibold">Key Deliverables</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        <tr>
                          <td className="px-4 py-2">Manaslu Base Camp</td>
                          <td className="px-4 py-2">4,800 m</td>
                          <td className="px-4 py-2">Logistics hub establishment</td>
                          <td className="px-4 py-2">3D terrain model, DEM</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Birendra Lake Catchment</td>
                          <td className="px-4 py-2">4,850 m</td>
                          <td className="px-4 py-2">Hydrological mapping</td>
                          <td className="px-4 py-2">Orthomosaic, watershed analysis</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Namrung Apple Farm</td>
                          <td className="px-4 py-2">2,630 m</td>
                          <td className="px-4 py-2">Agricultural feasibility</td>
                          <td className="px-4 py-2">Georeferenced imagery, route analysis</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Lho Apple Farm</td>
                          <td className="px-4 py-2">3,180 m</td>
                          <td className="px-4 py-2">Route optimisation</td>
                          <td className="px-4 py-2">Topographic mapping</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Potential Relay Point</td>
                          <td className="px-4 py-2">~6,000 m</td>
                          <td className="px-4 py-2">Comms assessment</td>
                          <td className="px-4 py-2">Line-of-sight visibility tables</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Samagaun Village</td>
                          <td className="px-4 py-2">3,530 m</td>
                          <td className="px-4 py-2">Community infrastructure mapping</td>
                          <td className="px-4 py-2">Orthomosaic, 3D model</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Data Collection Protocol</h3>
                  <ol className="list-decimal list-inside text-gray-300 space-y-2">
                    <li>Pre-mission waypoint and flight path planning using topographic basemaps.</li>
                    <li>In-situ verification of weather and GNSS stability every 30 minutes.</li>
                    <li>Simultaneous RGB, positional (GPS/GLONASS), and meteorological data acquisition.</li>
                    <li>
                      Structured interviews with 14 local guides and climbing staff on weather patterns and climate
                      change observations.
                    </li>
                  </ol>
                </div>

                {/* Base Camp video */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">Morning at Base Camp (Video)</h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Short field clip capturing morning conditions at Manaslu Base Camp, used for documenting micro‑weather,
                    visibility, and operational ambience before flight windows open.
                  </p>
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden border border-blue-900/40 bg-black/60">
                      {!showBaseCampVideo ? (
                        <button
                          type="button"
                          onClick={() => setShowBaseCampVideo(true)}
                          className="group relative w-full h-full"
                        >
                          <Image
                            src="/images/Manaslu/Welcome To Base Camp.jpg"
                            alt="Morning at Manaslu Base Camp – video thumbnail"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/80 group-hover:bg-blue-500 text-white shadow-xl">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7 ml-1"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </span>
                            <span className="text-sm text-gray-200">Tap to play with sound</span>
                          </div>
                        </button>
                      ) : (
                        <video
                          src={baseCampVideoSrc}
                          controls
                          autoPlay
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional field clips (muted) */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Field Operations – Silent Clips</h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Supporting clips from hover tests and marshalling operations at Base Camp. These are designed as
                    silent visuals to complement the main narrated base-camp video.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Hover test video (muted) */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-blue-900/40 bg-black/60">
                      {!showHoverTestVideo ? (
                        <button
                          type="button"
                          onClick={() => setShowHoverTestVideo(true)}
                          className="group relative w-full h-full"
                        >
                          <Image
                            src="/images/Manaslu/Drone on Launch pad.jpg"
                            alt="Hover test at Manaslu Base Camp – thumbnail"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-500/80 group-hover:bg-blue-500 text-white shadow-xl">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 ml-1"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </span>
                            <span className="text-xs text-gray-200">Tap to play (muted)</span>
                          </div>
                        </button>
                      ) : (
                        <video
                          src={hoverTestVideoSrc}
                          controls
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    {/* Marshalling video (muted) */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-blue-900/40 bg-black/60">
                      {!showMarshallingVideo ? (
                        <button
                          type="button"
                          onClick={() => setShowMarshallingVideo(true)}
                          className="group relative w-full h-full"
                        >
                          <Image
                            src="/images/Manaslu/Drone on ready to takeoff.jpg"
                            alt="Marshalling operations at Manaslu Base Camp – thumbnail"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-500/80 group-hover:bg-blue-500 text-white shadow-xl">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 ml-1"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </span>
                            <span className="text-xs text-gray-200">Tap to play (muted)</span>
                          </div>
                        </button>
                      ) : (
                        <video
                          src={marshallingVideoSrc}
                          controls
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Findings & Technical Analysis */}
            <section className={sectionShell}>
              <div className={innerBorder} />
              <div className="relative p-8 space-y-8">
                <h2 className="text-3xl font-bold text-blue-400 mb-2">Key Findings &amp; Technical Analysis</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">Environmental Constraints</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>350 m elevation range within Base Camp, generating competing microclimates.</li>
                      <li>Fog from Birendra Lake can form in 5–15 minutes, cutting flight windows by ~60%.</li>
                      <li>Inverted wind profile: 0–3 m/s at upper camps vs. gusts of up to 8 m/s at Base Camp.</li>
                      <li>Operational windows constrained to ~2–4 hours daily, typically 09:00–13:00.</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">Communications Infrastructure</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>No direct line-of-sight between Base Camp and Camp 1 due to intervening ridges.</li>
                      <li>Relay site at ~6,000 m offers ~85% coverage between camps.</li>
                      <li>Stable visibility from Base Camp to Camps 2 and 3 with ~95% signal reliability.</li>
                      <li>Mini-hydropower from ImagineNepal Club enabled limited but reliable charging capacity.</li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 space-y-3">
                    <h3 className="text-xl font-semibold text-white">Geospatial Deliverables</h3>
                    <p className="text-gray-300">
                      The campaign produced 5.5 km² of high-resolution terrain products used for logistics planning,
                      glacier monitoring, and risk assessment.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Point cloud density: 50–100 pts/m²</li>
                      <li>Orthomosaic resolution: 5 cm/pixel</li>
                      <li>DEM vertical accuracy: ±15 cm</li>
                      <li>Glacier-retreat baseline for 2025 and avalanche path mapping for key couloirs.</li>
                      <li>Hazard-zone overlays for Base Camp infrastructure planning.</li>
                    </ul>
                  </div>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                    <Image
                      src="/images/Manaslu/Me with drone.jpg"
                      alt="Field operations with drone at Manaslu"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <p className="absolute bottom-3 left-4 text-xs text-gray-200">
                      Field validation of FC30 performance in low-pressure, low-temperature conditions.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Limitations & Lessons Learned */}
            <section className={sectionShell}>
              <div className={innerBorder} />
              <div className="relative p-8 space-y-8">
                <h2 className="text-3xl font-bold text-blue-400 mb-2">Technical Limitations &amp; Lessons Learned</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">System Constraints Encountered</h3>
                    <ol className="list-decimal list-inside text-gray-300 space-y-2">
                      <li>Intermittent GNSS reliability above 5,000 m, with frequent loss of 5+ satellite lock.</li>
                      <li>Barometric altimeter drift (±50 m) and IMU instability in low-pressure conditions.</li>
                      <li>Battery performance degradation below 15°C, cutting effective flight time by ~40%.</li>
                      <li>Payload lift capacity ~25% below sea-level specifications at 5,800 m.</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Operational Adaptations</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Redundant GNSS monitoring with ground-based verification points.</li>
                      <li>Three micro-weather stations installed at 500 m elevation steps for gradient analysis.</li>
                      <li>Altitude-specific payload calibration tables from 0–6,000 m in 500 m increments.</li>
                      <li>Modular relay station architecture based on identified high-visibility ridges.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Strategic Implications & Future Trajectory */}
            <section className={sectionShell}>
              <div className={innerBorder} />
              <div className="relative p-8 space-y-8">
                <h2 className="text-3xl font-bold text-blue-400 mb-2">Strategic Implications &amp; Future Trajectory</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">Immediate Applications (2026 Season)</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>12 optimised flight paths with alternative routing protocols for poor-weather days.</li>
                      <li>15 mapped hazard zones (avalanche and crevasse) with recommended avoidance corridors.</li>
                      <li>
                        Feasibility report for apple transport routes from Nubri Valley farms to regional markets.
                      </li>
                      <li>
                        Fully compliant operations within MCAP and NTNC guidelines, informing future permits.
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">Long-term Institutional Value</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Baseline for annual glacier-retreat monitoring and hydrological analysis.</li>
                      <li>First high-altitude drone operations manual submitted to the Department of Tourism.</li>
                      <li>Seven targeted hardware improvement recommendations for extreme-altitude missions.</li>
                      <li>Evidence base contributing to Nepal&apos;s regulatory framework for autonomous logistics.</li>
                      <li>Digitised Sherpa climate observations preserved for long-term research.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className={sectionShell}>
              <div className={innerBorder} />
              <div className="relative p-8 space-y-4">
                <h2 className="text-3xl font-bold text-blue-400 mb-2">Conclusion</h2>
                <p className="text-gray-300 leading-relaxed">
                  The Airlift Kailas Cleanup Campaign transitioned high-altitude drone logistics from experimental
                  testing to systematic field deployment. While waste transport between camps remains contingent on
                  further technical refinement, the expedition established a replicable model for extreme-environment
                  reconnaissance and system validation.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  The resulting datasets and protocols strengthen sustainable mountain management, climate monitoring,
                  and community-focused logistics. They also demonstrate that integrating autonomous systems into
                  Himalayan conservation and supply chains is both feasible and increasingly necessary for resilient
                  operations in fragile alpine ecosystems.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}


