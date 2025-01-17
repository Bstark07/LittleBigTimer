"use client"

import React, { createContext, useContext } from 'react'
import { Time, TimerHistory } from '@/types/timer'

interface TimerContextType {
  time: Time
  setTime: (time: Time) => void
  isRunning: boolean
  isActiveMode: boolean
  timerName: string
  setTimerName: (name: string) => void
  backgroundColor: string
  setBackgroundColor: (color: string) => void
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
  digitSize: number
  setDigitSize: (size: number) => void
  timerFormat: 'digital' | 'text'
  setTimerFormat: (format: 'digital' | 'text') => void
  fontFamily: string
  setFontFamily: (font: string) => void
  alarmSound: string
  setAlarmSound: (sound: string) => void
  timerHistory: TimerHistory[]
  startTimer: () => void
  stopTimer: () => void
  resetTimer: (isDoubleClick?: boolean) => void
  addMinute: () => void
  toggleDarkMode: () => void
  isMenuVisible: boolean
  setIsMenuVisible: (isVisible: boolean) => void
  setIsActiveMode: (isActive: boolean) => void
  flashAnimation: boolean
  setFlashAnimation: (flash: boolean) => void
  isTimerEnded: boolean
  availableSounds: string[]
  fetchAvailableSounds: () => Promise<void>
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export const useTimerContext = () => {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider')
  }
  return context
}

export const TimerProvider: React.FC<{ children: React.ReactNode; value: TimerContextType }> = ({ children, value }) => {
  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}

