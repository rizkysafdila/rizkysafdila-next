"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LOADING_PHRASES } from "@/constants/loading";

interface DotWaveLoaderProps {
  className?: string;
}

const GRID_SIZE = 25; // 5×5
const BASE_DELAY_STEP = 0.08; // seconds per dot

export function DotWaveLoader({ className }: DotWaveLoaderProps) {
  // Start from a random phrase so each load feels different.
  const [phraseIndex, setPhraseIndex] = useState(() =>
    Math.floor(Math.random() * LOADING_PHRASES.length)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIndex((prev) => {
        if (LOADING_PHRASES.length <= 1) return prev;
        // Pick a different phrase than the current one.
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * LOADING_PHRASES.length);
        }
        return next;
      });
    }, 1400);

    return () => clearInterval(id);
  }, []);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="grid grid-cols-5 gap-2.5">
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-white/10"
            style={{
              animation: `dotPulse 1.6s ease-in-out ${(i * BASE_DELAY_STEP).toFixed(2)}s infinite`,
            }}
          />
        ))}
      </div>
      <span
        key={phraseIndex}
        className="font-mono text-xs uppercase tracking-[2px] text-foreground"
        style={{ animation: "labelFade 1.4s ease-in-out" }}
      >
        {LOADING_PHRASES[phraseIndex]}
      </span>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { transform: scale(1);   opacity: 0.15; background: rgba(255,255,255,0.1); }
          50%       { transform: scale(1.5); opacity: 1;    background: oklch(76.8% 0.233 130.85); }
        }
        @keyframes labelFade {
          0%   { opacity: 0; transform: translateY(-3px); }
          15%  { opacity: 0.7; transform: translateY(0); }
          85%  { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
