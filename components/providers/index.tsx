"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SmoothScroll } from "@/components/providers/smooth-scroll"
import { MotionConfig } from "motion/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {/* "user": honour prefers-reduced-motion (skip transform animations) */}
      <MotionConfig reducedMotion="user">
        <SmoothScroll>{children}</SmoothScroll>
      </MotionConfig>
    </ThemeProvider>
  )
}
