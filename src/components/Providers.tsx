'use client'

import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from './ErrorBoundary'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ErrorBoundary>
  )
} 