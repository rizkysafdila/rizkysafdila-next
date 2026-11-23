"use client"

import { useEffect, useState } from "react"
import { ReactLenis, useLenis } from "lenis/react"

/**
 * Re-applies a URL hash (`/#career`) after hydration. The browser jumps to the
 * anchor on load, but client-only tiles mount afterwards and push sections down,
 * so we scroll again once layout has settled.
 */
function HashScroll() {
  const lenis = useLenis()

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return

    const scroll = () => {
      const target = document.getElementById(id)
      if (!target) return
      if (lenis) {
        // Lenis caches page height; refresh it so the scroll isn't clamped short
        lenis.resize()
        // Lenis honours the section's CSS `scroll-margin-top` (scroll-mt-24), like native
        lenis.scrollTo(target, { immediate: true, force: true })
      }
      else target.scrollIntoView()
    }

    const timers = [150, 800].map((ms) => window.setTimeout(scroll, ms))
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [lenis])

  return null
}

/**
 * Site-wide smooth scrolling (Lenis). Disabled under `prefers-reduced-motion`.
 * Anchor links (`/#work`) are handled by Lenis; sections carry `scroll-mt-24`
 * so headings land below the fixed dock (Lenis reads CSS scroll-margin).
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

  // Lenis is mounted as a sibling (root mode → global instance) so toggling it
  // never changes the tree around `children` (which would remount the page).
  return (
    <>
      {enabled && <ReactLenis root options={{ lerp: 0.1, anchors: true }} />}
      <HashScroll />
      {children}
    </>
  )
}
