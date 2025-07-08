"use client";

import { useState, useEffect, useCallback } from 'react';

export interface BirthdayConfig {
  date: string;
  password: string;
  title: string;
  poem: string;
  backgroundImage: string;
  entryTitle: string;
  entrySubtitle: string;
  entryButtonText: string;
  gateTitle: string;
  gateSubtitle: string;
  gateTimerText: string;
  gatePromptNow: string;
  gatePromptLater: string;
  gateButtonNow: string;
  gateButtonLater: string;
  cakeText: string;
}

const STORAGE_KEY = 'sondosBirthdayConfig';

const defaultConfig: BirthdayConfig = {
  date: "2025-08-17T00:00:00",
  password: "Best Friend",
  title: "Happy Birthday, Sondos!",
  poem: `Of all the stars in the night sky,<br />yours is the one that shines most high.<br />Through every chapter, laugh, and tear,<br />you grow more wonderful each year.<br />May all your wishes, big and small,<br />come true today, have a ball!`,
  backgroundImage: "",
  entryTitle: "A Surprise for Sondos",
  entrySubtitle: "Click below to begin the magical celebration!",
  entryButtonText: "Click to Enter",
  gateTitle: "Sondos' Magical Birthday",
  gateSubtitle: "A special surprise is waiting...",
  gateTimerText: "The magic awakens in:",
  gatePromptNow: "The time has come! Enter the magic word to unlock the surprise.",
  gatePromptLater: "Can't wait? Enter the magic word to get a sneak peek!",
  gateButtonNow: "Unlock Surprise",
  gateButtonLater: "Sneak a Peek",
  cakeText: "Thank You!",
};

export function useBirthdayConfig() {
  const [config, setConfig] = useState<BirthdayConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem(STORAGE_KEY);
      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig);
        // Ensure all keys from defaultConfig are present
        const mergedConfig = { ...defaultConfig, ...parsedConfig };
        setConfig(mergedConfig);
      } else {
        // First time load, set default config in storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
        setConfig(defaultConfig);
      }
    } catch (error) {
      console.error("Failed to load config from localStorage", error);
      setConfig(defaultConfig);
    }
    setIsLoaded(true);
  }, []);

  const saveConfig = useCallback((newConfig: BirthdayConfig) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch (error) {
      console.error("Failed to save config to localStorage", error);
    }
  }, []);

  return { config, saveConfig, isLoaded };
}
