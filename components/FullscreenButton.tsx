import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from 'lucide-react'
import { useTimerContext } from '@/contexts/TimerContext'

export const FullscreenButton: React.FC = () => {
  const { isDarkMode } = useTimerContext()
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  return (
    <Button
      onClick={toggleFullScreen}
      variant="outline"
      size="icon"
      aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
      className={`${
        isDarkMode 
          ? "bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-200" 
          : "bg-white hover:bg-gray-100 border-gray-300 text-gray-800"
      }`}
    >
      {isFullScreen ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
    </Button>
  )
}

