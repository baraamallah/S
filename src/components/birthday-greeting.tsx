"use client";

import Balloons from "./balloons";
import Sparkles from "./sparkles";
import { Card, CardContent } from "@/components/ui/card";
import { useBirthdayConfig } from "@/hooks/use-birthday-config";
import { Skeleton } from "./ui/skeleton";
import BirthdayCake from "./birthday-cake";
import CuteCat from "./cute-cat";

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
      className="relative w-full min-h-screen overflow-hidden flex flex-col p-4"
      style={backgroundStyle}
    >
      {config.backgroundImage && <div className="absolute inset-0 bg-black/20 z-0" />}
      <Balloons />
      <Sparkles />

      <main className="relative z-10 flex flex-col flex-grow justify-center items-center">
        <Card className="w-full max-w-2xl text-center bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-700">
          <CardContent className="p-6 md:p-10">
            <h1 className="font-headline text-4xl md:text-6xl text-primary-foreground/90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
              {config.title}
            </h1>
            <p 
              className="font-body text-base md:text-lg mt-6 text-foreground/80"
              dangerouslySetInnerHTML={{ __html: config.poem }}
            />
          </CardContent>
        </Card>
      </main>
      
      <footer className="relative z-10 flex-shrink-0 flex justify-center items-end pt-4 pb-4 md:pb-8">
        <CuteCat className="w-24 md:w-32 -mr-4" />
        <BirthdayCake className="w-48 md:w-64" />
        <CuteCat className="w-24 md:w-32 -ml-4 transform scale-x-[-1]" />
      </footer>
      
    </div>
  );
}
