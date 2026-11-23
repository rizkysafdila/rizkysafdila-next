import { Section } from "@/components/sections/section"
import { BaseCard } from "@/components/base-card"
import { CareerGlobe } from "@/components/career/career-globe"
import { CareerTimeline } from "@/components/career/career-timeline"
import type { CareerEntry } from "@/types/career.type"

export function CareerSection({ entries }: { entries: CareerEntry[] }) {
  return (
    <Section id="career" index="03" label="Career" title="Where I've worked">
      {entries.length === 0 ? (
        <p className="text-muted-foreground">Career history coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="mx-auto w-full max-w-72 lg:sticky lg:top-28">
            <BaseCard>
              <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Journey
              </h3>
              <CareerGlobe entries={entries} />
            </BaseCard>
          </div>
          <div className="rounded-xl border bg-card/80 p-6 backdrop-blur-sm">
            <CareerTimeline entries={entries} />
          </div>
        </div>
      )}
    </Section>
  )
}
