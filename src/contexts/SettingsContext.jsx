import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

// Shared AudioContext
let audioCtx = null;

export const SettingsProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('app_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('app_dark_mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem('app_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Sound effect preferences
  useEffect(() => {
    localStorage.setItem('app_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Global click sound handler
  useEffect(() => {
    const playClickSound = () => {
      if (!soundEnabled) return;
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // very soft
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
      } catch (e) {
        console.warn('Audio play failed', e);
      }
    };

    const handleClick = (e) => {
      // Play sound if a button or something button-like is clicked
      if (e.target.closest('button') || e.target.closest('.clickable')) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [soundEnabled]);

  return (
    <SettingsContext.Provider value={{ soundEnabled, setSoundEnabled, darkMode, setDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
};
