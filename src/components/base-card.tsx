"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MagicCard } from "@/components/magicui/magic-card"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function BaseCard({ children, className }: React.ComponentProps<"div">) {
  const { theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Card className={cn(
      "p-0 w-full shadow-none border-none",
      // className
    )}>
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        gradientFrom="#7ccf00"
        gradientTo="#2b7fff"
        className={cn(
          "p-4",
          className,
        )}
      >
        {children}
      </MagicCard>
    </Card>
  )
}