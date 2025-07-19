
"use client";

import { useBirthdayConfig, type Letter } from "@/hooks/use-birthday-config";
import { Skeleton } from "./ui/skeleton";
import BirthdayCake from "./birthday-cake";
import CuteCat from "./cute-cat";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";
import { Button } from "./ui/button";
import { PartyPopper, ArrowLeft } from "lucide-react";
import Balloons from "./balloons";
import PhotoCarousel from "./photo-carousel";
import Fireworks from "./fireworks";

export default function BirthdayGreeting({ letter, onGoBack }: { letter: Letter, onGoBack: () => void }) {
  const { config, isLoaded } = useBirthdayConfig();
  const [isCelebrating, setIsCelebrating] = useState(false);

  if (!isLoaded) {
    return (
        <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center p-4">
            <Card className="z-10 max-w-2xl text-center bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl">
                <CardContent className="p-8 md:p-12 space-y-8">
                    <Skeleton className="h-16 w-full max-w-md mx-auto" />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6 mx-auto" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-4/6 mx-auto" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-2/3 mx-auto" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }
  
  const backgroundStyle = config.backgroundImage
    ? {
        backgroundImage: `url("${config.backgroundImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  const handleCelebrate = () => {
    setIsCelebrating(true);
  }

  const showBalloons = letter.showBalloons !== false;
  const showFireworks = letter.showFireworks !== false;
  const showCakeAndCats = letter.showCakeAndCats !== false;
  const showBackButton = letter.showBackButton !== false;

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col p-4"
      style={backgroundStyle}
    >
      {isCelebrating && showBalloons && <Balloons />}
      {isCelebrating && showFireworks && <Fireworks isActive={isCelebrating} />}
      {config.backgroundImage && <div className="absolute inset-0 bg-black/20 z-0" />}
      
      <header className="relative z-10 w-full flex justify-start p-2">
         {showBackButton && (
          <Button onClick={onGoBack} variant="outline" className="backdrop-blur-sm bg-background/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
      </header>

      <main className="relative z-10 flex flex-grow flex-col justify-center items-center gap-6">
        <Card className="w-full max-w-2xl text-center bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-700">
          <CardContent className="p-6 md:p-10">
            <h1 className="font-headline text-4xl md:text-6xl text-primary-foreground/90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
              {letter.title}
            </h1>
            <p 
              className="font-body text-base md:text-lg mt-6 text-foreground/80"
              dangerouslySetInnerHTML={{ __html: letter.content }}
            />
          </CardContent>
        </Card>

        <PhotoCarousel />
        
        {!isCelebrating && (showBalloons || showFireworks) && (
          <Button
            onClick={handleCelebrate}
            size="lg"
            className="font-headline text-xl animate-in fade-in-50 duration-1000 delay-500 fill-mode-both"
          >
            <PartyPopper className="mr-3 h-6 w-6" />
            Celebrate!
          </Button>
        )}
      </main>
      
      {showCakeAndCats && (
        <footer className="relative z-10 flex-shrink-0 flex justify-center items-end pt-4 pb-4 md:pb-8">
          <CuteCat className="w-24 md:w-32 -mr-4" />
          <BirthdayCake className="w-48 md:w-64" />
          <CuteCat className="w-24 md:w-32 -ml-4 transform scale-x-[-1]" />
        </footer>
      )}
      
    </div>
  );
}
