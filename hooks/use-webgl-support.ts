"use client"

import { useEffect, useState } from "react"

/**
 * `null` until mounted, then whether a WebGL context can actually be created.
 * `require2: true` demands WebGL2 — three.js (r163+, used by the hero) has no
 * WebGL1 renderer, while cobe (globe) and the shader background run on WebGL1.
 * The probe context is released immediately.
 */
export function useWebGLSupport({ require2 = false }: { require2?: boolean } = {}): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = (canvas.getContext("webgl2") ??
        (require2 ? null : canvas.getContext("webgl"))) as WebGLRenderingContext | null
      setSupported(!!gl)
      gl?.getExtension("WEBGL_lose_context")?.loseContext()
    } catch {
      setSupported(false)
    }
  }, [require2])

  return supported
}
