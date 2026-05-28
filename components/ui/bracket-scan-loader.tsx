"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BracketScanLoaderProps {
  initials?: string;
  className?: string;
}

const STATUS_MESSAGES = ["Initializing", "Loading assets", "Almost ready"];

export function BracketScanLoader({
  initials = "rs.",
  className,
}: BracketScanLoaderProps) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const [name, suffix] = [initials.slice(0, -1), initials.slice(-1)];

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Bracket box */}
      <div className="relative flex h-20 w-28 items-center justify-center overflow-hidden">
        {/* Corners */}
        {(["tl", "tr", "bl", "br"] as const).map((pos, i) => (
          <Corner key={pos} position={pos} delay={i * 0.45} />
        ))}

        {/* Scan line */}
        <div
          className="absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-[#a5e547] to-transparent opacity-60"
          style={{ animation: "scanLine 1.8s ease-in-out infinite" }}
        />

        {/* Initials */}
        <span className="relative z-10 font-sans text-xl font-bold text-foreground">
          {name}
          <span className="text-lime-500">{suffix}</span>
        </span>
      </div>

      {/* Status row */}
      <div className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full bg-[#a5e547]"
          style={{ animation: "statusDot 1s ease-in-out infinite" }}
        />
        <span
          key={statusIndex}
          className="font-mono text-[9px] uppercase tracking-[1.5px] text-white/25"
          style={{ animation: "fadeStatus 0.4s ease-out" }}
        >
          {STATUS_MESSAGES[statusIndex]}
        </span>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes statusDot {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes fadeStatus {
          from { opacity: 0; transform: translateY(-3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cornerPulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Corner({
  position,
  delay,
}: {
  position: "tl" | "tr" | "bl" | "br";
  delay: number;
}) {
  const posClass = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  }[position];

  return (
    <span
      className={cn(
        "absolute h-3.5 w-3.5 border-[#a5e547]",
        posClass
      )}
      style={{
        borderWidth: "1.5px",
        animation: `cornerPulse 1.8s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}
