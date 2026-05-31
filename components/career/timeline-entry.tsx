"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { formatPeriod } from "@/lib/utils"
import type { CareerEntry } from "@/types/career.type"

interface TimelineEntryProps {
  entry: CareerEntry
  isFirst?: boolean
  isLast?: boolean
}

// Sub-components
function CurrentBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-green-600 dark:text-green-400">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-green-400" />
      Current
    </span>
  )
}

function TechTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-[10px] tracking-wide text-muted-foreground transition-colors duration-200 hover:border-foreground/20 hover:text-foreground/80">
      {name}
    </span>
  )
}

// Dot + vertical line
function TimelineDot({
  active,
  onClick,
}: {
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={active ? "Collapse entry" : "Expand entry"}
      className={cn(
        "relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] outline-none transition-all duration-300",
        "focus-visible:ring-2 focus-visible:ring-lime-500/40",
        active
          ? "border-lime-500 bg-lime-500 shadow-[0_0_0_4px_rgba(165,229,71,0.12)]"
          : "border-border bg-transparent hover:border-lime-500/50"
      )}
    />
  )
}

// Format a date string into "Mon YYYY".
function formatMonthYear(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

// Main component
export function TimelineEntry({
  entry,
  isFirst = false,
  isLast = false,
}: TimelineEntryProps) {
  const [expanded, setExpanded] = useState(isFirst)
  const toggle = () => setExpanded((v) => !v)

  const start = entry.start_date
  const periodDisplay = start
    ? `${formatMonthYear(start)} — ${entry.end_date ? formatMonthYear(entry.end_date) : "Present"}`
    : ""
  const duration = start ? formatPeriod(start, entry.end_date).duration : ""
  const year = start ? String(new Date(start).getFullYear()) : ""
  const technologies = entry.technologies ?? []

  return (
    /**
     * Layout on mobile:  [dot | content]            (no year column)
     * Layout on desktop: [year col | dot | content]
     *
     * The year is hidden on mobile and rendered inline inside the header instead.
     */
    <div className="relative flex gap-4 sm:gap-0">

      {/* ── Desktop year column (hidden on mobile) ── */}
      <div className="hidden w-36 shrink-0 sm:flex sm:flex-col sm:items-end sm:pr-8 sm:pt-1">
        <span
          className={cn(
            "font-mono text-[11px] uppercase tracking-widest",
            entry.current ? "text-lime-600 dark:text-lime-400" : "text-muted-foreground/60"
          )}
        >
          {year}
        </span>
        <span className="mt-0.5 font-mono text-[10px] text-muted-foreground/50">
          {duration}
        </span>
      </div>

      {/* ── Dot + vertical line ── */}
      <div className="relative flex flex-col items-center sm:w-5">
        {/* Line above dot */}
        {!isFirst && (
          <div className="absolute bottom-[calc(100%-4px)] top-0 w-px -translate-x-px bg-border" />
        )}
        <TimelineDot active={expanded || !!entry.current} onClick={toggle} />
        {/* Line below dot */}
        {!isLast && (
          <div className="absolute bottom-0 top-[calc(0%+14px)] w-px -translate-x-px bg-border" />
        )}
      </div>

      {/* ── Content ── */}
      <div
        className={cn("w-full min-w-0 cursor-pointer pb-10 pl-4 sm:pl-8", isLast && "pb-0")}
        onClick={toggle}
      >
        {/* Header row */}
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">

          {/* Left: company + role */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={cn(
                  "text-base font-bold tracking-tight transition-colors duration-300",
                  expanded || entry.current ? "text-lime-600 dark:text-lime-400" : "text-foreground"
                )}
              >
                {entry.company}
              </h3>
              {entry.current && <CurrentBadge />}
            </div>
            <p className="mt-0.5 text-sm font-medium text-muted-foreground">
              {entry.role}
            </p>
          </div>

          {/* Right: period (desktop shows full, mobile shows inline below role) */}
          <div className="shrink-0">
            {/* Mobile: year badge inline */}
            <div className="flex items-center gap-2 sm:hidden">
              <span
                className={cn(
                  "font-mono text-[10px] uppercase tracking-widest",
                  entry.current ? "text-lime-600 dark:text-lime-400" : "text-muted-foreground/70"
                )}
              >
                {year}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/60">
                · {duration}
              </span>
            </div>
            {/* Desktop: full period string */}
            <p className="hidden font-mono text-[10px] text-muted-foreground/70 sm:block">
              {periodDisplay}
            </p>
            <p className="mt-0.5 hidden font-mono text-[10px] capitalize text-muted-foreground/60 sm:block">
              {entry.type} · {entry.location}
            </p>
          </div>
        </div>

        {/* Mobile period detail (type + location) */}
        <p className="mt-0.5 font-mono text-[10px] capitalize text-muted-foreground/60 sm:hidden">
          {entry.type} · {entry.location}
        </p>

        {/* ── Expandable body ── */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            expanded
              ? "mt-4 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-xs leading-relaxed text-muted-foreground sm:max-w-xl">
                {entry.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech) => (
                  <TechTag key={tech} name={tech} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Collapsed tech preview ── */}
        {!expanded && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {technologies.slice(0, 3).map((tech) => (
              <TechTag key={tech} name={tech} />
            ))}
            {technologies.length > 3 && (
              <span className="self-center font-mono text-[10px] text-muted-foreground/60">
                +{technologies.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
