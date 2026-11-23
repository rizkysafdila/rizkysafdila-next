"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWebGLSupport } from "@/hooks/use-webgl-support"
import { LocalTime } from "@/components/local-time"
import type { IProfile } from "@/types/profile.type"

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false })

const TAGLINE = "Software engineer building reliable products for the web."

type Mode = "pending" | "3d" | "fallback"

export function Hero({ profile }: { profile: IProfile | null }) {
  const sectionRef = useRef<HTMLElement>(null)
  const webgl = useWebGLSupport()
  const { resolvedTheme } = useTheme()
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null)
  const [inView, setInView] = useState(true)
  const [sceneReady, setSceneReady] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduceMotion(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const mode: Mode =
    webgl === null || reduceMotion === null ? "pending" : webgl && !reduceMotion ? "3d" : "fallback"

  const name = profile?.name ?? "Rizky Safdila"
  const role = profile?.jobTitle ?? "Software Engineer"

  return (
    <section ref={sectionRef} id="home" className="relative h-svh min-h-[560px] overflow-hidden">
      {mode === "3d" && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            sceneReady ? "opacity-100" : "opacity-0",
          )}
        >
          <HeroScene inView={inView} dark={resolvedTheme === "dark"} onReady={() => setSceneReady(true)} />
        </div>
      )}

      {/* Real name for SEO / screen readers; visible giant type when the 3D scene isn't used */}
      <h1
        className={cn(
          mode === "3d"
            ? "sr-only"
            : "pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center font-syne text-[clamp(2.5rem,12vw,12rem)] leading-[0.85] font-extrabold tracking-tighter",
          mode === "pending" && "opacity-0",
        )}
      >
        <span className="sr-only">{name}</span>
        <span aria-hidden="true">RIZKY</span>
        <span aria-hidden="true">SAFDILA</span>
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
