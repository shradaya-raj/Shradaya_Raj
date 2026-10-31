'use client'

import React, { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import { motion, MotionConfig } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { Toaster, toast } from 'react-hot-toast'

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void
    onTurnstileExpired?: () => void
    turnstile?: { reset: () => void }
  }
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [mailReady, setMailReady] = useState<boolean | null>(null)
  const [siteContact, setSiteContact] = useState<{
    heading?: string
    imageSrc?: string
    imageAlt?: string
    email?: string
    location?: string
    social?: { linkedin?: string }
  } | null>(null)

  useEffect(() => {
    fetch('/api/contact/health').then(response => response.json()).then(health => setMailReady(health.smtpConfigured === true)).catch(() => setMailReady(false))
    const fetchSiteContact = async () => {
      try {
        const res = await fetch('/api/site/contact')
        if (!res.ok) return
        const data = await res.json()
        setSiteContact(data)
      } catch {
        // ignore; use defaults
      }
    }
    fetchSiteContact()
  }, [])

  const heading = siteContact?.heading ?? 'Contact Me'
  const imageSrc = siteContact?.imageSrc ?? '/profile-professional-2026.png'
  const imageAlt = siteContact?.imageAlt ?? 'Professional portrait of Shradaya Raj Poudel'
  const email = siteContact?.email ?? 'shradayarajpoudel@gmail.com'
  const location = siteContact?.location ?? 'Kathmandu, Nepal'
  const linkedin = siteContact?.social?.linkedin ?? 'https://www.linkedin.com/in/shradaya-raj-poudel-b11454273/'
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => setTurnstileToken(token)
    window.onTurnstileExpired = () => setTurnstileToken('')
    return () => {
      delete window.onTurnstileSuccess
      delete window.onTurnstileExpired
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (mailReady !== true) {
      toast.error('Please use the email link below to get in touch.')
      return
    }
    if (turnstileSiteKey && !turnstileToken) {
      toast.error('Please complete security verification.')
      return
    }

    setIsSubmitting(true)
    const form = e.currentTarget

    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || ''),
      company: String(formData.get('company') || ''),
      turnstileToken,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && (data.success === 'true' || data.success === true)) {
        toast.success('Message sent successfully!')
        form.reset()
        setTurnstileToken('')
        window.turnstile?.reset()
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      toast.error(message)
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <Navigation />
      <Toaster position="top-center" />
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
      ) : null}
      <main id="main-content" tabIndex={-1} className="contact-page min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center pt-20 pb-6">
        <div className="w-full max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            {/* Left side - Image */}
            <div className="contact-portrait relative h-[260px] md:h-auto bg-gray-900/50 rounded-xl overflow-hidden">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="contact-form-card bg-gray-900/50 p-5 sm:p-6 rounded-xl backdrop-blur-sm border border-gray-800 space-y-5"
            >
              <h1 className="text-3xl font-bold text-white">{heading}</h1>
              
              {mailReady === false && <div role="status" className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 space-y-3"><h2 className="text-xl font-semibold">Let’s talk about your project</h2><p className="text-gray-300">The contact form is temporarily unavailable. You can reach me directly by email.</p><a className="inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white" href={`mailto:${email}`}>Email me directly</a></div>}
              {mailReady !== false && <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Honeypot field for bots; must stay empty */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-gray-200 mb-2">Full name</label>
                  <input
                    id="contact-name"
                    autoComplete="name"
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-200 mb-2">Email address</label>
                  <input
                    id="contact-email"
                    autoComplete="email"
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-gray-200 mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Message"
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {turnstileSiteKey ? (
                  <div className="flex justify-center">
                    <div
                      className="cf-turnstile"
                      data-sitekey={turnstileSiteKey}
                      data-theme="dark"
                      data-callback="onTurnstileSuccess"
                      data-expired-callback="onTurnstileExpired"
                      data-error-callback="onTurnstileExpired"
                    />
                  </div>
                ) : null}

                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  type="submit"
                  className={`w-full bg-blue-500 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                  disabled={isSubmitting || mailReady !== true}
                >
                  {isSubmitting ? 'Sending...' : mailReady === null ? 'Checking availability…' : 'Send Message'}
                </motion.button>
              </form>}

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-gray-800 pt-4 text-sm">
                <div className="min-w-0 space-y-2">
                  <a href={`mailto:${email}`} className="block text-gray-300 break-all underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">{email}</a>
                  <p className="text-gray-300">{location}</p>
                </div>
                <Link href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="View LinkedIn profile (opens in a new tab)" className="p-3 rounded-full bg-gray-800 text-white hover:bg-blue-600 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </MotionConfig>
  )
}
