import { cn } from "@/lib/utils";

export default function Flowers({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none", className)}>
      <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(20, 20) rotate(-15) scale(0.9)">
          {/* Stem */}
          <path d="M 100 180 C 100 120, 50 120, 50 80" stroke="hsl(var(--chart-2) / 0.8)" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M 50 130 C 70 140, 70 110, 50 120" fill="hsl(var(--chart-2) / 0.8)" />
          {/* Petals */}
          <circle cx="50" cy="80" r="20" fill="hsl(var(--primary))" />
          <circle cx="35" cy="70" r="18" fill="hsl(var(--primary) / 0.9)" />
          <circle cx="65" cy="70" r="18" fill="hsl(var(--primary) / 0.9)" />
          <circle cx="35" cy="90" r="18" fill="hsl(var(--primary) / 0.9)" />
          <circle cx="65" cy="90" r="18" fill="hsl(var(--primary) / 0.9)" />
          {/* Center */}
          <circle cx="50" cy="80" r="10" fill="hsl(var(--chart-4))" />
        </g>
        <g transform="translate(180, 40) rotate(25) scale(1.1)">
          {/* Stem */}
          <path d="M 100 180 C 100 120, 150 120, 150 80" stroke="hsl(var(--chart-2) / 0.8)" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M 150 130 C 130 140, 130 110, 150 120" fill="hsl(var(--chart-2) / 0.8)" />
          {/* Petals */}
          <circle cx="150" cy="80" r="20" fill="hsl(var(--accent))" />
          <circle cx="135" cy="70" r="18" fill="hsl(var(--accent) / 0.9)" />
          <circle cx="165" cy="70" r="18" fill="hsl(var(--accent) / 0.9)" />
          <circle cx="135" cy="90" r="18" fill="hsl(var(--accent) / 0.9)" />
          <circle cx="165" cy="90" r="18" fill="hsl(var(--accent) / 0.9)" />
          {/* Center */}
          <circle cx="150" cy="80" r="10" fill="hsl(var(--chart-4))" />
        </g>
      </svg>
    </div>
  );
}
