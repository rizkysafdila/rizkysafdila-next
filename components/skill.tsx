"use client"

import { SKILL_ICON_MAP } from "@/constants/skill"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface ISkillBadgeProps {
  skill: string
  size?: number
}

function SkillBadge({ skill, size = 20 }: ISkillBadgeProps) {
  const iconName = SKILL_ICON_MAP[skill] || "mdi:circle-outline"

  return (
    <div className={
      cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md border",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10]",
      )}
    >
      <Icon icon={iconName} fontSize={size} />
      <p className="text-sm">{skill}</p>
    </div>
  )
}

function SkillIcon({ skill, size = 20 }: ISkillBadgeProps) {
  const iconName = SKILL_ICON_MAP[skill] || "mdi:circle-outline"

  return (
    <Tooltip> 
      <TooltipTrigger asChild>
        <Icon icon={iconName} fontSize={size} />
      </TooltipTrigger>
      <TooltipContent className='rounded'>
        <p>{skill}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export {
  SkillIcon,
  SkillBadge,
}