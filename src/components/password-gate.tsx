"use client";

import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useBirthdayConfig } from "@/hooks/use-birthday-config";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export default function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const { config, isLoaded } = useBirthdayConfig();
  
  const birthdayDate = useMemo(() => new Date(config.date), [config.date]);

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +birthdayDate - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };
  
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({});

  useEffect(() => {
    if (!isLoaded) return;
    
    const checkDate = () => {
       if (+birthdayDate - +new Date() <= 0) {
        setIsTimeUp(true);
      } else {
        setIsTimeUp(false);
        setTimeLeft(calculateTimeLeft());
      }
    }
    checkDate();
    const timer = setInterval(checkDate, 1000);
    return () => clearInterval(timer);
  }, [birthdayDate, isLoaded]);

  const [passwordInput, setPasswordInput] = useState("");
  const { toast } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.toLowerCase().trim() === config.password.toLowerCase().trim()) {
      onSuccess();
    } else {
      toast({
        title: "Oops!",
        description: "That's not the magic word. Please try again!",
        variant: "destructive",
      });
      setPasswordInput("");
    }
  };

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    const value = timeLeft[interval as keyof TimeLeft];
    if (value === undefined || value < 0) {
      return null;
    }
    return (
      <div key={interval} className="flex flex-col items-center">
        <div className="font-headline text-5xl md:text-6xl text-accent">
          {String(value).padStart(2, '0')}
        </div>
        <div className="font-body text-sm text-muted-foreground uppercase tracking-wider">
          {interval}
        </div>
      </div>
    );
  });
  
  if (!isLoaded) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Skeleton className="h-9 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto mt-2" />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-1/2 mx-auto" />
            <div className="flex justify-around p-4 rounded-lg bg-background">
              <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-14 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
               <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-14 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
               <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-14 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
               <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-14 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
          <div className="space-y-4 border-t pt-6">
            <Skeleton className="h-5 w-3/4 mx-auto" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
         <CardFooter>
          <Skeleton className="h-4 w-1/4 mx-auto" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 shadow-xl rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-4xl">
          Sondos' Magical Birthday
        </CardTitle>
        <CardDescription className="font-body text-base">
          A special surprise is waiting...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {!isTimeUp && (
          <div className="space-y-4 text-center animate-in fade-in-50 duration-500">
            <p className="font-body text-muted-foreground">The magic awakens in:</p>
            <div className="flex justify-around p-4 rounded-lg bg-background">
              {timerComponents.some(c => c !== null) ? timerComponents : <p>Loading countdown...</p>}
            </div>
          </div>
        )}
        <form onSubmit={handlePasswordSubmit} className="space-y-4 border-t pt-6">
          <p className="text-center font-body text-muted-foreground">
            {isTimeUp
              ? "The time has come! Enter the magic word to unlock the surprise."
              : "Can't wait? Enter the magic word to get a sneak peek!"}
          </p>
          <Input
            type="password"
            placeholder="Magic word"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="text-center text-lg h-12"
            aria-label="Password for birthday surprise"
          />
          <Button type="submit" className="w-full h-12 font-headline text-lg" variant="default">
            {isTimeUp ? "Unlock Surprise" : "Sneak a Peek"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">Psst... the password is '{config.password}'.</p>
      </CardFooter>
    </Card>
  );
}
