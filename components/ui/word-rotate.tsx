"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

interface WordConfig {
  text: string
  color?: string
}

interface WordRotateProps {
  words: (string | WordConfig)[]
  duration?: number
  motionProps?: MotionProps
  className?: string
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0)

  const normalizedWords: WordConfig[] = words.map((w) =>
    typeof w === "string" ? { text: w } : w
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % normalizedWords.length)
    }, duration)

    return () => clearInterval(interval)
  }, [normalizedWords.length, duration])

  const current = normalizedWords[index]

  return (
    <div className="overflow-hidden py-2">
      <AnimatePresence mode="wait">
        <motion.h1
          key={current.text}
          className={cn(className)}
          style={current.color ? { color: current.color } : undefined}
          {...motionProps}
        >
          {current.text}
        </motion.h1>
      </AnimatePresence>
    </div>
  )
}