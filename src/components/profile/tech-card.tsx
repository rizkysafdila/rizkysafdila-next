"use client"

import { CardContent, CardHeader } from "@/components/ui/card"
import { Marquee } from "@/components/magicui/marquee"
import { SkillBadge } from "@/components/skill-badge"
import { BaseCard } from "@/components/base-card"
import { BlurFade } from "@/components/magicui/blur-fade"

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

export function TechCard() {

  return (
    <BaseCard>
      <CardHeader className="px-2 py-0">
        <BlurFade delay={0.5} inView>
          <h2 className="text-lg font-semibold">Technologies</h2>
        </BlurFade>
      </CardHeader>
      <CardContent className="p-2">
        <BlurFade delay={0.75} direction="down" inView>
          <Marquee pauseOnHover className="[--duration:30s]">
            <div className="flex items-center gap-2">
              {skills.map((skill, i) => (
                <SkillBadge key={i} skill={skill} />
              ))}
            </div>
          </Marquee>
        </BlurFade>
        <BlurFade delay={0.75} direction="up" inView>
          <Marquee reverse pauseOnHover className="[--duration:30s]">
            <div className="flex items-center gap-2">
              {skills.map((skill, i) => (
                <SkillBadge key={i} skill={skill} />
              ))}
            </div>
          </Marquee>
        </BlurFade>
      </CardContent>
    </BaseCard>
  )
}