"use client";

import { useEffect, useState } from "react";
import SparkleIcon from "./sparkle-icon";

interface Sparkle {
  id: number;
  style: React.CSSProperties;
}

export default function Sparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generatedSparkles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${Math.random() * 1.5 + 1.5}s`, // 1.5s to 3s
      },
    }));
    setSparkles(generatedSparkles);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      {sparkles.map((s) => (
        <div key={s.id} className="absolute animate-twinkle" style={s.style}>
          <SparkleIcon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      ))}
    </div>
  );
}
