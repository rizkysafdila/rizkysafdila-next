import { BlurFade } from "@/components/magicui/blur-fade"
import { BorderBeam } from "@/components/magicui/border-beam"
import { Meteors } from "@/components/magicui/meteors"
import { ProjectList } from "@/components/project/project-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchProjects } from "@/services/project"

export default async function Projects() {
  const { projects } = await fetchProjects()

  return (
    <div className="my-16 md:my-5">
      <Card className="relative w-full overflow-hidden shadow-none gap-4">
        <Meteors number={30} />
        <CardHeader>
          <BlurFade delay={0.5} inView>
            <CardTitle>All Projects</CardTitle>
          </BlurFade>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-4">
            {projects?.map((project, i) => (
              <BlurFade
                key={project?.id}
                delay={0.5 * (i + 1)}
                direction="up"
                inView
                >
                <ProjectList data={project} />
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
    </div>
  )
}