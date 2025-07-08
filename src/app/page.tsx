"use client";

import { useState } from "react";
import PasswordGate from "@/components/password-gate";
import BirthdayGreeting from "@/components/birthday-greeting";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles } from "lucide-react";
import { useBirthdayConfig } from "@/hooks/use-birthday-config";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { config, isLoaded } = useBirthdayConfig();

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
  
  if (!isLoaded) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background text-center">
        <div className="space-y-6">
            <Gift className="mx-auto h-24 w-24 text-primary" strokeWidth={1.5} />
            <Skeleton className="h-16 w-96 max-w-full" />
            <Skeleton className="h-6 w-80 max-w-full" />
            <Skeleton className="h-14 w-48" />
        </div>
      </main>
    )
  }

  if (!isStarted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background text-center">
        <div className="space-y-6 animate-in fade-in-50 duration-1000">
            <Gift className="mx-auto h-24 w-24 text-primary" strokeWidth={1.5} />
            <h1 className="font-headline text-5xl md:text-7xl text-primary-foreground/90 drop-shadow-md">
                {config.entryTitle}
            </h1>
            <p className="font-body text-lg text-muted-foreground">
                {config.entrySubtitle}
            </p>
            <Button onClick={handleStart} size="lg" className="h-14 px-8 text-xl font-headline">
                <Sparkles className="mr-3 h-6 w-6" />
                {config.entryButtonText}
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
