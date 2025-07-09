"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useBirthdayConfig } from "@/hooks/use-birthday-config";

export default function PhotoCarousel() {
  const { config } = useBirthdayConfig();

  if (!config.photoGallery || config.photoGallery.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-xl animate-in fade-in-50 duration-700"
    >
      <CarouselContent>
        {config.photoGallery.map((photoUrl, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="overflow-hidden">
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <Image
                    src={photoUrl}
                    alt={`Photo gallery image ${index + 1}`}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint="memories celebration"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
