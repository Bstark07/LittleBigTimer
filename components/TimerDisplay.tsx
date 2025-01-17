"use client"

import React, { useEffect, useState } from 'react'
import DigitGroup from '../molecules/DigitGroup'
import { useTimerContext } from '@/contexts/TimerContext'

export const TimerDisplay: React.FC = () => {
  const {
    time,
    timerFormat,
    isRunning,
    isActiveMode,
    isDarkMode,
    flashAnimation,
    isTimerEnded,
    playAlarmSound,
  } = useTimerContext()

  const [isFlashing, setIsFlashing] = useState(false)

  const showHours = !(isRunning && time.h1 === '0' && time.h2 === '0')
  const showMinutes = showHours || !(isRunning && time.m1 === '0' && time.m2 === '0')

  useEffect(() => {
    let flashInterval: NodeJS.Timeout | null = null
    if (flashAnimation && isTimerEnded && isRunning) {
      flashInterval = setInterval(() => {
        setIsFlashing((prev) => !prev)
      }, 500) // Flash every 500ms
      playAlarmSound()
    } else {
      setIsFlashing(false)
    }

    return () => {
      if (flashInterval) {
        clearInterval(flashInterval)
      }
    }
  }, [flashAnimation, isTimerEnded, isRunning, playAlarmSound])

  return (
    <div 
      className={`text-2xl font-bold flex flex-col items-center mb-4 transition-all duration-300 ${
        isActiveMode ? 'opacity-100' : 'opacity-80'
      } ${isFlashing ? 'animate-pulse' : ''}`}
    >
      <div className="flex items-center">
        {timerFormat === 'digital' ? (
          <>
            {showHours && (
              <>
                <DigitGroup
                  label="Hours"
                  fields={['h1', 'h2']}
                  isTimerEnded={isTimerEnded}
                  isFlashing={isFlashing}
                />
                <span className={`mx-1 transition-all duration-300 ease-in-out ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${isActiveMode ? 'opacity-100' : 'opacity-80'}`}>:</span>
              </>
            )}
            {showMinutes && (
              <>
                <DigitGroup
                  label="Minutes"
                  fields={['m1', 'm2']}
                  isTimerEnded={isTimerEnded}
                  isFlashing={isFlashing}
                />
                <span className={`mx-1 transition-all duration-300 ease-in-out ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${isActiveMode ? 'opacity-100' : 'opacity-80'}`}>:</span>
              </>
            )}
            <DigitGroup
              label="Seconds"
              fields={['s1', 's2']}
              isTimerEnded={isTimerEnded}
              isFlashing={isFlashing}
            />
          </>
        ) : (
          <>
            {showHours && (
              <DigitGroup
                label="h"
                fields={['h1', 'h2']}
                isTimerEnded={isTimerEnded}
                isFlashing={isFlashing}
              />
            )}
            {showMinutes && (
              <DigitGroup
                label="m"
                fields={['m1', 'm2']}
                isTimerEnded={isTimerEnded}
                isFlashing={isFlashing}
              />
            )}
            <DigitGroup
              label="s"
              fields={['s1', 's2']}
              isTimerEnded={isTimerEnded}
              isFlashing={isFlashing}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default TimerDisplay

