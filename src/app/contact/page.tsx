'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Toaster, toast } from 'react-hot-toast'

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const form = e.currentTarget

    // Create a temporary form element
    const tempForm = document.createElement('form')
    tempForm.action = 'https://formsubmit.co/ajax/shradayarajpoudel@gmail.com'
    tempForm.method = 'POST'

    // Copy form data
    const formData = new FormData(form)
    formData.append('_captcha', 'false')
    formData.append('_template', 'table')
    formData.append('_subject', 'New Contact Form Submission')

    try {
      const response = await fetch(tempForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        },
      })

      const data = await response.json()

      if (data.success === 'true' || data.success === true) {
        toast.success('Message sent successfully!')
        form.reset()
      } else {
        toast.error('Failed to send message. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navigation />
      <Toaster position="top-center" />
      <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left side - Image */}
            <div className="relative h-[420px] md:h-[520px] lg:h-[560px] bg-gray-900/50 rounded-xl overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Contact page featured image"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="bg-gray-900/50 p-8 rounded-lg backdrop-blur-sm border border-gray-800 space-y-8"
            >
              <h1 className="text-4xl font-bold mb-12 text-white">Contact Me</h1>
              
              <form 
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  type="submit"
                  className={`w-full bg-blue-500 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>

              <div className="mt-12 text-white flex justify-center items-center space-x-12">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold">Contact</h2>
                  <p className="text-gray-300">shradayarajpoudel@gmail.com</p>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-semibold">Based in</h2>
                  <p className="text-gray-300">Pokhara, Nepal</p>
                </div>
              </div>

              <div className="flex justify-center space-x-6 mt-8">
                <Link href="https://www.linkedin.com/in/shradaya-raj-poudel-b11454273/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-800 text-white hover:bg-blue-600 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  )
} 