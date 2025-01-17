import React, { useRef, useEffect } from 'react'
import { Drawer } from "../atoms/Drawer"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTimerContext } from '@/contexts/TimerContext'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

const fontOptions = [
  { value: 'mono', label: 'Monospace' },
  { value: 'sans', label: 'Sans-serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'lato', label: 'Lato' },
]

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    timerName,
    setTimerName,
    backgroundColor,
    setBackgroundColor,
    isDarkMode,
    setIsDarkMode,
    digitSize,
    setDigitSize,
    fontFamily,
    setFontFamily,
    timerFormat,
    setTimerFormat,
    alarmSound,
    setAlarmSound,
    timerHistory,
    flashAnimation,
    setFlashAnimation,
    availableSounds,
    fetchAvailableSounds,
  } = useTimerContext()

  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      fetchAvailableSounds()
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, fetchAvailableSounds])

  const handleResetBackgroundColor = () => {
    setBackgroundColor(isDarkMode ? '#000000' : '#ffffff')
  }

  const darkModeClasses = isDarkMode
    ? 'bg-gray-900 text-white border-gray-700'
    : 'bg-white text-black border-gray-300'

  const inputClasses = `${darkModeClasses} ${isDarkMode ? 'focus:ring-white' : 'focus:ring-black'}`

  return (
    <Drawer isOpen={isOpen} onClose={onClose} isDarkMode={isDarkMode} title="Settings">
      <div ref={drawerRef} className={`h-full overflow-y-auto ${darkModeClasses}`}>
        <div className="space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-md font-semibold mb-2">General</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="timerName">Timer Name</Label>
                <Input
                  id="timerName"
                  value={timerName}
                  onChange={(e) => setTimerName(e.target.value)}
                  className={`w-1/2 ${inputClasses}`}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <Switch
                  id="darkMode"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className={`${isDarkMode ? 'bg-white [&>span]:bg-black' : ''} switch`}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="timerFormat">Timer Format</Label>
                <div className="space-x-2">
                  <Button
                    variant={isDarkMode ? "outline" : "default"}
                    onClick={() => setTimerFormat('digital')}
                    size="sm"
                    className={darkModeClasses}
                  >
                    00:00:00
                  </Button>
                  <Button
                    variant={isDarkMode ? "outline" : "default"}
                    onClick={() => setTimerFormat('text')}
                    size="sm"
                    className={darkModeClasses}
                  >
                    00h 00m 00s
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="flashAnimation">Flash when timer ends</Label>
                <Switch
                  id="flashAnimation"
                  checked={flashAnimation}
                  onCheckedChange={setFlashAnimation}
                  className={`${isDarkMode ? 'bg-white [&>span]:bg-black' : ''} switch`}
                />
              </div>
            </div>
          </div>

          {/* Style Settings */}
          <div>
            <h3 className="text-md font-semibold mb-2">Style</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className={`w-10 h-10 p-1 ${inputClasses}`}
                  />
                  <Button
                    variant="outline"
                    onClick={handleResetBackgroundColor}
                    size="sm"
                    className={darkModeClasses}
                  >
                    Reset
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="digitSize">Digit Size</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="digitSize"
                    type="range"
                    min="1"
                    max="6"
                    step="0.5"
                    value={digitSize}
                    onChange={(e) => setDigitSize(parseFloat(e.target.value))}
                    className={`w-1/3 ${inputClasses}`}
                  />
                  <span>{digitSize}rem</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className={`w-1/2 ${darkModeClasses}`}>
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent className={darkModeClasses}>
                    {fontOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value} 
                        className={isDarkMode ? 'hover:bg-gray-800 focus:bg-gray-800' : 'hover:bg-gray-100 focus:bg-gray-100'}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sound Settings */}
          <div>
            <h3 className="text-md font-semibold mb-2">Sound</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="alarmSound">Alarm Sound</Label>
                <Select 
                  value={alarmSound} 
                  onValueChange={setAlarmSound}
                >
                  <SelectTrigger className={`w-1/2 ${darkModeClasses}`}>
                    <SelectValue placeholder="Select an alarm sound" />
                  </SelectTrigger>
                  <SelectContent className={darkModeClasses}>
                    <SelectItem value="silence">Silence</SelectItem>
                    {availableSounds.map((sound) => (
                      <SelectItem 
                        key={sound} 
                        value={sound}
                        className={isDarkMode ? 'hover:bg-gray-800 focus:bg-gray-800' : 'hover:bg-gray-100 focus:bg-gray-100'}
                      >
                        {sound.replace('.mp3', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Timer History */}
          <div>
            <h3 className="text-md font-semibold mb-2">History</h3>
            <div className="space-y-2">
              {timerHistory.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{entry.name}</span>
                  <span>{Math.floor(entry.duration / 3600)}h {Math.floor((entry.duration % 3600) / 60)}m {entry.duration % 60}s</span>
                  <span>{entry.completed ? 'Completed' : 'Stopped'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default SettingsDialog

