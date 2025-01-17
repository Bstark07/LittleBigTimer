import React, { useState, createContext, useContext } from 'react';
import TimerTemplate from './TimerTemplate';
import SettingsDialog from './SettingsDialog';

interface TimerContext {
  timerName: string;
  setTimerName: React.Dispatch<React.SetStateAction<string>>;
  backgroundColor: string;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  digitSize: number;
  setDigitSize: React.Dispatch<React.SetStateAction<number>>;
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
  timerFormat: string;
  setTimerFormat: React.Dispatch<React.SetStateAction<string>>;
  alarmSound: string;
  setAlarmSound: React.Dispatch<React.SetStateAction<string>>;
  countdownDate: Date | null;
  setCountdownDate: React.Dispatch<React.SetStateAction<Date | null>>;
  timerHistory: any[]; // Replace 'any' with the actual type of timerHistory
}

const TimerContext = createContext<TimerContext | null>(null);

const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timerName, setTimerName] = useState('My Timer');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [digitSize, setDigitSize] = useState(60);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [timerFormat, setTimerFormat] = useState('hh:mm:ss');
  const [alarmSound, setAlarmSound] = useState('');
  const [countdownDate, setCountdownDate] = useState<Date | null>(null);
  const [timerHistory, setTimerHistory] = useState([]);

  const contextValue = {
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
    countdownDate,
    setCountdownDate,
    timerHistory,
  };

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  );
};

const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === null) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

const App: React.FC = () => {
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
    countdownDate,
    setCountdownDate,
    timerHistory,
  } = useTimer();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <TimerProvider value={{
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
      countdownDate,
      setCountdownDate,
      timerHistory,
    }}>
      <div className="min-h-screen w-full overflow-hidden" style={{ backgroundColor }}>
        <TimerTemplate />
        <SettingsDialog
          isOpen={isSettingsOpen}
          onClose={handleCloseSettings}
          timerName={timerName}
          setTimerName={setTimerName}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          digitSize={digitSize}
          setDigitSize={setDigitSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          timerFormat={timerFormat}
          setTimerFormat={setTimerFormat}
          alarmSound={alarmSound}
          setAlarmSound={setAlarmSound}
          countdownDate={countdownDate}
          setCountdownDate={setCountdownDate}
          timerHistory={timerHistory}
        />
      </div>
    </TimerProvider>
  );
};

export default App;

