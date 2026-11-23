"use client"

import { Card } from "@/components/ui/card"
import { MagicCard } from "@/components/magicui/magic-card"
import { cn } from "@/lib/utils"

/**
 * Shared card wrapper. Rendered on the server (content is in the initial HTML);
 * the theme-dependent spotlight colour comes from the `--magic-card-gradient`
 * CSS variable (styles/globals.css), so server and client markup match.
 */
export function BaseCard({ children, className }: React.ComponentProps<"div">) {
  return (
    <Card className="w-full border-none p-0 shadow-none">
      <MagicCard
        gradientColor="var(--magic-card-gradient)"
        gradientFrom="#7ccf00"
        gradientTo="#2b7fff"
        className={cn("p-4", className)}
      >
        {children}
      </MagicCard>
    </Card>
  )
}
