"use client";

import { useState } from "react";
import PasswordGate from "@/components/password-gate";
import BirthdayGreeting from "@/components/birthday-greeting";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles } from "lucide-react";

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
    const element = document.documentElement;
    const requestFullScreen = 
      element.requestFullscreen ||
      (element as any).mozRequestFullScreen ||
      (element as any).webkitRequestFullscreen ||
      (element as any).msRequestFullscreen;
      
    if (requestFullScreen) {
      requestFullScreen.call(element).catch((err: Error) => {
        console.warn(`Could not enter fullscreen mode: ${err.message}`);
      });
    }
  };

  const handleSuccess = () => {
    setIsAuthenticated(true);
  };
  
  if (!isStarted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background text-center">
        <div className="space-y-6 animate-in fade-in-50 duration-1000">
            <Gift className="mx-auto h-24 w-24 text-primary" strokeWidth={1.5} />
            <h1 className="font-headline text-5xl md:text-7xl text-primary-foreground/90 drop-shadow-md">
                A Surprise for Sondos
            </h1>
            <p className="font-body text-lg text-muted-foreground">
                Click below to begin the magical celebration!
            </p>
            <Button onClick={handleStart} size="lg" className="h-14 px-8 text-xl font-headline">
                <Sparkles className="mr-3 h-6 w-6" />
                Click to Enter
            </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 transition-opacity duration-1000">
      {isAuthenticated ? (
        <BirthdayGreeting />
      ) : (
        <PasswordGate onSuccess={handleSuccess} />
      )}
    </main>
  );
}
