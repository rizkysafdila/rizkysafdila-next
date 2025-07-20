"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MagicCard } from "@/components/magicui/magic-card"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { BlurFade } from "@/components/magicui/blur-fade"

export function SummaryCard({ className }: React.ComponentProps<"div">) {
  const { theme } = useTheme()

  return (
    <Card className={cn(
      "p-0 w-full shadow-none border-none",
      className
    )}>
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        gradientFrom="#7ccf00"
        gradientTo="#2b7fff"
        className="p-4"
      >
        <CardHeader className="px-2 py-0">
          <BlurFade delay={0.5} inView>
            <h2 className="text-lg font-semibold">About Me</h2>
          </BlurFade>
        </CardHeader>
        <CardContent className="p-2">
          <BlurFade delay={0.75} inView>
            <p className="text-muted-foreground text-sm text-pretty mb-2">
              Hi 👋, I’m a passionate Software Engineer with a strong focus on building responsive, accessible, and user-centered web applications. I enjoy turning complex problems into simple, elegant solutions through clean and maintainable code.
            </p>
          </BlurFade>
          <BlurFade delay={0.75} inView>
            <p className="text-muted-foreground text-sm text-pretty">
              I’m committed to continuous learning and staying up-to-date with modern web technologies. I thrive in collaborative environments and take pride in delivering high-quality user experiences that make a real impact.
            </p>
          </BlurFade>
        </CardContent>
      </MagicCard>
    </Card>
  )
}