'use client'

import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from './ErrorBoundary'
import { MotionConfig } from 'framer-motion'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </AuthProvider>
    </ErrorBoundary>
  )
}
