"use client"

import { useEffect, useState } from "react"

/**
 * Id of the section currently crossing the middle band of the viewport,
 * or `null` when none of `ids` is on the page.
 *
 * Sections may not exist yet when this runs (client navigation shows
 * `loading.tsx` first, then streams the page in), so a MutationObserver
 * re-attaches the IntersectionObserver whenever the set of found sections changes.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join(",")

  useEffect(() => {
    const wanted = key ? key.split(",") : []
    if (wanted.length === 0) {
      setActive(null)
      return
    }

    let intersection: IntersectionObserver | null = null
    let attachedKey = ""

    const attach = () => {
      const elements = wanted
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el)
      const foundKey = elements.map((el) => el.id).join(",")
      if (foundKey === attachedKey) return
      attachedKey = foundKey

      intersection?.disconnect()
      intersection = null
      if (elements.length === 0) {
        setActive(null)
        return
      }
      intersection = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActive(entry.target.id)
          }
        },
        { rootMargin: "-45% 0px -50% 0px" },
      )
      elements.forEach((el) => intersection!.observe(el))
    }

    attach()
    const mutations = new MutationObserver(attach)
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutations.disconnect()
      intersection?.disconnect()
    }
  }, [key])

  return active
}
