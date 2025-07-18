
"use client";

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Letter {
  id: string;
  magicWord: string;
  title: string;
  content: string;
  isActive: boolean;
  showBalloons?: boolean;
  showFireworks?: boolean;
  showCakeAndCats?: boolean;
}

export interface BirthdayConfig {
  date: string;
  timezone: string;
  letters: Letter[];
  adminPassword: string;
  backgroundImage: string;
  photoGallery: string[];
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
  // Theme colors
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  cardColor?: string;
  borderColor?: string;
}

const CONFIG_COLLECTION = 'settings';
const CONFIG_DOC_ID = 'birthdayConfig';

const defaultConfig: BirthdayConfig = {
  date: "2025-08-17T00:00:00.000Z",
  timezone: "America/New_York",
  letters: [
    {
      id: `letter-${Date.now()}`,
      magicWord: "Best Friend",
      title: "Happy Birthday, Sondos!",
      content: `Of all the stars in the night sky,<br />yours is the one that shines most high.<br />Through every chapter, laugh, and tear,<br />you grow more wonderful each year.<br />May all your wishes, big and small,<br />come true today, have a ball!`,
      isActive: true,
      showBalloons: true,
      showFireworks: true,
      showCakeAndCats: true,
    }
  ],
  adminPassword: "admin123",
  backgroundImage: "",
  photoGallery: [],
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
  primaryColor: '#f56e88',
  accentColor: '#f5b3c2',
  backgroundColor: '#f9f8f6',
  foregroundColor: '#4a4540',
  cardColor: '#ffffff',
  borderColor: '#efd9de',
};


interface BirthdayConfigContextType {
    config: BirthdayConfig;
    saveConfig: (newConfig: Partial<BirthdayConfig>) => Promise<void>;
    isLoaded: boolean;
}

const BirthdayConfigContext = createContext<BirthdayConfigContextType | undefined>(undefined);

export function BirthdayConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<BirthdayConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const configDocRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    
    const unsubscribe = onSnapshot(configDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const fetchedConfig = docSnap.data() as Partial<BirthdayConfig>;
        const mergedConfig = { ...defaultConfig, ...fetchedConfig };
        if (!mergedConfig.letters || mergedConfig.letters.length === 0) {
            mergedConfig.letters = defaultConfig.letters;
        }
        setConfig(mergedConfig);
      } else {
        setDoc(configDocRef, defaultConfig).catch(error => {
            console.error("Could not create default config doc:", error);
        });
        setConfig(defaultConfig);
      }
      setIsLoaded(true);
    }, (error) => {
        console.error("Failed to listen to config from Firebase", error);
        setConfig(defaultConfig);
        setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const saveConfig = useCallback(async (newConfig: Partial<BirthdayConfig>) => {
    try {
      const configDocRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
      // When saving, we need to ensure we don't merge arrays, but replace them.
      const currentConfig = { ...config, ...newConfig };
      await setDoc(configDocRef, currentConfig);
    } catch (error) {
      console.error("Failed to save config to Firebase", error);
      throw error;
    }
  }, [config]);

  const value = { config, saveConfig, isLoaded };

  return React.createElement(BirthdayConfigContext.Provider, { value: value as any }, children);
}

export function useBirthdayConfig() {
    const context = useContext(BirthdayConfigContext);
    if (context === undefined) {
        throw new Error('useBirthdayConfig must be used within a BirthdayConfigProvider');
    }
    return context;
}
