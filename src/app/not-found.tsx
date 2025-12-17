'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl text-gray-300 mb-8">Page Not Found</h2>
          <Link
            href="/"
            className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors inline-block"
          >
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 