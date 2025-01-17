"use client"

import React from 'react'
import { Input } from "@/components/ui/input"
import { useTimerContext } from '@/contexts/TimerContext'
import { Time } from '@/types/timer'

interface DigitGroupProps {
  label: string
  fields: (keyof Time)[]
  isTimerEnded: boolean
  isFlashing: boolean
}

export const DigitGroup: React.FC<DigitGroupProps> = ({
  label,
  fields,
  isTimerEnded,
  isFlashing,
}) => {
  const {
    time,
    setTime,
    isRunning,
    isActiveMode,
    isDarkMode,
    digitSize,
    fontFamily,
  } = useTimerContext()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Time) => {
    if (isRunning) return

    const value = e.target.value.replace(/\D/g, '')
    const newTime = { ...time, [field]: value.charAt(value.length - 1) || '0' }

    // Validate and adjust time if necessary
    const hours = parseInt(newTime.h1 + newTime.h2)
    const minutes = parseInt(newTime.m1 + newTime.m2)
    const seconds = parseInt(newTime.s1 + newTime.s2)

    if (hours > 99) {
      newTime.h1 = '9'
      newTime.h2 = '9'
    }
    if (minutes > 59) {
      newTime.m1 = '5'
      newTime.m2 = '9'
    }
    if (seconds > 59) {
      newTime.s1 = '5'
      newTime.s2 = '9'
    }

    setTime(newTime)
  }

  const isHidden = isRunning && 
    ((fields[0] === 'h1' && time.h1 === '0' && time.h2 === '0') ||
     (fields[0] === 'm1' && time.m1 === '0' && time.m2 === '0' && time.h1 === '0' && time.h2 === '0'))

  const transitionDelay = fields[0] === 'h1' ? '0ms' : fields[0] === 'm1' ? '150ms' : '300ms'

  return (
    <div 
      className={`flex flex-col items-center mx-1 transition-all duration-300 ease-in-out ${isHidden ? 'opacity-0 scale-0 w-0 mx-0' : 'opacity-100 scale-100'}`}
      style={{ transitionDelay }}
    >
      <div className="flex">
        {fields.map((field) => (
          <Input
            key={field}
            type="text"
            inputMode="numeric"
            value={time[field]}
            onChange={(e) => handleInputChange(e, field)}
            onClick={(e) => e.currentTarget.select()}
            onFocus={(e) => e.currentTarget.select()}
            className={`text-center rounded-lg shadow-inner mx-0.5 transition-all duration-300 timer-digit ${
              isActiveMode 
                ? 'bg-transparent border-0' 
                : isDarkMode
                  ? 'bg-gray-800 border-2 border-gray-700'
                  : 'bg-white border-2 border-gray-300'
            } ${isDarkMode ? 'text-white' : 'text-black'}`}
            style={{ 
              fontSize: `${digitSize}rem`, 
              width: `${Math.max(digitSize * 1.2, 1.5)}rem`,
              height: `${Math.max(digitSize * 2, 2.5)}rem`,
              padding: `${digitSize * 0.2}rem`,
              caretColor: 'transparent',
              fontFamily: fontFamily === 'mono' ? 'monospace' : 
                          fontFamily === 'sans' ? 'sans-serif' : 
                          fontFamily === 'serif' ? 'serif' : 
                          fontFamily === 'roboto' ? '"Roboto", sans-serif' : 
                          fontFamily === 'lato' ? '"Lato", sans-serif' : 'inherit',
              opacity: isTimerEnded && isFlashing ? 0.3 : 1,
              transition: 'opacity 0.3s ease-in-out',
              background: isActiveMode ? 'transparent' : undefined,
              border: isActiveMode ? 'none' : undefined,
            }}
            readOnly={isRunning}
            tabIndex={isRunning ? -1 : 0}
          />
        ))}
      </div>
      {label && (
        <span className={`text-xs mt-1 transition-opacity duration-300 ${isActiveMode ? 'opacity-0' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </span>
      )}
    </div>
  )
}

export default DigitGroup

