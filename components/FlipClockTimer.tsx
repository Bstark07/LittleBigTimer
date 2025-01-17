"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { TimerTemplate } from './templates/TimerTemplate'
import { SettingsDialog } from './organisms/SettingsDialog'
import { useTimerLogic } from '@/hooks/useTimerLogic'
import { TimerProvider } from '@/contexts/TimerContext'

const FlipClockTimer: React.FC = () => {
  const initialState = {
    timerName: 'Timer',
    backgroundColor: 'var(--color-background-light)',
    isDarkMode: false,
    digitSize: 4,
    timerFormat: 'digital' as const,
    fontFamily: 'Arial',
    alarmSound: 'beep',
    flashAnimation: true,
  }

  const timerLogic = useTimerLogic(initialState)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), [])
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), [])

  const toggleMenuVisibility = useCallback(() => {
    timerLogic.setIsMenuVisible(prev => !prev)
  }, [timerLogic])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (timerLogic.isRunning) {
          timerLogic.stopTimer()
        } else {
          timerLogic.startTimer()
        }
        toggleMenuVisibility()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [timerLogic, toggleMenuVisibility])

  const contextValue = {
    ...timerLogic,
    handleOpenSettings,
    handleCloseSettings,
    isSettingsOpen,
    toggleMenuVisibility
  }

  return (
    <TimerProvider value={contextValue}>
      <div 
        className={`min-h-screen w-full overflow-hidden ${
          timerLogic.isDarkMode ? 'dark bg-gray-900' : 'light bg-white'
        }`}
      >
        <TimerTemplate />
        <SettingsDialog
          isOpen={isSettingsOpen}
          onClose={handleCloseSettings}
        />
      </div>
    </TimerProvider>
  )
}

export default FlipClockTimer

