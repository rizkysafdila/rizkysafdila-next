"use client";

import { useLoadingCounter } from "@/hooks/use-loading-counter";
import { cn } from "@/lib/utils";

interface ProgressLoaderProps {
  name?: string;
  accent?: string;
  className?: string;
}

export function ProgressLoader({
  name = "rizky",
  accent = "safdila",
  className,
}: ProgressLoaderProps) {
  const count = useLoadingCounter(2400);

  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      {/* Logo */}
      <span className="font-sans text-2xl font-bold tracking-tight text-foreground">
        {name}
        <span className="text-lime-500">{accent}</span>
        <span className="text-lime-500">.</span>
      </span>

      {/* Progress bar + counter */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-px w-40 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-lime-500 transition-none"
            style={{ width: `${count}%` }}
          />
        </div>
        <span className="font-mono text-xs tracking-[2px] text-foreground">
          {String(count).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
