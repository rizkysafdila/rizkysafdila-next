import type { CareerEntry } from "@/types/career.type"

export interface CareerStatsSummary {
  /** Whole years since the earliest start date (floor, min 0) */
  years: number
  /** Distinct non-empty company names */
  companies: number
  /** First entry flagged `current`, if any */
  current: CareerEntry | null
}

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000

export function getCareerStats(entries: CareerEntry[], now: Date = new Date()): CareerStatsSummary {
  const starts = entries
    .map((e) => (e.start_date ? new Date(e.start_date).getTime() : NaN))
    .filter((t) => !Number.isNaN(t))

  const earliest = starts.length ? Math.min(...starts) : null
  const years = earliest === null ? 0 : Math.max(0, Math.floor((now.getTime() - earliest) / MS_PER_YEAR))

  const companies = new Set(entries.map((e) => e.company?.trim()).filter(Boolean)).size
  const current = entries.find((e) => e.current) ?? null

  return { years, companies, current }
}
