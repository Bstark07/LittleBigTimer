"use client"

import React, { useEffect, useRef } from 'react'
import { useTimerContext } from '@/contexts/TimerContext'
import { MainControls } from '../molecules/MainControls'
import { FullscreenButton } from '../atoms/FullscreenButton'
import { KofiButton } from '../atoms/KofiButton'
import { Button } from "@/components/ui/button"
import { Eye } from 'lucide-react'

export const TimerControls: React.FC = () => {
  const {
    isDarkMode,
    isActiveMode,
    isMenuVisible,
    setIsMenuVisible,
    toggleMenuVisibility
  } = useTimerContext()

  const controlsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      if (isActiveMode && 
          controlsRef.current && 
          !controlsRef.current.contains(event.relatedTarget as Node)) {
        setIsMenuVisible(false)
      }
    }

    const controls = controlsRef.current
    if (controls) {
      controls.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (controls) {
        controls.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [isActiveMode, setIsMenuVisible])

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 flex flex-col items-center overflow-hidden"
      ref={controlsRef}
      // onMouseEnter={toggleMenuVisibility} // Removed onMouseEnter
    >
      {/* Main controls */}
      <div 
        className={`w-full transition-all duration-300 ease-in-out timer-controls ${
          isDarkMode
            ? 'bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg'
            : 'bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg'
        }`}
        style={{
          height: 'var(--timer-controls-height)',
          transform: !isMenuVisible ? 'translateY(100%)' : 'translateY(0)',
          opacity: isActiveMode && !isMenuVisible ? 0 : 1,
          pointerEvents: isActiveMode && !isMenuVisible ? 'none' : 'auto',
        }}
      >
        <div className="w-full h-full flex justify-center items-center p-4">
          <MainControls />
        </div>
      </div>
      
      {/* Eye icon for showing controls */}
      {isActiveMode && (
        <div 
          className={`w-full flex justify-center items-center transition-all duration-300 ease-in-out ${
            isDarkMode
              ? 'bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg'
              : 'bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg'
          }`}
          style={{
            height: '64px',
            transform: !isMenuVisible ? 'translateY(0)' : 'translateY(100%)',
            position: 'absolute',
            bottom: 0,
            transition: 'transform 0.3s ease-in-out',
          }}
          onMouseEnter={() => setIsMenuVisible(true)}
        >
          <Button
            variant={isDarkMode ? "outline" : "secondary"}
            size="icon"
            aria-label="Show controls"
            className={`rounded-full p-2 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 bg-opacity-30 hover:bg-opacity-50 border-gray-600' 
                : 'bg-white bg-opacity-30 hover:bg-opacity-50'
            }`}
          >
            <Eye className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`} />
          </Button>
        </div>
      )}
      
      {/* Fullscreen button */}
      <div className="absolute bottom-4 right-4">
        <FullscreenButton />
      </div>
      
      {/* Ko-fi button */}
      <div className={`absolute bottom-4 left-4 transition-all duration-300 ${
        !isMenuVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <KofiButton isVisible={isMenuVisible} />
      </div>
    </div>
  )
}

