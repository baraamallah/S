"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Balloon = ({ id }: { id: number }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const left = `${Math.random() * 95}vw`;
    const animationDuration = `${Math.random() * 10 + 10}s`;
    const animationDelay = `${Math.random() * 10}s`;
    const colors = [
      "hsl(var(--primary) / 0.7)",
      "hsl(var(--accent) / 0.7)",
      "hsl(0 0% 100% / 0.7)",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 4 + 4; // size in rem, from 4rem to 8rem

    setStyle({
      left,
      animationDuration,
      animationDelay,
      backgroundColor: color,
      width: `${size}rem`,
      height: `${size * 1.25}rem`,
      boxShadow: `inset -10px -10px 0 ${color.replace('0.7', '0.5')}`
    });
  }, []);

  return (
    <div
      className={cn(
        "absolute bottom-[-200px] rounded-[50%] animate-float will-change-transform"
      )}
      style={style}
    >
      <div
        className="absolute w-1/4 h-1/4 bg-inherit rounded-bl-[40%]"
        style={{
          bottom: "-2px",
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          filter: "brightness(0.9)"
        }}
      />
    </div>
  );
};

export default function Balloons() {
  const [balloonIds, setBalloonIds] = useState<number[]>([]);

  useEffect(() => {
    // Generate unique IDs for balloons
    setBalloonIds(Array.from({ length: 15 }, (_, i) => i));
  }, []);


  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {balloonIds.map((id) => <Balloon key={id} id={id} />)}
    </div>
  );
}
