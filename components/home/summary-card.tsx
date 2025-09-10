"use client"

import { CardContent, CardHeader } from "@/components/ui/card"
import { BlurFade } from "@/components/magicui/blur-fade"
import { BaseCard } from "@/components/base-card"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import Link from "next/link"
import { RESUME_LINK } from "@/constants"

export function SummaryCard() {
  return (
    <BaseCard>
      <CardHeader className="px-2 py-0">
        <BlurFade delay={0.5} inView className="flex justify-between items-center-safe">
          <h2 className="text-lg font-semibold">About Me</h2>
          <Link href={RESUME_LINK} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:gap-3 transition-all duration-300 text-gray-700 dark:text-gray-400 cursor-pointer"
            >
              <DownloadIcon />
              My Resume
            </Button>
          </Link>
        </BlurFade>
      </CardHeader>
      <CardContent className="p-2">
        <BlurFade delay={0.75} inView>
          <p className="text-muted-foreground text-sm text-pretty mb-2">
            Hi 👋, I’m a passionate Software Engineer with a focus on building efficient, scalable, and user-friendly web apps. Experienced across both frontend and backend, passionate about clean code and solving real-world problems through thoughtful engineering.
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