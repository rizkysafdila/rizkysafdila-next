import { BlurFade } from "@/components/magicui/blur-fade"
import { ProjectList } from "@/components/project/project-list"
import { Section } from "@/components/sections/section"
import { fetchProjects } from "@/services/project"

export default async function Projects() {
  const { projects } = await fetchProjects()
  const all = projects ?? []

  return (
    <Section id="projects" index="—" label="Archive" title="All projects" className="pt-32">
      {all.length === 0 ? (
        <p className="text-muted-foreground">Projects coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {all.map((project, i) => (
            <BlurFade key={project.id} delay={0.1 * (i + 1)} direction="up" inView>
              <ProjectList data={project} className="h-full" />
            </BlurFade>
          ))}
        </div>
      )}
    </Section>
  )
}
