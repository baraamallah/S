"use client";

import Balloons from "./balloons";
import CuteCat from "./cute-cat";
import Sparkles from "./sparkles";
import { Card, CardContent } from "@/components/ui/card";
import { useBirthdayConfig } from "@/hooks/use-birthday-config";
import { Skeleton } from "./ui/skeleton";
import BirthdayCake from "./birthday-cake";
import Flowers from "./flowers";

export default function BirthdayGreeting() {
  const { config, isLoaded } = useBirthdayConfig();

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

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center p-4 animate-in fade-in duration-1000"
      style={backgroundStyle}
    >
      {config.backgroundImage && <div className="absolute inset-0 bg-black/20" />}
      <Balloons />
      <Sparkles />

      <Card className="z-10 max-w-2xl text-center bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-700">
        <CardContent className="p-8 md:p-12">
          <h1 className="font-headline text-5xl md:text-7xl text-primary-foreground/90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
            {config.title}
          </h1>
          <p 
            className="font-body text-lg md:text-xl mt-8 text-foreground/80"
            dangerouslySetInnerHTML={{ __html: config.poem }}
          />
        </CardContent>
      </Card>
      
      <BirthdayCake />
      
      {/* Original flowers */}
      <Flowers />
      
      {/* Added more flowers on the right */}
      <div className="absolute bottom-0 right-0 w-80 md:w-96 z-10 pointer-events-none translate-y-8 -scale-x-100">
        <Flowers />
      </div>

      {/* Original cats */}
      <CuteCat className="absolute bottom-0 right-4 w-40 md:w-52 z-20 pointer-events-none translate-y-4 md:translate-y-6" />
      <CuteCat className="absolute bottom-0 left-44 w-32 md:w-40 z-20 pointer-events-none translate-y-4 md:translate-y-6 -scale-x-100" />
      
      {/* Added another cat peeking from the cake */}
      <div className="absolute bottom-16 left-32 w-24 z-20 pointer-events-none -rotate-12">
        <CuteCat />
      </div>
    </div>
  );
}
