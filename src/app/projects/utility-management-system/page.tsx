'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Import chart components
import DemographicsChart from '../../../components/charts/DemographicsChart'
import BuildingStructureChart from '../../../components/charts/BuildingStructureChart'
import InternetAccessChart from '../../../components/charts/InternetAccessChart'
import WaterSupplyChart from '../../../components/charts/WaterSupplyChart'
import RoofTypesChart from '../../../components/charts/RoofTypesChart'
import WallTypesChart from '../../../components/charts/WallTypesChart'
import EmploymentChart from '../../../components/charts/EmploymentChart'
import EducationChart from '../../../components/charts/EducationChart'

export default function UtilityManagementProject() {
  const [isImageOpen, setIsImageOpen] = useState(false)

  const sectionShell =
    'relative overflow-hidden rounded-2xl border border-blue-900/35 bg-gradient-to-br from-gray-950 via-gray-950/85 to-gray-900/60 shadow-[0_22px_70px_rgba(0,0,0,0.35)]'
  const innerBorder = 'absolute inset-px rounded-[15px] border border-blue-500/10 pointer-events-none'

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
              src="/images/UMS/Poster for ums.png"
              alt="WebGIS Dashboard"
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
      <main className="min-h-screen bg-black text-white pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Top actions */}
 

          {/* Hero */}
          <section className={`${sectionShell} mb-10`}>
            <div className={innerBorder} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              <button
                onClick={() => setIsImageOpen(true)}
                className="relative lg:col-span-3 aspect-[16/10] lg:aspect-auto lg:h-[420px] w-full overflow-hidden rounded-2xl lg:rounded-r-none focus:outline-none"
                aria-label="Open project poster"
              >
                <Image
                  src="/images/UMS/Poster for ums.png"
                  alt="WebGIS Utility Management System poster"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/55 border border-white/10 text-xs text-gray-100 backdrop-blur">
                    Capstone • Shuklagandaki-8
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs text-blue-50 backdrop-blur">
                    Click to zoom
                  </span>
                </div>
              </button>

              <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col gap-5">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                    WebGIS-Based Utility Management System
                  </h1>
                  <p className="text-gray-300 mt-3 leading-relaxed">
                    A pilot WebGIS platform for Ward No. 8, Shuklagandaki Municipality that brings metric house numbering, utility mapping, and citizen queries into a single interactive dashboard—powered by QGIS, Python, and MapTiler.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['QGIS', 'Python', 'FMTM', 'WebGIS', 'MapTiler', 'Metric House Numbering'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-blue-500/12 border border-blue-500/25 text-xs text-blue-50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  {[
                    { label: 'House numbers', value: '1,416' },
                    { label: 'Utility layers', value: '6+' },
                    { label: 'Internet readiness', value: '92.9%' },
                    { label: 'Households', value: '1,400+' }
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-blue-900/35 bg-black/30 px-4 py-3">
                      <div className="text-lg font-semibold text-blue-200">{item.value}</div>
                      <div className="text-xs text-gray-300">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-16">
            {/* Project Overview */}
            <section className={`${sectionShell}`}>
              <div className={innerBorder} />
              <div className="relative p-8">
              <h2 className="text-3xl font-bold mb-8 text-blue-400">Project Overview</h2>
              <div className="max-w-3xl text-lg text-gray-300 mb-12">
                <p className="mb-6">
                  This project developed a WebGIS-based utility management system integrated with metric house numbering for Ward No. 8, Shuklagandaki Municipality (Nepal). It supports better planning and service delivery by centralizing verified field data and making it easy to explore, query, and update.
                </p>
              </div>
              <div className="bg-gray-900/50 p-8 rounded-xl">
                <h3 className="text-2xl font-semibold mb-6 text-white">Population Demographics</h3>
                <div className="w-full max-w-2xl mx-auto h-[400px]">
                  <DemographicsChart />
                </div>
                <div className="text-center mt-6 text-gray-300">
                  <p>Total Population: 6,586</p>
                  <p>Males: 3,095 | Females: 3,491</p>
                </div>
              </div>
              </div>
            </section>

            {/* Project Background */}
            <section className={`${sectionShell}`}>
              <div className={innerBorder} />
              <div className="relative p-8">
              <h2 className="text-3xl font-bold mb-8 text-blue-400">Project Background</h2>
              <div className="space-y-12">
                <div className="text-gray-300">
                  <p className="mb-6 text-lg">
                    Ward No. 8 of Shuklagandaki Municipality, with over 6,200 residents and 1,977 buildings, faced significant urban planning challenges including:
                  </p>
                  <ul className="list-disc list-inside mb-6 ml-4 space-y-2">
                    <li>Lack of real-time utility data</li>
                    <li>Disorganized addressing systems</li>
                    <li>Inefficient service delivery</li>
                  </ul>
                  <p className="text-lg">
                    This project was initiated to digitally transform local infrastructure management through a data-driven platform.
                  </p>
                </div>
                
                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Study Area</h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 relative aspect-[10/10] rounded-xl overflow-hidden bg-white/5">
                      <Image
                        src="/images/UMS/Study_Area.png"
                        alt="Study Area Map"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                      <p className="text-gray-300 text-lg">
                        The study area encompasses Ward No. 8 of Shuklagandaki Municipality, a rapidly developing urban zone with diverse infrastructure needs. This area was selected for its representative mix of residential, commercial, and public utility requirements.
                      </p>
                      <p className="text-sm text-gray-400 italic">
                        Map showing the boundary and key features of Ward No. 8, Shuklagandaki Municipality, the pilot area for this WebGIS Utility Management System implementation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Building Characteristics</h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 space-y-4">
                      <p className="text-gray-300 text-lg">
                        Analysis of building characteristics in Ward No. 8 reveals diverse construction patterns. The majority of buildings feature concrete roofing, followed by metal sheets, with smaller proportions using traditional materials like stone and hay/khayer.
                      </p>
                    </div>
                    <div className="w-full md:w-1/2 relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-900/50 p-4">
                      <RoofTypesChart />
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </section>

            {/* Methodology & Technologies */}
            <section className={`${sectionShell}`}>
              <div className={innerBorder} />
              <div className="relative p-8">
              <h2 className="text-3xl font-bold mb-8 text-blue-400">Methodology & Technologies</h2>
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2 relative aspect-[8.5/9] rounded-xl overflow-hidden bg-gray-900/50">
                    <Image
                      src="/images/UMS/Main Methodology.png"
                      alt="Main Methodology Flowchart"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <div className="bg-gray-900/50 p-8 rounded-xl">
                      <h3 className="text-2xl font-semibold mb-6 text-white">Technical Stack</h3>
                      <ul className="list-none text-gray-300 space-y-4">
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400">•</span>
                          <span><strong className="text-blue-300">Frontend:</strong> React, MapTiler API, Tailwind CSS; UI/UX prototyping in Figma</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400">•</span>
                          <span><strong className="text-blue-300">Backend:</strong> Django with a lightweight Flask API layer</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400">•</span>
                          <span><strong className="text-blue-300">Database:</strong> SQLite for records; GeoJSON for web mapping</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400">•</span>
                          <span><strong className="text-blue-300">GIS tools:</strong> QGIS, HOTOSM workflows, ODK Collect / Kobo Toolbox</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400">•</span>
                          <span><strong className="text-blue-300">Remote sensing & digitization:</strong> Bing imagery, JOSM</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </section>

            {/* Metric House Numbering System */}
            <section className={`${sectionShell}`}>
              <div className={innerBorder} />
              <div className="relative p-8">
              <h2 className="text-3xl font-bold mb-8 text-blue-400">Metric House Numbering System</h2>
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2 space-y-6">
                    <div className="bg-gray-900/50 p-8 rounded-xl">
                      <p className="text-gray-300 text-lg mb-6">
                        The metric house numbering approach assigns unique IDs based on cumulative distance from road starting points. This creates a logical, navigable addressing system that is easier to maintain and extend as the ward grows.
                      </p>
                      <h4 className="text-xl font-semibold mb-4 text-white">Key Features:</h4>
                      <ul className="list-none text-gray-300 space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400">•</span>
                          <span>Distance-based numbering system</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400">•</span>
                          <span>Even numbers on right, odd on left</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400">•</span>
                          <span>Special handling for buildings on foot trails</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400">•</span>
                          <span>Integration with existing road network</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 relative aspect-[4/4] rounded-xl overflow-hidden bg-gray-900/50">
                    <Image
                      src="/images/UMS/House Numbering FLowchart.png"
                      alt="House Numbering Methodology"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Implementation Example</h3>
                  <div className="bg-gray-900/50 p-8 rounded-xl">
                    <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden">
                      <Image
                        src="/images/UMS/MHN-sample.png"
                        alt="Metric House Numbering Sample"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-4 italic text-center">
                      Sample implementation of the metric house numbering system showing distance-based addressing along roads
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </section>

            {/* System Features */}
            <section className={`${sectionShell}`}>
              <div className={innerBorder} />
              <div className="relative p-8">
              <h2 className="text-3xl font-bold mb-8 text-blue-400">System Features</h2>
              <div className="space-y-12">
                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Interactive Mapping Interface</h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 relative aspect-[16/9] rounded-xl overflow-hidden">
                      <Image
                        src="/images/UMS/map.png"
                        alt="Interactive Map Interface"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <p className="text-gray-300 text-lg">
                        An interactive map lets users explore multiple utility layers with search, filtering, and quick inspection of assets for planning and response.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Administrative Dashboard</h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2">
                      <p className="text-gray-300 text-lg">
                        An admin dashboard supports data validation, user access control, and maintenance workflows for reliable, up-to-date records.
                      </p>
                    </div>
                    <div className="w-full md:w-1/2 relative aspect-[16/9] rounded-xl overflow-hidden">
                      <Image
                        src="/images/UMS/admin.png"
                        alt="Administrative Dashboard"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Attribute Management</h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 relative aspect-[16/9] rounded-xl overflow-hidden">
                      <Image
                        src="/images/UMS/attribute.png"
                        alt="Attribute Management Interface"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <p className="text-gray-300 text-lg">
                        Detailed attribute tables store technical specs, operational status, and maintenance notes for each utility feature.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">User Query System</h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2">
                      <p className="text-gray-300 text-lg mb-4">
                        A resident-facing query form allows people to report issues or request information. Submissions are routed to the admin panel for follow-up and resolution.
                      </p>
                      <p className="text-sm text-gray-400 italic">
                        This feature enhances communication between residents and ward authorities, ensuring efficient handling of utility-related concerns.
                      </p>
                    </div>
                    <div className="w-full md:w-1/2 relative aspect-[16/9] rounded-xl overflow-hidden">
                      <Image
                        src="/images/UMS/contact.png"
                        alt="User Query Contact Form"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Field Survey Authorization</h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2">
                      <p className="text-gray-300 text-lg mb-4">
                        This is the official authorization letter received from Ward No. 8 Office of Shuklagandaki Municipality, granting our team permission to conduct comprehensive field surveys and data collection activities. The letter was crucial for initiating our project work in the ward.
                      </p>
                      <p className="text-sm text-gray-400 italic">
                        The formal approval enabled us to access and map utility infrastructure, conduct household surveys, and gather essential data for the WebGIS system development.
                      </p>
                    </div>
                    <div className="w-full md:w-1/2 relative aspect-[4/5] rounded-xl overflow-hidden">
                      <Image
                        src="/images/UMS/Letter.png"
                        alt="Ward Office Field Survey Authorization Letter"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </section>

            {/* Results & Impact */}
            <section className={`${sectionShell}`}>
              <div className={innerBorder} />
              <div className="relative p-8">
              <h2 className="text-3xl font-bold mb-8 text-blue-400">Results & Impact</h2>
              <div className="bg-gray-900/50 p-8 rounded-xl">
                <div className="max-w-3xl mx-auto">
                  <p className="text-xl text-gray-300 mb-8">The project achieved significant milestones in digital transformation:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-900/30 p-6 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 text-2xl">✓</span>
                        <span className="text-gray-300 text-lg">Successfully assigned 1,416 unique metric house numbers</span>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 p-6 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 text-2xl">✓</span>
                        <span className="text-gray-300 text-lg">Mapped and visualized over 6 utility categories</span>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 p-6 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 text-2xl">✓</span>
                        <span className="text-gray-300 text-lg">Enabled digital reporting for 1,400+ households</span>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 p-6 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 text-2xl">✓</span>
                        <span className="text-gray-300 text-lg">Demonstrated 92.9% internet access readiness</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </section>

            {/* Field Survey Statistics */}
            <section className={`${sectionShell}`}>
              <div className={innerBorder} />
              <div className="relative p-8">
              <h2 className="text-3xl font-bold mb-8 text-blue-400">Field Survey Statistics</h2>
              <div className="space-y-12">
                {/* Demographics */}
                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Demographics</h3>
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/2 bg-gray-900/50 p-6 rounded-xl">
                      <DemographicsChart />
                    </div>
                    <div className="w-full md:w-1/2">
                      <div className="bg-blue-900/30 p-6 rounded-xl">
                        <p className="text-xl text-white mb-4">Total population breakdown:</p>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3">
                            <span className="text-blue-400 text-xl">•</span>
                            <span className="text-gray-300 text-lg">Males: 3,095</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="text-blue-400 text-xl">•</span>
                            <span className="text-gray-300 text-lg">Females: 3,491</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Building Structure */}
                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Building Structure</h3>
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/2">
                      <div className="bg-blue-900/30 p-6 rounded-xl">
                        <p className="text-xl text-white mb-4">Building permanence:</p>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3">
                            <span className="text-blue-400 text-xl">•</span>
                            <span className="text-gray-300 text-lg">71.6% (1,416 structures) are permanent buildings</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="text-blue-400 text-xl">•</span>
                            <span className="text-gray-300 text-lg">28.4% (561 structures) are temporary structures</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 bg-gray-900/50 p-6 rounded-xl">
                      <BuildingStructureChart />
                    </div>
                  </div>
                </div>

                {/* Internet Access */}
                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Internet Connectivity</h3>
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/2 bg-gray-900/50 p-6 rounded-xl">
                      <InternetAccessChart />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                      <div className="text-gray-300">
                        <p className="mb-4">Internet access distribution:</p>
                        <ul className="list-disc list-inside space-y-2">
                          <li>92.9% (1,315 households) have internet access</li>
                          <li>7.1% (101 households) lack internet access</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Water Supply */}
                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Water Supply System</h3>
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/2 space-y-4">
                      <div className="text-gray-300">
                        <p className="mb-4">Water supply distribution:</p>
                        <ul className="list-disc list-inside space-y-2">
                          <li>86.86% (1,230 families) use private supply system</li>
                          <li>13.14% (186 houses) depend on communal supply system</li>
                        </ul>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 bg-gray-900/50 p-6 rounded-xl">
                      <WaterSupplyChart />
                    </div>
                  </div>
                </div>

                {/* Roof Types */}
                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Roof Types</h3>
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/2 bg-gray-900/50 p-6 rounded-xl">
                      <RoofTypesChart />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                      <div className="text-gray-300">
                        <p className="mb-4">Distribution of roof types:</p>
                        <ul className="list-disc list-inside space-y-2">
                          <li>73.31% (1,038 households) have concrete roofs</li>
                          <li>18.79% (266 households) have metal sheet roofs</li>
                          <li>3.74% (53 households) have stone roofs</li>
                          <li>4.17% (59 households) have khayer/hay roofs</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wall Types */}
                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Wall Types</h3>
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/2 space-y-4">
                      <div className="text-gray-300">
                        <p className="mb-4">Distribution of wall types:</p>
                        <ul className="list-disc list-inside space-y-2">
                          <li>59.75% (846 households) have brick walls</li>
                          <li>24.08% (341 households) have block walls</li>
                          <li>8.97% (127 households) have stone walls</li>
                          <li>6.85% (97 households) have mud walls</li>
                          <li>0.35% (5 households) have metal sheet walls</li>
                        </ul>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 bg-gray-900/50 p-6 rounded-xl">
                      <WallTypesChart />
                    </div>
                  </div>
                </div>

                {/* Employment Status */}
                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Employment Status</h3>
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/2 bg-gray-900/50 p-6 rounded-xl">
                      <EmploymentChart />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                      <div className="text-gray-300">
                        <p className="mb-4">Employment distribution:</p>
                        <ul className="list-disc list-inside space-y-2">
                          <li>54.87% (777 individuals) are foreign-employed</li>
                          <li>25.07% (355 individuals) are self-employed</li>
                          <li>15.04% (213 individuals) are employed</li>
                          <li>5.01% (71 individuals) are unemployed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="bg-gray-900/50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Education Status</h3>
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/2 space-y-4">
                      <div className="text-gray-300">
                        <p className="mb-4">Education distribution:</p>
                        <ul className="list-disc list-inside space-y-2">
                          <li>50.0% (708 households) have members attending government schools</li>
                          <li>40.04% (567 households) have members in private schools</li>
                          <li>9.96% (141 households) are unschooled</li>
                        </ul>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 bg-gray-900/50 p-6 rounded-xl">
                      <EducationChart />
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </section>

            {/* Project Poster */}
            <section className={`${sectionShell}`}>
              <div className={innerBorder} />
              <div className="relative p-8">
              <h2 className="text-3xl font-bold mb-8 text-blue-400">Project Poster</h2>
              <div className="bg-gray-900/50 p-8 rounded-xl">
                <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden">
                  <Image
                    src="/images/UMS/Poster for ums.png"
                    alt="Project Poster"
                    fill
                    className="object-contain"
                    quality={100}
                  />
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setIsImageOpen(true)}
                    className="px-5 py-2 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-50 text-sm hover:bg-blue-500/20 transition-colors"
                  >
                    Open poster in full screen
                  </button>
                </div>
              </div>
              </div>
            </section>

            {/* Future Scope */}
            <section className={`${sectionShell}`}>
              <div className={innerBorder} />
              <div className="relative p-8">
              <h2 className="text-3xl font-bold mb-8 text-blue-400">Future Scope</h2>
              <div className="bg-gray-900/50 p-8 rounded-xl">
                <div className="max-w-3xl">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    This project serves as a replicable model for smart ward-level governance in Nepal, with potential for scaling across all 753 municipalities. Aligned with the Digital Nepal Framework and UN Sustainable Development Goals, it demonstrates how spatial intelligence and community engagement can revolutionize local governance and urban planning.
                  </p>
                </div>
              </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}