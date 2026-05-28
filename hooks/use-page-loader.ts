"use client";

import { useEffect, useState } from "react";

interface UsePageLoaderOptions {
  /** Minimum time (ms) the loader must stay visible even if page loaded faster */
  minDuration?: number;
}

/**
 * Tracks whether the page has finished loading (window "load" event).
 * Enforces a minimum display duration so the loader doesn't flash too quickly.
 *
 * Usage:
 *   const isLoaded = usePageLoader({ minDuration: 2000 });
 *   return <LoadingScreen isLoaded={isLoaded} />;
 */
export function usePageLoader({ minDuration = 2000 }: UsePageLoaderOptions = {}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const markLoaded = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);
      setTimeout(() => setIsLoaded(true), remaining);
    };

    if (document.readyState === "complete") {
      markLoaded();
    } else {
      window.addEventListener("load", markLoaded, { once: true });
    }

    return () => window.removeEventListener("load", markLoaded);
  }, [minDuration]);

  return isLoaded;
}
