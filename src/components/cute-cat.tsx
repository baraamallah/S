import { cn } from "@/lib/utils";

export default function CuteCat({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none", className)}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <g>
          {/* Tail */}
          <path
            d="M 130,160 C 160,180 180,140 160,110"
            stroke="hsl(var(--muted-foreground) / 0.8)"
            strokeWidth="15"
            fill="none"
            strokeLinecap="round"
            className="origin-[130px_160px] animate-tail-wag"
          />

          {/* Body */}
          <path
            d="M 100,180 C 70,180 60,140 70,110 C 75,90 90,80 100,80 C 110,80 125,90 130,110 C 140,140 130,180 100,180 Z"
            fill="hsl(var(--muted-foreground) / 0.8)"
          />
          {/* Head */}
          <circle cx="100" cy="80" r="40" fill="hsl(var(--muted-foreground) / 0.8)" />
          
          {/* Paws */}
          <ellipse cx="80" cy="178" rx="15" ry="8" fill="hsl(var(--muted-foreground) / 0.6)" />
          <ellipse cx="120" cy="178" rx="15" ry="8" fill="hsl(var(--muted-foreground) / 0.6)" />
          
          {/* Ears */}
          <path
            d="M 70,50 L 60,20 L 90,50 Z"
            fill="hsl(var(--muted-foreground) / 0.8)"
            stroke="hsl(var(--muted-foreground) / 0.8)"
            strokeLinejoin="round"
          />
          <path
            d="M 130,50 L 140,20 L 110,50 Z"
            fill="hsl(var(--muted-foreground) / 0.8)"
            stroke="hsl(var(--muted-foreground) / 0.8)"
            strokeLinejoin="round"
          />

          {/* Face */}
          <g>
            <circle cx="88" cy="80" r="4" fill="hsl(var(--card))" />
            <circle cx="112" cy="80" r="4" fill="hsl(var(--card))" />
            <path d="M 100 90 L 104 95 L 96 95 Z" fill="hsl(var(--primary) / 0.7)" />
          </g>
        </g>
      </svg>
    </div>
  );
}
