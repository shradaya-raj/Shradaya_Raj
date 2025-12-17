'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Sample project data - you can modify this according to your actual projects
const projects = [
    {
        id: 1,
        title: "GIS Mapping Project",
        description: "Comprehensive mapping and spatial analysis of urban infrastructure using QGIS and ArcGIS.",
        image: "/project1.jpg", // Add your project images
        technologies: ["QGIS", "ArcGIS", "Spatial Analysis"]
    },
    {
        id: 2,
        title: "Drone Mapping Survey",
        description: "High-resolution aerial mapping and 3D modeling of archaeological sites using drone technology.",
        image: "/project2.jpg",
        technologies: ["Drone Mapping", "Photogrammetry", "3D Modeling"]
    },
    {
        id: 3,
        title: "GNSS Network Analysis",
        description: "Development of a GNSS network optimization algorithm for improved positioning accuracy.",
        image: "/project3.jpg",
        technologies: ["GNSS", "Python", "Network Analysis"]
    }
]

const Projects = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const smoothTransition = { duration: 1.2, ease: 'easeOut' }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === projects.length - 1 ? 0 : prevIndex + 1
            )
        }, 7000) // 7 seconds interval

        return () => clearInterval(timer)
    }, [])

    return (
        <section id="projects" className="py-20 bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={smoothTransition}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4">Projects</h2>
                    <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
                </motion.div>

                <div className="relative h-[500px] overflow-hidden rounded-xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -300 }}
                            transition={{ duration: 0.9, ease: 'easeInOut' }}
                            className="absolute inset-0"
                        >
                            <div className="h-full w-full bg-gray-800 rounded-xl p-8 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">{projects[currentIndex].title}</h3>
                                    <p className="text-gray-300 text-lg mb-6">{projects[currentIndex].description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {projects[currentIndex].technologies.map((tech, index) => (
                                            <span 
                                                key={index}
                                                className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-center space-x-2 mt-6">
                                    {projects.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                                                index === currentIndex ? 'bg-blue-500' : 'bg-gray-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default Projects 