"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { ArrowUpRight, Copy, SunMoon } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { DATA } from "@/constants/menu"

export const OPEN_COMMAND_MENU_EVENT = "open-command-menu"

const EMAIL = "rizkysafdila@gmail.com"

/** Global ⌘K / Ctrl+K palette. Also opens on the `open-command-menu` window event. */
export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener("keydown", onKey)
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, onOpen)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, onOpen)
    }
  }, [])

  const run = (action: () => void) => {
    setOpen(false)
    action()
  }

  const links = Object.values(DATA.contact.social).filter((s) => !s.url.startsWith("mailto:"))

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command menu" description="Navigate or run an action">
      <CommandInput placeholder="Type a command or search…" />
      {/* data-lenis-prevent: let the wheel scroll this list instead of the page (Lenis) */}
      <CommandList data-lenis-prevent>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {DATA.navbar.map((item) => (
            <CommandItem key={item.href} value={`go ${item.label}`} onSelect={() => run(() => router.push(item.href))}>
              <item.icon />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            value="toggle theme dark light"
            onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
          >
            <SunMoon />
            Toggle theme
          </CommandItem>
          <CommandItem value="copy email" onSelect={() => run(() => void navigator.clipboard?.writeText(EMAIL))}>
            <Copy />
            Copy email
            <CommandShortcut>{EMAIL}</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Links">
          {links.map((social) => (
            <CommandItem
              key={social.url}
              value={`open ${social.name}`}
              onSelect={() => run(() => window.open(social.url, "_blank", "noopener,noreferrer"))}
            >
              <social.icon />
              {social.name}
              <ArrowUpRight className="ml-auto opacity-50" />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
