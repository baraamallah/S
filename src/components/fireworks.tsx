"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Firework = ({ id }: { id: number }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const top = `${Math.random() * 80 + 10}%`;
    const left = `${Math.random() * 80 + 10}%`;
    const animationDelay = `${Math.random() * 0.5}s`;
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--accent))",
      "hsl(var(--chart-4))",
      "#FFFFFF",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 2.5 + 2; // size in rem, 2rem to 4.5rem

    setStyle({
      top,
      left,
      animationDelay,
      borderColor: color,
      width: `${size}rem`,
      height: `${size}rem`,
    });
  }, [id]);

  return (
    <div
      className="absolute rounded-full border-4 animate-firework-burst"
      style={style}
    />
  );
};

export default function Fireworks({ isActive }: { isActive: boolean }) {
  const [fireworks, setFireworks] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      // Use a random key to force re-render and re-animation
      setFireworks(Array.from({ length: 15 }, (_, i) => i + Math.random()));
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {fireworks.map((id) => (
        <Firework key={id} id={id} />
      ))}
    </div>
  );
}
