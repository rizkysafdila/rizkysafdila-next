import { ProfileCard } from "@/components/home/profile-card"
import { SummaryCard } from "@/components/home/summary-card"
import { TechCard } from "@/components/home/tech-card"
import { ProjectCard } from "@/components/home/project-card"

const profileData = {
  name: 'Muhammad Rizky Safdila',
  jobTitle: 'Software Engineer',
  available: true,
  verified: true,
  photo: '/images/rizky-alt.png',
}

export default function Home() {
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
          <ProjectCard />
        </div>
        <div className="lg:col-span-1 bg-red-50 h-full rounded-xl">
          Tes
        </div>
      </div>
    </div>
  )
}
