"use client";

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

const CONFIG_COLLECTION = 'settings';
const CONFIG_DOC_ID = 'birthdayConfig';

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


interface BirthdayConfigContextType {
    config: BirthdayConfig;
    saveConfig: (newConfig: BirthdayConfig) => void;
    isLoaded: boolean;
}

const BirthdayConfigContext = createContext<BirthdayConfigContextType | undefined>(undefined);

export function BirthdayConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<BirthdayConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
        try {
            const configDocRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
            const docSnap = await getDoc(configDocRef);
    
            if (docSnap.exists()) {
                const fetchedConfig = docSnap.data() as BirthdayConfig;
                // Merge with default to ensure all keys are present
                const mergedConfig = { ...defaultConfig, ...fetchedConfig };
                setConfig(mergedConfig);
            } else {
                // Doc doesn't exist, so create it with default values
                await setDoc(configDocRef, defaultConfig);
                setConfig(defaultConfig);
            }
        } catch (error) {
            console.error("Failed to load config from Firebase", error);
            // Fallback to default config on error
            setConfig(defaultConfig);
        }
        setIsLoaded(true);
    };
    
    fetchConfig();
  }, []);

  const saveConfig = useCallback(async (newConfig: BirthdayConfig) => {
    try {
      const configDocRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
      await setDoc(configDocRef, newConfig);
      setConfig(newConfig);
    } catch (error) {
      console.error("Failed to save config to Firebase", error);
    }
  }, []);

  const value = { config, saveConfig, isLoaded };

  return React.createElement(BirthdayConfigContext.Provider, { value }, children);
}

export function useBirthdayConfig() {
    const context = useContext(BirthdayConfigContext);
    if (context === undefined) {
        throw new Error('useBirthdayConfig must be used within a BirthdayConfigProvider');
    }
    return context;
}
