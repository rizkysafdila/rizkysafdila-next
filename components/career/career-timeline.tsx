import { BlurFade } from "@/components/magicui/blur-fade"
import { TimelineEntry } from "@/components/career/timeline-entry"
import type { CareerEntry } from "@/types/career.type"

interface CareerTimelineProps {
  entries: CareerEntry[]
}

export function CareerTimeline({ entries }: CareerTimelineProps) {
  return (
    /**
     * On desktop the year column is rendered inside each TimelineEntry.
     * This wrapper just provides the left offset so the timeline
     * aligns with the rest of the page content.
     */
    <div className="flex flex-col">
      {entries.map((entry, index) => (
        <BlurFade key={entry.id} delay={0.5 * (index + 1)} direction="up" inView>
          <TimelineEntry
            entry={entry}
            isFirst={index === 0}
            isLast={index === entries.length - 1}
          />
        </BlurFade>
      ))}
    </div>
  )
}
