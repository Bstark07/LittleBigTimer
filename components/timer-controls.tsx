import { Button } from "@/components/ui/button"
import { Play, CircleStopIcon as Stop, RotateCcw, PlusSquare, Settings, Eye, Maximize2, Minimize2, Coffee, Bell, BellOff } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

interface TimerControlsProps {
  isRunning: boolean
  isActiveMode: boolean
  isDarkMode: boolean
  isMenuVisible: boolean
  onPlayPause: () => void
  onReset: (isDoubleClick: boolean) => void
  onAddMinute: () => void
  onOpenSettings: () => void
  onToggleActiveMode: () => void
  digitSize: number
  setDigitSize: (size: number) => void
  timerFormat: 'digital' | 'text'
  setIsMenuVisible: (isVisible: boolean) => void
  alarmSound: string
  setAlarmSound: (sound: string) => void
}

const TimerControls: React.FC<TimerControlsProps> = ({ 
  isRunning, 
  isActiveMode,
  isDarkMode,
  isMenuVisible,
  onPlayPause, 
  onReset, 
  onAddMinute,
  onOpenSettings,
  onToggleActiveMode,
  digitSize,
  setDigitSize,
  timerFormat,
  setIsMenuVisible,
  alarmSound,
  setAlarmSound
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      if (isActiveMode && 
          controlsRef.current && 
          !controlsRef.current.contains(event.relatedTarget as Node)) {
        setIsMenuVisible(false);
      }
    };

    const controls = controlsRef.current;
    if (controls) {
      controls.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (controls) {
        controls.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isActiveMode, setIsMenuVisible]);

  const handleResetClick = () => {
    onReset(false);
  }

  const handleResetDoubleClick = () => {
    onReset(true);
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  const buttonVariant = isDarkMode ? "outline" : "ghost"
  const buttonClass = isDarkMode 
    ? "bg-transparent hover:bg-gray-700 border-gray-600" 
    : ""
  const iconClass = isDarkMode ? "text-gray-300" : ""

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 flex flex-col items-center overflow-hidden"
      ref={controlsRef}
      onMouseEnter={() => setIsMenuVisible(true)}
    >
      {/* Main controls */}
      <div 
        className={`w-full transition-all duration-300 ease-in-out ${
          isDarkMode
            ? 'bg-gray-800 bg-opacity-20 backdrop-filter backdrop-blur-lg'
            : 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg'
        }`}
        style={{
          height: '64px',
          transform: !isMenuVisible ? 'translateY(100%)' : 'translateY(0)',
          opacity: isActiveMode && !isMenuVisible ? 0 : 1,
          pointerEvents: isActiveMode && !isMenuVisible ? 'none' : 'auto',
          transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        }}
      >
        <div className="w-full h-full flex justify-center items-center space-x-2 p-4">
          <Button onClick={onPlayPause} variant={buttonVariant} size="icon" aria-label={isRunning ? "Stop timer" : "Start timer"} className={buttonClass}>
            {isRunning ? <Stop className={`h-4 w-4 ${iconClass}`} /> : <Play className={`h-4 w-4 ${iconClass}`} />}
          </Button>
          <Button 
            onClick={handleResetClick} 
            onDoubleClick={handleResetDoubleClick} 
            variant={buttonVariant} 
            size="icon" 
            aria-label="Reset timer"
            className={buttonClass}
          >
            <RotateCcw className={`h-4 w-4 ${iconClass}`} />
          </Button>
          <Button onClick={onAddMinute} variant={buttonVariant} size="icon" aria-label="Add one minute" className={buttonClass}>
            <PlusSquare className={`h-4 w-4 ${iconClass}`} />
          </Button>
          <Button onClick={onOpenSettings} variant={buttonVariant} size="icon" aria-label="Open settings" className={buttonClass}>
            <Settings className={`h-4 w-4 ${iconClass}`} />
          </Button>
          <Button
            onClick={() => setAlarmSound(alarmSound === 'silence' ? 'beep' : 'silence')}
            variant={buttonVariant}
            size="icon"
            aria-label={alarmSound === 'silence' ? "Enable alarm" : "Silence alarm"}
            className={buttonClass}
          >
            {alarmSound === 'silence' ? (
              <BellOff className={`h-4 w-4 ${iconClass}`} />
            ) : (
              <Bell className={`h-4 w-4 ${iconClass}`} />
            )}
          </Button>
        </div>
      </div>
      
      {/* Eye icon for showing controls */}
      <div 
        className={`w-full flex justify-center items-center transition-all duration-300 ease-in-out ${
          isDarkMode
            ? 'bg-gray-800 bg-opacity-20 backdrop-filter backdrop-blur-lg'
            : 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg'
        }`}
        style={{
          height: '64px',
          transform: !isMenuVisible ? 'translateY(0)' : 'translateY(100%)',
          position: 'absolute',
          bottom: 0,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <Button
          onClick={() => setIsMenuVisible(true)}
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
      
      {/* Fullscreen button */}
      <Button
        onClick={toggleFullScreen}
        variant={buttonVariant}
        size="icon"
        aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
        className={`absolute bottom-4 right-4 ${buttonClass}`}
      >
        {isFullScreen ? (
          <Minimize2 className={`h-4 w-4 ${iconClass}`} />
        ) : (
          <Maximize2 className={`h-4 w-4 ${iconClass}`} />
        )}
      </Button>
      
      {/* Custom Ko-Fi support button */}
      <a
        href="https://ko-fi.com/themaclaren72127"
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute bottom-4 left-4 transition-all duration-300 ${
          !isMenuVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center space-x-2 ${
            isDarkMode 
              ? 'bg-gray-800 text-white hover:bg-gray-700' 
              : 'bg-white text-gray-800 hover:bg-gray-100'
          }`}
        >
          <Coffee className="h-4 w-4" />
          <span>Buy a Ko-fi</span>
        </Button>
      </a>
    </div>
  )
}

export default TimerControls

