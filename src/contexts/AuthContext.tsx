'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if there's a stored auth state
    const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('auth') : null
    if (storedAuth) {
      setIsAuthenticated(JSON.parse(storedAuth))
    }
  }, [])

  const login = () => {
    setIsAuthenticated(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth', 'true')
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth')
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 