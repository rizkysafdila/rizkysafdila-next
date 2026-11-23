"use client"

import { useEffect, useState } from "react"

interface LocalTimeProps {
  timeZone?: string
  className?: string
}

/** Live HH:mm clock for a time zone. Renders `--:--` until mounted (no hydration mismatch). */
export function LocalTime({ timeZone = "Asia/Jakarta", className }: LocalTimeProps) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    })
    const tick = () => setTime(format.format(new Date()))
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [timeZone])

  return (
    <time className={className} suppressHydrationWarning>
      {time ?? "--:--"} WIB
    </time>
  )
}
