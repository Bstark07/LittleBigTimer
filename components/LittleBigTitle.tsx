import React from 'react'
import { useTimerContext } from '@/contexts/TimerContext'

export const LittleBigTitle: React.FC = () => {
  const { isRunning } = useTimerContext()

  return (
    <div 
      className={`absolute top-4 left-4 text-xl font-bold transition-opacity duration-300 ${
        isRunning ? 'opacity-10' : 'opacity-100'
      }`}
    >
      LittleBig Timer
    </div>
  )
}

