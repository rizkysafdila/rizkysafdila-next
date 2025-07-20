"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"

import { ModeToggle } from "@/components/mode-toggle"
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
import { syne } from "@/fonts"

export function Navbar() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null
  return (
    <TooltipProvider>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 mx-auto mb-4 flex origin-top h-full max-h-14">
        <div className="fixed top-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-background"></div>
        <Dock direction="middle" className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-2 md:px-4 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
          <p className={cn(
            "text-xl font-bold font-syne my-auto tracking-tight hidden md:block",
            syne.className
          )}>
            <span className="text-blue-500">rizky</span>safdila<span className="text-lime-500 font-bold">.</span>
          </p>
          <Separator orientation="vertical" className="h-full hidden md:block" />
          {DATA.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: `${pathname === item.href ? 'secondary' : 'ghost'}`, size: "icon" }),
                      "size-11 rounded-xl",
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
          <Separator orientation="vertical" className="h-full" />
          {Object.entries(DATA.contact.social).map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={social.url}
                    aria-label={social.name}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-11 rounded-xl",
                    )}
                  >
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full py-2" />
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <ModeToggle />
              </TooltipTrigger>
              <TooltipContent>
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </div>
    </TooltipProvider>
  )
}
