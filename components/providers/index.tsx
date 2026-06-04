"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ProjectModalProvider } from "@/components/project/project-modal-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ProjectModalProvider>{children}</ProjectModalProvider>
    </ThemeProvider>
  )
}
