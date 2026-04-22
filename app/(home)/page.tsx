import { ProfileCard } from "@/components/home/profile-card"
import { SummaryCard } from "@/components/home/summary-card"
import { TechCard } from "@/components/home/tech-card"
import { ProjectCard } from "@/components/home/project-card"
import { fetchProjects } from "@/services/project"
import { ContactCard } from "@/components/home/contact-card"
import { Ripple } from "@/components/ui/ripple"
import { TextAnimate } from "@/components/magicui/text-animate"
import { WordRotate } from "@/components/ui/word-rotate"

const profileData = {
  name: 'Muhammad Rizky Safdila',
  jobTitle: 'Software Engineer',
  available: true,
  verified: true,
  photo: 'https://res.cloudinary.com/dcf1a75tn/image/upload/v1768315771/profile_images/rizky2_ibdauq.jpg',
}

export default async function Home() {
  const { projects } = await fetchProjects({ is_featured: true })

  return (
    <div className="my-16 md:my-5 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 md:max-w-sm md:mx-auto">
          <ProfileCard data={profileData} />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <SummaryCard />
          <TechCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ProjectCard projects={projects as any} />
        </div>
        <div className="lg:col-span-1 bg-white dark:bg-gray-950 h-full rounded-xl overflow-hidden relative flex justify-center items-center">
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
