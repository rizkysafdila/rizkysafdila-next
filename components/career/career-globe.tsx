"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import createGlobe from "cobe"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { LOCATION_COORDS } from "@/constants/locations"
import type { CareerEntry } from "@/types/career.type"

interface CareerGlobeProps {
  entries: CareerEntry[]
  className?: string
}

interface Place {
  name: string
  coords: [number, number]
  companies: string[]
  current: boolean
}

const LIME: [number, number, number] = [0.486, 0.812, 0]

/** cobe angles that put [lat, lng] in the middle of the globe */
function locationToAngles([lat, lng]: [number, number]): [number, number] {
  return [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180]
}

function shortCompany(company: string | null) {
  // "Cerebrum.id (PT Cerebrum Edukanesia Nusantara)" -> "Cerebrum.id"
  return (company ?? "").replace(/\s*\(.*\)\s*$/, "")
}

export function CareerGlobe({ entries, className }: CareerGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef<{ x: number; offset: number } | null>(null)
  const dragOffset = useRef(0)
  const { resolvedTheme } = useTheme()
  const [ready, setReady] = useState(false)

  const places = useMemo<Place[]>(() => {
    const map = new Map<string, Place>()
    for (const entry of entries) {
      const name = entry.location ?? ""
      const coords = LOCATION_COORDS[name]
      if (!coords) continue
      const place = map.get(name) ?? { name, coords, companies: [], current: false }
      const company = shortCompany(entry.company)
      if (company && !place.companies.includes(company)) place.companies.push(company)
      place.current ||= !!entry.current
      map.set(name, place)
    }
    return [...map.values()]
  }, [entries])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || places.length === 0) return

    const dark = resolvedTheme === "dark"
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Center on the average of all places
    const avg: [number, number] = [
      places.reduce((s, p) => s + p.coords[0], 0) / places.length,
      places.reduce((s, p) => s + p.coords[1], 0) / places.length,
    ]
    const [focusPhi, focusTheta] = locationToAngles(avg)

    let width = canvas.offsetWidth
    const onResize = () => {
      width = canvas.offsetWidth
    }
    window.addEventListener("resize", onResize)

    let t = 0
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: focusPhi,
      theta: focusTheta + 0.25,
      dark: dark ? 1 : 0,
      diffuse: dark ? 1.4 : 1.2,
      mapSamples: 24000,
      mapBrightness: dark ? 5 : 6,
      mapBaseBrightness: dark ? 0.02 : 0,
      baseColor: dark ? [0.3, 0.3, 0.3] : [1, 1, 1],
      markerColor: LIME,
      glowColor: dark ? [0.16, 0.2, 0.1] : [0.93, 0.96, 0.88],
      scale: 1.05,
      markers: places.map((p) => ({
        location: p.coords,
        size: p.current ? 0.09 : 0.06,
        color: p.current ? LIME : [0.169, 0.498, 1],
      })),
      onRender: (state) => {
        if (!reduceMotion) t += 0.008
        // Spring back to focus after a drag
        if (!pointer.current) dragOffset.current *= 0.94
        state.phi = focusPhi + Math.sin(t) * 0.35 + dragOffset.current
        state.theta = focusTheta + 0.25
        state.width = width * dpr
        state.height = width * dpr
      },
    })

    const showTimer = setTimeout(() => setReady(true), 50)

    // Don't render while scrolled out of view
    const observer = new IntersectionObserver(([entry]) => {
      globe.toggle(entry.isIntersecting)
    })
    observer.observe(canvas)

    return () => {
      clearTimeout(showTimer)
      observer.disconnect()
      window.removeEventListener("resize", onResize)
      globe.destroy()
    }
  }, [places, resolvedTheme])

  if (places.length === 0) return null

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative aspect-square w-full">
        <canvas
          ref={canvasRef}
          aria-label="Globe showing the cities I've worked in"
          role="img"
          className={cn(
            "size-full cursor-grab touch-pan-y transition-opacity duration-1000 active:cursor-grabbing",
            ready ? "opacity-100" : "opacity-0",
          )}
          onPointerDown={(e) => {
            pointer.current = { x: e.clientX, offset: dragOffset.current }
            e.currentTarget.setPointerCapture(e.pointerId)
          }}
          onPointerMove={(e) => {
            if (!pointer.current) return
            dragOffset.current = pointer.current.offset + (e.clientX - pointer.current.x) / 120
          }}
          onPointerUp={() => {
            pointer.current = null
          }}
          onPointerCancel={() => {
            pointer.current = null
          }}
        />
      </div>

      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {places.map((place) => (
          <li key={place.name} className="flex items-center gap-1.5">
            <span
              className={cn(
                "size-1.5 rounded-full",
                place.current ? "bg-lime-500 shadow-[0_0_6px] shadow-lime-500" : "bg-blue-500",
              )}
            />
            <span className="text-foreground/80">{place.name.split(",")[0]}</span>
            <span className="normal-case tracking-normal">· {place.companies.join(", ")}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
