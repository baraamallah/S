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
      className="relative w-full min-h-screen overflow-hidden flex flex-col animate-in fade-in duration-1000"
      style={backgroundStyle}
    >
      {config.backgroundImage && <div className="absolute inset-0 bg-black/20 z-0" />}
      <Balloons />
      <Sparkles />

      {/* Top content area for the poem card */}
      <div className="flex-grow flex items-center justify-center z-10 p-4">
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
      </div>
      
      {/* Bottom "stage" for decorations */}
      <div className="relative w-full h-[35vh] min-h-[280px] md:h-[40vh] md:min-h-[350px] pointer-events-none">
        <Flowers className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-md z-10" />
        <Flowers className="absolute bottom-0 right-[-15%] md:right-[-5%] w-full max-w-xs md:max-w-sm z-10 -scale-x-100" />
        <Flowers className="absolute bottom-0 left-[-15%] md:left-[-5%] w-full max-w-xs md:max-w-sm z-10" />
        
        <BirthdayCake className="absolute bottom-0 left-1/2 -translate-x-[90%] md:-translate-x-3/4 z-20" />
        
        <CuteCat className="absolute bottom-0 right-4 md:right-8 w-40 md:w-52 z-20" />
        <CuteCat className="absolute bottom-0 left-[30%] w-32 md:w-40 z-20 -scale-x-100" />
        <CuteCat className="absolute bottom-[30%] left-[calc(50%-8rem)] md:left-[calc(50%-6rem)] w-24 -rotate-12 z-20" />
      </div>
    </div>
  );
}
