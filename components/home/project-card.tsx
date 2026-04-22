"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BlurFade } from "@/components/magicui/blur-fade"
import { TProject } from "@/types/project.type"
import { ProjectList } from "@/components/project/project-list"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Meteors } from "@/components/magicui/meteors"
import { useTheme } from "next-themes"

interface IProjectCardProps {
  projects: TProject[]
}

export function ProjectCard({ projects }: IProjectCardProps) {
  const { theme } = useTheme()

  return (
    <Card className="relative w-full overflow-hidden p-4 bg-background shadow-none gap-1.5">
      {theme === "dark" && <Meteors number={30} />}
      <CardHeader className="px-2 py-0">
        <BlurFade delay={0.5} inView className="flex justify-between items-center gap-2">
          <h2 className="text-lg font-semibold">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="text-sm flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            View All
            <ArrowRight className="size-4" />
          </Link>
        </BlurFade>
      </CardHeader>
      <CardContent className="p-2">
        <div className="grid lg:flex items-center lg:flex-wrap gap-4">
          {projects?.map((project, i) => (
            <BlurFade
              key={project?.id}
              delay={0.5 * (i + 1)}
              direction="up"
              inView
            >
              <ProjectList data={project} className="lg:max-w-2xs" />
            </BlurFade>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}