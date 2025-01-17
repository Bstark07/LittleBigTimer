import React from 'react'
import { useTimerContext } from '@/contexts/TimerContext'

export const TimerName: React.FC = () => {
  const { timerName } = useTimerContext()

  return timerName ? <h1 className="text-2xl font-bold mb-4">{timerName}</h1> : null
}

