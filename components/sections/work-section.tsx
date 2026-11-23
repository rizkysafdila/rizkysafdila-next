import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Section } from "@/components/sections/section"
import { ProjectList } from "@/components/project/project-list"
import type { TProject } from "@/types/project.type"

export function WorkSection({ projects }: { projects: TProject[] }) {
  return (
    <Section
      id="work"
      index="02"
      label="Selected work"
      title="Things I've built"
      aside={
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          All projects
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      }
    >
      {projects.length === 0 ? (
        <p className="text-muted-foreground">Projects coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectList key={project.id} data={project} size="large" />
          ))}
        </div>
      )}
    </Section>
  )
}
