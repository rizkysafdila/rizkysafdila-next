"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { TimelineEntry } from "@/components/career/timeline-entry"
import type { CareerEntry } from "@/types/career.type"

interface CareerTimelineProps {
  entries: CareerEntry[]
}

/** Vertical offset of a dot's centre from the top of its entry (mt-1 + half of h-2.5) */
const DOT_CENTER = 9

export function CareerTimeline({ entries }: CareerTimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [railHeight, setRailHeight] = useState(0)

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] })
  const progress = useMotionValue(0)

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.set(reduceMotion ? 1 : v)
  })
  useEffect(() => {
    progress.set(reduceMotion ? 1 : scrollYProgress.get())
  }, [reduceMotion, progress, scrollYProgress])

  // Rail runs from the first dot to the last dot; entries expand/collapse, so measure.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const items = el.querySelectorAll<HTMLElement>("[data-timeline-item]")
      const last = items[items.length - 1]
      setRailHeight(last ? last.offsetTop : 0)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [entries.length])

  return (
    <div ref={ref} className="relative flex flex-col">
      {/* Scroll-drawn progress line over the grey rail (rail x: 5px mobile, 154px sm+) */}
      <motion.div
        aria-hidden="true"
        data-timeline-progress
        className="pointer-events-none absolute left-[4px] z-[5] w-px origin-top bg-lime-500 sm:left-[153px]"
        style={{ top: DOT_CENTER, height: railHeight, scaleY: progress }}
      />
      {entries.map((entry, index) => (
        <div key={entry.id} data-timeline-item>
          <BlurFade delay={0.15 * (index + 1)} direction="up" inView>
            <TimelineEntry entry={entry} isFirst={index === 0} isLast={index === entries.length - 1} />
          </BlurFade>
        </div>
      ))}
    </div>
  )
}
