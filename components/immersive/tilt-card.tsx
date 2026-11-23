"use client"

import { useRef } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import { cn } from "@/lib/utils"

interface TiltCardProps extends React.ComponentProps<"div"> {
  /** Max rotation in degrees on each axis */
  maxTilt?: number
  /** Show the cursor-following glare highlight */
  glare?: boolean
}

/**
 * 3D tilt wrapper. Children can pop out of the card plane with
 * `translate-z-*` utilities — every element between this wrapper and the
 * popped-out child needs `transform-3d` so depth isn't flattened.
 *
 * Mouse only: touch devices and `prefers-reduced-motion` get a flat card.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 8,
  glare = true,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // Pointer position within the card, 0..1
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hover = useMotionValue(0)

  const spring = { stiffness: 200, damping: 20, mass: 0.5 }
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), spring)
  const glareOpacity = useSpring(hover, spring)

  const glareX = useTransform(px, (v) => `${v * 100}%`)
  const glareY = useTransform(py, (v) => `${v * 100}%`)
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.22), transparent 55%)`

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse" || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
    hover.set(1)
  }

  const onPointerLeave = () => {
    px.set(0.5)
    py.set(0.5)
    hover.set(0)
  }

  return (
    <div
      ref={ref}
      className={cn("perspective-[1000px]", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...props}
    >
      <motion.div
        className="relative h-full transform-3d"
        style={reduceMotion ? undefined : { rotateX, rotateY }}
      >
        {children}
        {glare && !reduceMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 rounded-xl mix-blend-overlay translate-z-[1px]"
            style={{ background: glareBg, opacity: glareOpacity }}
          />
        )}
      </motion.div>
    </div>
  )
}
