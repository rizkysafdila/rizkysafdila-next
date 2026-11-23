"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"

import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Dock, DockIcon } from "@/components/magicui/dock"
import { usePathname } from "next/navigation"
import { DATA } from "@/constants/menu"
import { Logo } from "./logo"
import { CommandIcon } from "lucide-react"
import { useActiveSection } from "@/hooks/use-active-section"
import { OPEN_COMMAND_MENU_EVENT } from "@/components/command-menu"

const SECTION_IDS = DATA.navbar.filter((i) => i.href.startsWith("/#")).map((i) => i.href.slice(2))

export function Navbar() {
  const pathname = usePathname()
  const activeSection = useActiveSection(pathname === "/" ? SECTION_IDS : [])
  const [isMounted, setIsMounted] = useState(false)

  const isActive = (href: string) =>
    href.startsWith("/#")
      ? pathname === "/" && href === `/#${activeSection ?? "home"}`
      : pathname.startsWith(href)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null
  return (
    <TooltipProvider>
      <nav aria-label="Main" data-dock className="pointer-events-none fixed inset-x-0 top-0 z-30 mx-auto mb-4 flex origin-top h-full max-h-14">
        <div className="fixed top-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-background"></div>
        <Dock direction="middle" className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-2 md:px-4 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
          <Logo className="hidden md:block" />
          <Separator orientation="vertical" className="h-full hidden md:block" />
          {DATA.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    aria-current={isActive(item.href) ? (item.href.startsWith("/#") ? "location" : "page") : undefined}
                    className={cn(
                      buttonVariants({ variant: isActive(item.href) ? "secondary" : "ghost", size: "icon" }),
                      "size-10 rounded-xl md:size-11",
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full py-2" />
          <DockIcon className="hidden sm:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Open command menu"
                  onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT))}
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-10 rounded-xl md:size-11")}
                >
                  <CommandIcon className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Command menu (⌘K)</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <ThemeToggle />
              </TooltipTrigger>
              <TooltipContent>
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </nav>
    </TooltipProvider>
  )
}
