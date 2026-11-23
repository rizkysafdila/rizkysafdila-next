import { Hero } from "@/components/hero/hero"
import { AboutSection } from "@/components/sections/about-section"
import { WorkSection } from "@/components/sections/work-section"
import { CareerSection } from "@/components/sections/career-section"
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
  const featuredProjects = allProjects.filter((p) => p.is_featured)
  const careerEntries = entries ?? []

  return (
    <>
      <Hero profile={profile ?? null} />
      <AboutSection profile={profile ?? null} entries={careerEntries} projectCount={allProjects.length} />
      <WorkSection projects={featuredProjects} />
      <CareerSection entries={careerEntries} />
    </>
  )
}
