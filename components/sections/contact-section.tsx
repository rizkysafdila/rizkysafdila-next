"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"
import { Section } from "@/components/sections/section"
import { DATA } from "@/constants/menu"
import { cn } from "@/lib/utils"

const EMAIL = "rizkysafdila@gmail.com"

export function ContactSection({ isAvailable }: { isAvailable: boolean }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (permissions / insecure context) → fall back to the mail client
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <Section
      id="contact"
      index="04"
      label="Contact"
      title={
        <span className="block text-5xl sm:text-6xl md:text-8xl">
          Let&apos;s build <span className="text-lime-600 dark:text-lime-400">something.</span>
        </span>
      }
      className="pb-32"
    >
      <div className="flex flex-col gap-8">
        <p className="max-w-xl text-lg text-muted-foreground">
          Have a project, a role, or just want to say hi? My inbox is always open.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            data-copy-email
            onClick={copyEmail}
            aria-live="polite"
            className="inline-flex items-center gap-3 rounded-full bg-lime-500 px-6 py-3 font-mono text-sm font-semibold text-neutral-950 transition-colors hover:bg-lime-400"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : EMAIL}
          </button>

          {Object.entries(DATA.contact.social).map(([key, social]) => (
            <a
              key={key}
              href={social.url}
              target={social.url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={social.name}
              className="flex size-12 items-center justify-center rounded-full border bg-background/60 backdrop-blur transition-colors hover:bg-accent"
            >
              <social.icon className="size-5" />
            </a>
          ))}
        </div>

        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span className={cn("size-2 rounded-full", isAvailable ? "bg-lime-500" : "bg-neutral-400")} />
          {isAvailable ? "Available for new projects" : "Not available at the moment"}
        </p>
      </div>
    </Section>
  )
}
