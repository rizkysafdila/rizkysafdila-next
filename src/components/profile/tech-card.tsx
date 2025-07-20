"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MagicCard } from "@/components/magicui/magic-card"
import { useTheme } from "next-themes"
import { Marquee } from "@/components/magicui/marquee"
import { SkillBadge } from "@/components/skill-badge"
import { cn } from "@/lib/utils"

const skills = [
  'Typescript',
  'Javascript',
  'TailwindCSS',
  'Vuejs',
  'Nuxtjs',
  'React',
  'Nextjs',
  // 'Pinia',
  'PHP',
  'Laravel',
  'Nodejs',
  'Adonisjs',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  "Github",
  "Gitlab",
]

export function TechCard({ className }: React.ComponentProps<"div">) {
  const { theme } = useTheme()

  return (
    <Card className={cn(
      "p-0 w-full shadow-none border-none",
      className
    )}>
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        gradientFrom="#7ccf00"
        gradientTo="#2b7fff"
        className="p-4"
      >
        <CardHeader className="px-2 py-0">
          <h2 className="text-lg font-semibold">Technologies</h2>
        </CardHeader>
        <CardContent className="p-2">
          <Marquee pauseOnHover className="[--duration:30s]">
            <div className="flex items-center gap-2">
              {skills.map((skill, i) => (
                <SkillBadge key={i} skill={skill} />
              ))}
            </div>
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:30s]">
            <div className="flex items-center gap-2">
              {skills.map((skill, i) => (
                <SkillBadge key={i} skill={skill} />
              ))}
            </div>
          </Marquee>
        </CardContent>
      </MagicCard>
    </Card>
  )
}