"use client"

import { useEffect, useState } from "react"
import { ReactLenis } from "lenis/react"

/**
 * Site-wide smooth scrolling (Lenis). Disabled under `prefers-reduced-motion`.
 * Anchor links (`/#work`) are handled by Lenis with an offset so section
 * headings land below the fixed dock.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setEnabled(!query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  if (!enabled) return <>{children}</>

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -96 } }}>
      {children}
    </ReactLenis>
  )
}
