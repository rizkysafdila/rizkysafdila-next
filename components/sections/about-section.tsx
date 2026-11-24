import { Section } from "@/components/sections/section"
import { BaseCard } from "@/components/base-card"
import { ProfileCard } from "@/components/home/profile-card"
import { SummaryCard } from "@/components/home/summary-card"
import { TechCard } from "@/components/home/tech-card"
import { NumberTicker } from "@/components/ui/number-ticker"
import { LocalTime } from "@/components/local-time"
import { getCareerStats } from "@/lib/career-stats"
import { shortCompany } from "@/lib/utils"
import type { IProfile } from "@/types/profile.type"
import type { CareerEntry } from "@/types/career.type"

const LABEL = "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"

interface AboutSectionProps {
  profile: IProfile | null
  entries: CareerEntry[]
  projectCount: number
}

export function AboutSection({ profile, entries, projectCount }: AboutSectionProps) {
  const { years, companies, current } = getCareerStats(entries)

  const stats = [
    { value: years, suffix: "+", label: "Years experience" },
    { value: projectCount, suffix: "", label: "Essential projects" },
    { value: companies, suffix: "", label: "Companies" },
  ]

  return (
    <Section id="about" index="01" label="About" title="About me">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profile && (
          <div className="md:row-span-2">
            <ProfileCard data={profile} />
          </div>
        )}

        <div className="lg:col-span-2">
          <SummaryCard />
        </div>

        <BaseCard className="h-full">
          <h3 className={LABEL}>By the numbers</h3>
          <dl className="mt-4 grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-syne text-4xl font-bold tracking-tight">
                  {stat.value > 0 ? <NumberTicker value={stat.value} /> : 0}
                  {stat.value > 0 && stat.suffix}
                </dd>
                <p aria-hidden="true" className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </dl>
        </BaseCard>

        <BaseCard className="h-full">
          <h3 className={LABEL}>Currently</h3>
          <p className="mt-4 text-lg font-semibold leading-snug">
            {current ? (
              <>
                {current.role} <span className="text-muted-foreground">at</span>{" "}
                <span className="text-lime-600 dark:text-lime-400">{shortCompany(current.company)}</span>
              </>
            ) : (
              "Open to new opportunities"
            )}
          </p>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Jakarta, ID · <LocalTime />
          </p>
        </BaseCard>

        <div className="md:col-span-2 lg:col-span-3">
          <TechCard />
        </div>
      </div>
    </Section>
  )
}
