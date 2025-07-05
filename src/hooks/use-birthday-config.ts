"use client";

import { useState, useEffect, useCallback } from 'react';

export interface BirthdayConfig {
  date: string;
  password: string;
  title: string;
  poem: string;
  backgroundImage: string;
}

const STORAGE_KEY = 'sondosBirthdayConfig';

const defaultConfig: BirthdayConfig = {
  date: "2025-08-17T00:00:00",
  password: "Best Friend",
  title: "Happy Birthday, Sondos!",
  poem: `A year of moments, bright and new,<br />With skies of turquoise, just for you.<br />Like pinkest roses, may you bloom,<br />And chase away all winter gloom.<br />May every day in sweet gold shine,<br />A very happy birthday, be forever thine!`,
  backgroundImage: "",
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
