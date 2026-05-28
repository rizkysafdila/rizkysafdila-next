"use client";

import { useEffect, useState } from "react";

/**
 * Animates a numeric counter from 0 → 100 over `duration` ms.
 * Resets automatically so it can loop for preview purposes.
 */
export function useLoadingCounter(duration = 2400, loop = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;

    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * 100));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else if (loop) {
        startTime = null;
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [duration, loop]);

  return value;
}
