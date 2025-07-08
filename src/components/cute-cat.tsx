import { cn } from "@/lib/utils";

export default function CuteCat({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none", className)}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <g transform="translate(0, 20)">
          {/* Tail */}
          <path
            d="M 160 130 Q 180 100 190 150"
            stroke="hsl(var(--foreground) / 0.8)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            className="animate-tail-wag"
          />

          {/* Body */}
          <path
            d="M 50 160 C 20 160, 10 120, 40 90 C 80 40, 140 40, 160 90 C 190 120, 180 160, 150 160 Z"
            fill="hsl(var(--foreground) / 0.8)"
          />
          <path
            d="M 50 160 C 20 160, 10 120, 40 90 C 80 40, 140 40, 160 90 C 190 120, 180 160, 150 160 Z"
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            fill="none"
          />

          {/* Head */}
          <circle cx="100" cy="80" r="45" fill="hsl(var(--foreground) / 0.8)" />
          <circle cx="100" cy="80" r="45" stroke="hsl(var(--foreground))" strokeWidth="3" fill="none" />
          
          {/* Ears */}
          <path d="M 60 50 L 75 25 L 90 50 Z" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--foreground))" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M 110 50 L 125 25 L 140 50 Z" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--foreground))" strokeWidth="3" strokeLinejoin="round"/>

          {/* Inner ears */}
          <path d="M 70 45 L 78 35 L 85 45 Z" fill="hsl(var(--primary))"/>


          {/* Eyes */}
          <circle cx="85" cy="80" r="5" fill="hsl(var(--background))" />
          <circle cx="115" cy="80" r="5" fill="hsl(var(--background))" />

          {/* Nose & Mouth */}
          <path d="M 97 90 L 103 90 L 100 94 Z" fill="hsl(var(--primary))"/>
          <path d="M 100 94 Q 95 100 90 95" stroke="hsl(var(--background))" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 100 94 Q 105 100 110 95" stroke="hsl(var(--background))" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
