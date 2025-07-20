"use client"

import { CardContent, CardHeader } from "@/components/ui/card"
import { BlurFade } from "@/components/magicui/blur-fade"
import { BaseCard } from "@/components/base-card"

export function SummaryCard() {
  return (
    <BaseCard>
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
            I’m committed to continuous learning and staying up-to-date with modern web technologies. I thrive in delivering high-quality user experiences that make a real impact.
          </p>
        </BlurFade>
      </CardContent>
    </BaseCard>
  )
}