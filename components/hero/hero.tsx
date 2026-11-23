import Link from "next/link"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { LocalTime } from "@/components/local-time"
import type { IProfile } from "@/types/profile.type"
import { NAME_BOTTOM_RESERVE, NAME_TOP_RESERVE } from "./constants"

/** Average advance width of a Syne 800 capital, in em (used to size the name) */
const NAME_EM_PER_CHAR = 1.35

const TAGLINE = "Software engineer building reliable products for the web."

export function Hero({ profile }: { profile: IProfile | null }) {
  const name = profile?.name ?? "Muhammad Rizky Safdila"
  const nameLines = name.toUpperCase().split(/\s+/).filter(Boolean)
  // Syne 800 caps average ~1.32em per letter (wide M/W): fit the longest line to ~88vw and
  // the whole block between the top meta row and the bottom tagline block
  const longest = Math.max(...nameLines.map((l) => l.length))
  const nameFontSize = `min(${(88 / (longest * NAME_EM_PER_CHAR)).toFixed(2)}vw, calc((100svh - ${NAME_TOP_RESERVE + NAME_BOTTOM_RESERVE}px) / ${(nameLines.length * 0.9).toFixed(2)}))`
  const role = profile?.jobTitle ?? "Software Engineer"

  return (
    <section id="home" className="relative h-svh min-h-[560px] overflow-hidden">
      {/* Giant name, one word per line, fitted between the top meta row and the bottom block */}
      <h1
        className="pointer-events-none absolute inset-x-0 flex flex-col items-center justify-center text-center font-syne leading-[0.85] font-extrabold tracking-tighter"
        style={{ fontSize: nameFontSize, top: NAME_TOP_RESERVE, bottom: NAME_BOTTOM_RESERVE }}
      >
        <span className="sr-only">{name}</span>
        {nameLines.map((line, i) => (
          <span key={i} aria-hidden="true">
            {line}
          </span>
        ))}
      </h1>

      {/* Top meta row */}
      <div className="absolute inset-x-0 top-24 mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="relative flex size-2">
            {profile?.is_available && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime-500 opacity-75 motion-reduce:animate-none" />
            )}
            <span className={cn("relative inline-flex size-2 rounded-full", profile?.is_available ? "bg-lime-500" : "bg-neutral-400")} />
          </span>
          {profile?.is_available ? "Available for work" : "Not available"}
        </span>
        <span className="flex items-center gap-3">
          <span className="hidden sm:inline">Jakarta, ID</span>
          <LocalTime />
        </span>
      </div>

      {/* Bottom row */}
      <div className="absolute inset-x-0 bottom-10 mx-auto flex max-w-5xl flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-lime-600 dark:text-lime-400">{role}</p>
          <p className="text-xl leading-snug text-balance md:text-2xl">{TAGLINE}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-lime-400"
            >
              Let&apos;s talk
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/60 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-foreground/5"
            >
              View work
            </Link>
          </div>
        </div>
        <Link
          href="/#about"
          aria-label="Scroll to about"
          className="hidden items-center gap-2 self-end font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:flex"
        >
          Scroll
          <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" />
        </Link>
      </div>
    </section>
  )
}
