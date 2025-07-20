"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      aria-label="Theme toggle"
      className="rounded-xl cursor-pointer size-11"
      size="icon"
      variant="ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? <Sun /> : <Moon />}
    </Button>
  )
}
