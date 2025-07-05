export default function BirthdayCake() {
  return (
    <div className="absolute bottom-0 left-4 w-52 md:w-64 z-20 pointer-events-none translate-y-12 md:translate-y-16">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
        <defs>
          <g id="flame">
            <path d="M 0 -2 C 4 -8, -4 -8, 0 -14 C -4 -8, 4 -8, 0 -2 Z" fill="hsl(var(--chart-4))" />
            <path d="M 0 -4 C 2 -8, -2 -8, 0 -11 C -2 -8, 2 -8, 0 -4 Z" fill="hsl(var(--chart-1))" />
          </g>
        </defs>
        <g>
          {/* Cake Stand */}
          <path d="M 30 180 H 170" stroke="hsl(var(--muted-foreground) / 0.7)" strokeWidth="4" strokeLinecap="round" />
          <path d="M 95 170 V 180" stroke="hsl(var(--muted-foreground) / 0.7)" strokeWidth="10" />
          <ellipse cx="100" cy="170" rx="50" ry="8" fill="hsl(var(--muted))" stroke="hsl(var(--muted-foreground) / 0.7)" strokeWidth="2" />

          {/* Bottom Tier */}
          <rect x="20" y="120" width="160" height="50" rx="8" fill="hsl(var(--accent))" />
          <path d="M 20 120 C 50 110, 150 110, 180 120" stroke="hsl(var(--accent-foreground) / 0.5)" strokeWidth="2" fill="none" />
          <path d="M 20 120 C 35 135, 45 135, 55 120 C 65 135, 75 135, 85 120 C 95 135, 105 135, 115 120 C 125 135, 135 135, 145 120 C 155 135, 165 135, 175 120 L 180 120 Z" fill="hsl(var(--card))" />
          
          {/* Top Tier */}
          <rect x="40" y="70" width="120" height="50" rx="8" fill="hsl(var(--primary))" />
           <path d="M 40 70 C 60 60, 140 60, 160 70" stroke="hsl(var(--primary-foreground) / 0.5)" strokeWidth="2" fill="none" />
           <path d="M 40 70 C 50 85, 60 85, 70 70 C 80 85, 90 85, 100 70 C 110 85, 120 85, 130 70 L 140 70 Z" fill="hsl(var(--card))" />
          
           {/* "Thank You!" Text */}
           <text x="100" y="150" fontFamily="Playfair Display, serif" fontSize="18" fill="hsl(var(--accent-foreground))" textAnchor="middle" fontWeight="700">
            Thank you
          </text>
          
          {/* Candles */}
          <g>
            {/* Candle 1 */}
            <g transform="translate(80, 45)">
              <rect x="-4" y="0" width="8" height="25" rx="2" fill="hsl(var(--secondary))" />
              <use href="#flame" transform="translate(0, 0)" />
            </g>
            
            {/* Candle 5 */}
            <g transform="translate(115, 45)">
              <path d="M 10 0 H -5 V 10 H 5 C 15 10, 15 20, 5 20 H -5" stroke="hsl(var(--secondary))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <use href="#flame" transform="translate(2, 0)" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
