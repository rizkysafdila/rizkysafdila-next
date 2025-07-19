"use client"

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { MagicCard } from "@/components/magicui/magic-card"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { VerifiedIcon } from "lucide-react"
import { BlurFade } from "@/components/magicui/blur-fade"

interface IProfileCard {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export function ProfileCard({ data, className }: IProfileCard & React.ComponentProps<"div">) {
  const { theme } = useTheme()

  return (
    <Card className={cn(
      "p-0 max-w-sm w-full shadow-none border-none",
      className
    )}>
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        gradientFrom="#7ccf00"
        gradientTo="#2b7fff"
        className="p-0"
      >
        <CardContent className="p-0">
          <BlurFade delay={0.25} inView>
            <div
              className="gap-2 absolute top-3 inset-x-0 w-fit mx-auto flex items-center px-2 py-1 text-xs text-white hover:text-gray-100 rounded-full bg-gray-400/10 bg-clip-padding backdrop-blur-sm hover:no-underline"
            >
              <span className="relative flex size-2">
                <span
                  className={cn(
                    "absolute inline-flex size-full rounded-full opacity-75",
                    data?.available ? 'bg-green-500 animate-ping' : 'bg-red-500'
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex size-2 scale-90 rounded-full",
                    data?.available ? "bg-green-500" : "bg-red-500"
                  )}
                />
              </span>
              {data?.available ? "Available for new projects" : "Not available at the moment"}
            </div>

            <Image src={data?.photo}
              className="rounded-t-xl w-full max-h-96 object-cover"
              alt="My Profile Photo"
              width={500}
              height={500}
            />
          </BlurFade>
        </CardContent>
        <CardFooter className="p-4 block">
          <BlurFade delay={0.5} inView>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">
                {data?.name}
              </h1>
              {data?.verified && <VerifiedIcon className="size-5 text-blue-500" />}
            </div>
          </BlurFade>
          <BlurFade delay={0.75} inView>
            <p className="text-sm">
              {data?.jobTitle}
            </p>
          </BlurFade>
        </CardFooter>
      </MagicCard>
    </Card>
  )
}
