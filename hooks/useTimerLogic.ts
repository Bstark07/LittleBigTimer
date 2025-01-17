"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { Time, TimerHistory } from '@/types/timer'

export const useTimerLogic = (initialState: {
  timerName: string,
  backgroundColor: string,
  isDarkMode: boolean,
  digitSize: number,
  timerFormat: 'digital' | 'text',
  fontFamily: string,
  alarmSound: string,
  flashAnimation: boolean
}) => {
  const [time, setTime] = useState<Time>({ h1: '0', h2: '0', m1: '0', m2: '0', s1: '0', s2: '0' })
  const [isRunning, setIsRunning] = useState(false)
  const [isActiveMode, setIsActiveMode] = useState(false)
  const [timerName, setTimerName] = useState(initialState.timerName)
  const [backgroundColor, setBackgroundColor] = useState(initialState.backgroundColor)
  const [isDarkMode, setIsDarkMode] = useState(initialState.isDarkMode)
  const [digitSize, setDigitSize] = useState(initialState.digitSize)
  const [timerFormat, setTimerFormat] = useState(initialState.timerFormat)
  const [fontFamily, setFontFamily] = useState(initialState.fontFamily)
  const [alarmSound, setAlarmSound] = useState(initialState.alarmSound)
  const [timerHistory, setTimerHistory] = useState<TimerHistory[]>([])
  const [isMenuVisible, setIsMenuVisible] = useState(true)
  const [flashAnimation, setFlashAnimation] = useState(initialState.flashAnimation)
  const [isTimerEnded, setIsTimerEnded] = useState(false)
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false)
  const [availableSounds, setAvailableSounds] = useState<string[]>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const loadAudio = useCallback(() => {
    if (alarmSound !== 'silence') {
      const audio = new Audio();
      audio.src = `/audio/${alarmSound}`;
      audio.load();
      audio.loop = true;
      
      audio.oncanplaythrough = () => {
        audioRef.current = audio;
      };
      
      audio.onerror = (e) => {
        console.error('Error loading audio:', e);
        console.warn(`Audio file ${alarmSound} not found. Disabling alarm.`);
        setAlarmSound('silence');
      };
    } else {
      audioRef.current = null;
    }
  }, [alarmSound, setAlarmSound]);

  const playAlarmSound = useCallback(() => {
    if (alarmSound !== 'silence' && !isAlarmPlaying && audioRef.current) {
      setIsAlarmPlaying(true);
      audioRef.current.play().catch(error => {
        console.error('Error playing alarm sound:', error);
        setIsAlarmPlaying(false);
        // If playing fails, try to reload the audio
        loadAudio();
      });
    }
  }, [alarmSound, isAlarmPlaying])

  const stopAlarmSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsAlarmPlaying(false)
  }, [])

  const addToTimerHistory = useCallback((completed: boolean) => {
    const totalSeconds = 
      parseInt(time.h1 + time.h2) * 3600 +
      parseInt(time.m1 + time.m2) * 60 +
      parseInt(time.s1 + time.s2)
    setTimerHistory(prev => [
      { name: timerName, duration: totalSeconds, completed },
      ...prev.slice(0, 9) // Keep only the last 10 entries
    ])
  }, [time, timerName])

  const startTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true)
      setIsActiveMode(true)
      setIsTimerEnded(false)
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          let totalSeconds = 
            parseInt(prevTime.h1 + prevTime.h2) * 3600 +
            parseInt(prevTime.m1 + prevTime.m2) * 60 +
            parseInt(prevTime.s1 + prevTime.s2)
          
          if (totalSeconds === 0) {
            setIsTimerEnded(true)
            playAlarmSound()
            return prevTime // Keep the timer at 00:00:00
          }

          totalSeconds -= 1
          const hours = Math.floor(totalSeconds / 3600)
          const minutes = Math.floor((totalSeconds % 3600) / 60)
          const seconds = totalSeconds % 60

          return {
            h1: Math.floor(hours / 10).toString(),
            h2: (hours % 10).toString(),
            m1: Math.floor(minutes / 10).toString(),
            m2: (minutes % 10).toString(),
            s1: Math.floor(seconds / 10).toString(),
            s2: (seconds % 10).toString(),
          }
        })
      }, 1000)
    }
  }, [isRunning, playAlarmSound])

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setIsActiveMode(false)
    setIsTimerEnded(false)
    stopAlarmSound()
    addToTimerHistory(isTimerEnded)
  }, [isTimerEnded, stopAlarmSound, addToTimerHistory])

  const resetTimer = useCallback((isDoubleClick: boolean = false) => {
    stopTimer()
    if (isDoubleClick) {
      setTime({ h1: '0', h2: '0', m1: '0', m2: '0', s1: '0', s2: '0' })
    }
    setIsActiveMode(false)
    setIsTimerEnded(false)
  }, [stopTimer])

  const addMinute = useCallback(() => {
    setTime((prev) => {
      let totalSeconds = 
        parseInt(prev.h1 + prev.h2) * 3600 +
        parseInt(prev.m1 + prev.m2) * 60 +
        parseInt(prev.s1 + prev.s2) + 60
      
      totalSeconds = Math.min(totalSeconds, 359999) // Cap at 99:59:59
      
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      return {
        h1: Math.floor(hours / 10).toString(),
        h2: (hours % 10).toString(),
        m1: Math.floor(minutes / 10).toString(),
        m2: (minutes % 10).toString(),
        s1: Math.floor(seconds / 10).toString(),
        s2: (seconds % 10).toString(),
      }
    })
  }, [])

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev)
    setBackgroundColor((prev) => prev === '#ffffff' ? '#000000' : '#ffffff')
  }, [])

  const fetchAvailableSounds = useCallback(async () => {
    try {
      const response = await fetch('/api/sounds')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const sounds = await response.json()
      setAvailableSounds(['silence', ...sounds])
    } catch (error) {
      console.error('Error fetching sounds:', error instanceof Error ? error.message : String(error))
      setAvailableSounds(['silence', 'beep.mp3', 'chime.mp3', 'alarm.mp3'])
    }
  }, [])

  useEffect(() => {
    fetchAvailableSounds()
  }, [fetchAvailableSounds])

  useEffect(() => {
    loadAudio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [loadAudio]);

  return {
    time,
    setTime,
    isRunning,
    isActiveMode,
    setIsActiveMode,
    timerName,
    setTimerName,
    backgroundColor,
    setBackgroundColor,
    isDarkMode,
    setIsDarkMode,
    digitSize,
    setDigitSize,
    timerFormat,
    setTimerFormat,
    fontFamily,
    setFontFamily,
    alarmSound,
    setAlarmSound,
    timerHistory,
    startTimer,
    stopTimer,
    resetTimer,
    addMinute,
    toggleDarkMode,
    isMenuVisible,
    setIsMenuVisible,
    flashAnimation,
    setFlashAnimation,
    isTimerEnded,
    isAlarmPlaying,
    playAlarmSound,
    stopAlarmSound,
    availableSounds,
    fetchAvailableSounds,
  }
}

