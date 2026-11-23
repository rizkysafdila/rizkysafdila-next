"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SmoothScroll } from "@/components/providers/smooth-scroll"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SmoothScroll>{children}</SmoothScroll>
    </ThemeProvider>
  )
}
