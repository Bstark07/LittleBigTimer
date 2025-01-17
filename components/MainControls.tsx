import React from 'react'
import { Button } from "@/components/ui/button"
import { Play, Square, RotateCcw, PlusSquare, Settings, Bell, BellOff } from 'lucide-react'
import { useTimerContext } from '@/contexts/TimerContext'

export const MainControls: React.FC = () => {
  const {
    isRunning,
    isDarkMode,
    alarmSound,
    startTimer,
    stopTimer,
    resetTimer,
    addMinute,
    handleOpenSettings,
    setAlarmSound,
    stopAlarmSound,
  } = useTimerContext()

  const buttonVariant = "outline"
  const buttonClass = isDarkMode 
    ? "bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-200" 
    : "bg-white hover:bg-gray-100 border-gray-300 text-gray-800"
  const iconClass = isDarkMode ? "text-gray-200" : "text-gray-800"

  const handlePlayPause = () => {
    if (isRunning) {
      stopTimer()
      stopAlarmSound()
    } else {
      startTimer()
    }
  }

  const handleReset = () => {
    resetTimer(false)
  }

  const handleDoubleClickReset = () => {
    resetTimer(true)
  }

  return (
    <div className="flex justify-center items-center space-x-2">
      <Button
        onClick={handlePlayPause}
        variant={buttonVariant}
        size="icon"
        aria-label={isRunning ? "Stop timer" : "Start timer"}
        className={buttonClass}
      >
        {isRunning ? <Square className={`h-4 w-4 ${iconClass}`} /> : <Play className={`h-4 w-4 ${iconClass}`} />}
      </Button>
      <Button
        onClick={handleReset}
        onDoubleClick={handleDoubleClickReset}
        variant={buttonVariant}
        size="icon"
        aria-label="Reset timer"
        className={buttonClass}
      >
        <RotateCcw className={`h-4 w-4 ${iconClass}`} />
      </Button>
      <Button
        onClick={addMinute}
        variant={buttonVariant}
        size="icon"
        aria-label="Add one minute"
        className={buttonClass}
      >
        <PlusSquare className={`h-4 w-4 ${iconClass}`} />
      </Button>
      <Button
        onClick={handleOpenSettings}
        variant={buttonVariant}
        size="icon"
        aria-label="Open settings"
        className={buttonClass}
      >
        <Settings className={`h-4 w-4 ${iconClass}`} />
      </Button>
      <Button
        onClick={() => setAlarmSound(alarmSound === 'silence' ? 'beep' : 'silence')}
        variant={buttonVariant}
        size="icon"
        aria-label={alarmSound === 'silence' ? "Enable alarm" : "Silence alarm"}
        className={buttonClass}
      >
        {alarmSound === 'silence' ? <BellOff className={`h-4 w-4 ${iconClass}`} /> : <Bell className={`h-4 w-4 ${iconClass}`} />}
      </Button>
    </div>
  )
}

