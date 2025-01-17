"use client"

import React from 'react'
import { useTimerContext } from '@/contexts/TimerContext'
import { TimerDisplay } from '../organisms/TimerDisplay'
import { TimerControls } from '../organisms/TimerControls'
import { LittleBigTitle } from '../atoms/LittleBigTitle'
import { TimerName } from '../atoms/TimerName'

export const TimerTemplate: React.FC = () => {
  const { isDarkMode } = useTimerContext()

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-foreground bg-background">
      <LittleBigTitle />
      <TimerName />
      <TimerDisplay />
      <TimerControls />
    </div>
  )
}

export default TimerTemplate

