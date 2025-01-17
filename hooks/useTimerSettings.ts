import { useState } from 'react'
import { TimerHistory } from '@/types/timer'

const DEFAULT_BACKGROUND_COLOR = '#f3f4f6'
const DARK_BACKGROUND_COLOR = '#1a202c'

export const useTimerSettings = () => {
  const [timerName, setTimerName] = useState('')
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND_COLOR)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [digitSize, setDigitSize] = useState(3)
  const [timerFormat, setTimerFormat] = useState<'digital' | 'text'>('digital')
  const [fontFamily, setFontFamily] = useState('mono')
  const [alarmSound, setAlarmSound] = useState('beep')
  const [countdownDate, setCountdownDate] = useState('')
  const [timerHistory, setTimerHistory] = useState<TimerHistory[]>([])

  const addToTimerHistory = (completed: boolean) => {
    setTimerHistory(prev => [
      { name: timerName || 'Unnamed Timer', duration: 0, completed },
      ...prev.slice(0, 9) // Keep only the last 10 entries
    ])
  }

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
    setBackgroundColor(prev => prev === DEFAULT_BACKGROUND_COLOR ? DARK_BACKGROUND_COLOR : DEFAULT_BACKGROUND_COLOR)
  }

  return {
    timerName,
    setTimerName,
    backgroundColor,
    setBackgroundColor,
    isDarkMode,
    setIsDarkMode,
    digitSize,
    setDigitSize,
    timerFormat,
    setTimerFormat,
    fontFamily,
    setFontFamily,
    alarmSound,
    setAlarmSound,
    countdownDate,
    setCountdownDate,
    timerHistory,
    addToTimerHistory,
    toggleDarkMode,
  }
}

