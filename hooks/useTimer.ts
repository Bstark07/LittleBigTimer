import { useState, useRef, useCallback } from 'react'
import { Time } from '@/types/timer'

// ... rest of the hook
const initialTime: Time = { h1: '0', h2: '0', m1: '0', m2: '0', s1: '0', s2: '0' }

export const useTimer = () => {
  const [time, setTime] = useState<Time>(initialTime)
  const [lastSetTime, setLastSetTime] = useState<Time>(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }, [])

  const startTimer = useCallback(() => {
    if (intervalRef.current) return
    setLastSetTime(time)
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        if (!prev) return initialTime 
        let totalSeconds = 
          parseInt(prev.h1 + prev.h2) * 3600 +
          parseInt(prev.m1 + prev.m2) * 60 +
          parseInt(prev.s1 + prev.s2) - 1
        if (totalSeconds < 0) {
          stopTimer()
          return prev
        }
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        return { 
          h1: Math.floor(hours / 10).toString(),
          h2: (hours % 10).toString(),
          m1: Math.floor(minutes / 10).toString(),
          m2: (minutes % 10).toString(),
          s1: Math.floor(seconds / 10).toString(),
          s2: (seconds % 10).toString()
        }
      })
    }, 1000)
  }, [time, stopTimer])

  const resetTimer = useCallback((isDoubleClick: boolean = false) => {
    stopTimer()
    if (isDoubleClick) {
      setTime(initialTime)
      setLastSetTime(initialTime)
    } else {
      setTime(lastSetTime)
    }
  }, [stopTimer, lastSetTime])

  const addMinute = useCallback(() => {
    setTime(prev => {
      if (!prev) return initialTime 
      let totalSeconds = 
        parseInt(prev.h1 + prev.h2) * 3600 +
        parseInt(prev.m1 + prev.m2) * 60 +
        parseInt(prev.s1 + prev.s2) + 60
      totalSeconds = Math.min(totalSeconds, 359999) 
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      return { 
        h1: Math.floor(hours / 10).toString(),
        h2: (hours % 10).toString(),
        m1: Math.floor(minutes / 10).toString(),
        m2: (minutes % 10).toString(),
        s1: Math.floor(seconds / 10).toString(),
        s2: (seconds % 10).toString()
      }
    })
  }, [])

  return {
    time,
    setTime,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    addMinute,
  }
}

