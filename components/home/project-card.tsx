"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BlurFade } from "@/components/magicui/blur-fade"
import { TProject } from "@/types/project.type"
import { ProjectList } from "@/components/project/project-list"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BorderBeam } from "@/components/magicui/border-beam"
import { Meteors } from "@/components/magicui/meteors"

interface IProjectCardProps {
  projects: TProject[]
}

export function ProjectCard({ projects }: IProjectCardProps) {
  return (
    <Card className="relative w-full overflow-hidden p-4 bg-background shadow-none gap-1.5">
      <Meteors number={30} />
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
        <div className="flex items-center gap-4">
          {projects?.map((project, i) => (
            <BlurFade
              key={project?.id}
              delay={0.5 * (i + 1)}
              direction="up"
              inView
            >
              <ProjectList data={project} className="max-w-2xs" />
            </BlurFade>
          ))}
        </div>
      </CardContent>

      <BorderBeam
        duration={8}
        size={100}
        colorFrom="#7ccf00"
        colorTo="#2b7fff"
      />
    </Card>
  )
}