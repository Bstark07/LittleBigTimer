import React from 'react'
import { Button } from "@/components/ui/button"
import { Coffee } from 'lucide-react'
import { useTimerContext } from '@/contexts/TimerContext'

interface KofiButtonProps {
  isVisible: boolean
}

export const KofiButton: React.FC<KofiButtonProps> = ({ isVisible }) => {
  const { isDarkMode } = useTimerContext()

  return (
    <a
      href="https://ko-fi.com/themaclaren72127"
      target="_blank"
      rel="noopener noreferrer"
      className={`transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <Button
        variant={isDarkMode ? "outline" : "ghost"}
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
  )
}

