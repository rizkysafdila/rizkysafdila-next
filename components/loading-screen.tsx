"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ProgressLoader } from "@/components/ui/progress-loader"
import { DotWaveLoader } from "@/components/ui/dot-wave-loader"
import { LetterDropLoader } from "@/components/ui/letter-drop-loader"
import { BracketScanLoader } from "@/components/ui/bracket-scan-loader"
import type { LoadingScreenProps } from "@/types/loading.type"
import { usePageLoader } from "@/hooks/use-page-loader"

export function LoadingScreen({
  variant = "dot-wave",
  name = "rizky",
  accent = "safdila",
  subtitle = "Software Engineer",
  // isLoaded = false,
  onComplete,
}: LoadingScreenProps) {
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden] = useState(false)

  const isLoaded = usePageLoader()

  useEffect(() => {
    if (!isLoaded) return

    setExiting(true)
    const timer = setTimeout(() => {
      setHidden(true)
      onComplete?.()
    }, 600) // match exit animation duration

    return () => clearTimeout(timer)
  }, [isLoaded, onComplete])

  if (hidden) return null

  return (
    <div
      aria-label="Loading portfolio"
      role="status"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background",
        "transition-opacity duration-500 ease-in-out",
        exiting ? "opacity-0" : "opacity-100",
        // Dotted background matching the rest of the portfolio
        "bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)]",
        "bg-size-[28px_28px]"
      )}
    >
      {variant === "progress" && (
        <ProgressLoader name={name} accent={accent} />
      )}
      {variant === "dot-wave" && <DotWaveLoader />}
      {variant === "letter-drop" && (
        <LetterDropLoader name={name} accent={accent} subtitle={subtitle} />
      )}
      {variant === "bracket-scan" && (
        <BracketScanLoader initials={`${name[0]}${accent[0]}.`} />
      )}
    </div>
  )
}
