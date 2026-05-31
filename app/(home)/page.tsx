import { ProfileCard } from "@/components/home/profile-card"
import { SummaryCard } from "@/components/home/summary-card"
import { TechCard } from "@/components/home/tech-card"
import { ProjectCard } from "@/components/home/project-card"
import { fetchProjects } from "@/services/project"
import { Ripple } from "@/components/ui/ripple"
import { WordRotate } from "@/components/ui/word-rotate"
import { fetchProfile } from "@/services/profile"

export default async function Home() {
  const [{ profile }, { projects }] = await Promise.all([
    fetchProfile(),
    fetchProjects({ is_featured: true }),
  ])

  return (
    <div className="my-16 md:my-5 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 md:max-w-sm md:mx-auto">
          <ProfileCard data={profile!} />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <SummaryCard />
          <TechCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ProjectCard projects={projects!} />
        </div>
        <div className="lg:col-span-1 bg-white dark:bg-gray-950 h-100 lg:h-full rounded-xl overflow-hidden relative flex justify-center items-center">
          {/* <ContactCard /> */}
          <Ripple />

          <WordRotate
            className="text-2xl font-semibold font-syne"
            words={[
              "Made with",
              { text: "Love", color: "#EC4899" },
              { text: "Hate", color: "#f59e0b" },
              "and",
              { text: "Claude", color: "#D85A30" },
            ]}
            duration={1500}
          />
        </div>
      </div>
    </div>
  )
}
