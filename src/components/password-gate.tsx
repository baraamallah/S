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

// Admin-configurable settings (hardcoded for now)
const BIRTHDAY_DATE_STRING = "2024-08-23T00:00:00";
const PASSWORD = "sondos";

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export default function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const birthdayDate = useMemo(() => new Date(BIRTHDAY_DATE_STRING), []);
  const [isClient, setIsClient] = useState(false);

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
    setIsClient(true);
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
  }, [birthdayDate]);

  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase().trim() === PASSWORD) {
      onSuccess();
    } else {
      toast({
        title: "Oops!",
        description: "That's not the magic word. Please try again!",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval as keyof TimeLeft]) {
      return null;
    }
    return (
      <div key={interval} className="flex flex-col items-center">
        <div className="font-headline text-5xl md:text-6xl text-accent">
          {String(timeLeft[interval as keyof TimeLeft]).padStart(2, '0')}
        </div>
        <div className="font-body text-sm text-muted-foreground uppercase tracking-wider">
          {interval}
        </div>
      </div>
    );
  });
  
  if (!isClient) {
    return null; // or a loading skeleton
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
      <CardContent>
        {isTimeUp ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <p className="text-center font-body text-muted-foreground">The time has come! Enter the magic word to unlock the surprise.</p>
            <Input
              type="password"
              placeholder="Magic word"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center text-lg h-12"
              aria-label="Password for birthday surprise"
            />
            <Button type="submit" className="w-full h-12 font-headline text-lg" variant="default">
              Unlock Surprise
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-center font-body text-muted-foreground">The magic awakens in:</p>
            <div className="flex justify-around p-4 rounded-lg bg-background">
              {timerComponents.length ? timerComponents : <p>Loading countdown...</p>}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">Psst... the password is 'sondos'.</p>
      </CardFooter>
    </Card>
  );
}
