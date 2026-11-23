import { Hero } from "@/components/hero/hero"
import { AboutSection } from "@/components/sections/about-section"
import { fetchProfile } from "@/services/profile"
import { fetchProjects } from "@/services/project"
import { fetchCareers } from "@/services/career"

export default async function Home() {
  const [{ profile }, { projects }, { entries }] = await Promise.all([
    fetchProfile(),
    fetchProjects(),
    fetchCareers(),
  ])

  const allProjects = projects ?? []
  const careerEntries = entries ?? []

  return (
    <>
      <Hero profile={profile ?? null} />
      <AboutSection profile={profile ?? null} entries={careerEntries} projectCount={allProjects.length} />
    </>
  )
}
