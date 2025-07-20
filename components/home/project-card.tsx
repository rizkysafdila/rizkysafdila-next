"use client"

import { CardContent, CardHeader } from "@/components/ui/card"
import { BlurFade } from "@/components/magicui/blur-fade"
import { BaseCard } from "@/components/base-card"

export function ProjectCard() {
  return (
    <BaseCard>
      <CardHeader className="px-2 py-0">
        <BlurFade delay={0.5} inView>
          <h2 className="text-lg font-semibold">
            Featured Projects
          </h2>
        </BlurFade>
      </CardHeader>
      <CardContent className="p-2">
        {/* ProjectList here */}  
      </CardContent>
    </BaseCard>
  )
}