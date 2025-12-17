'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import Achievements from '@/components/Achievements'

export default function AchievementsPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <Achievements />
      </main>
    </>
  )
} 