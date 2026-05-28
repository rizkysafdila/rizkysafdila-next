import { cn } from "@/lib/utils";

interface DotWaveLoaderProps {
  className?: string;
}

const GRID_SIZE = 25; // 5×5
const BASE_DELAY_STEP = 0.08; // seconds per dot

export function DotWaveLoader({ className }: DotWaveLoaderProps) {
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
        className="font-mono text-xs uppercase tracking-[2px] text-foreground"
        style={{ animation: "labelBlink 1.6s ease-in-out infinite" }}
      >
        Loading
      </span>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { transform: scale(1);   opacity: 0.15; background: rgba(255,255,255,0.1); }
          50%       { transform: scale(1.5); opacity: 1;    background: oklch(76.8% 0.233 130.85); }
        }
        @keyframes labelBlink {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
