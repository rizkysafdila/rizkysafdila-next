'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Pin } from 'lucide-react'
import Image from 'next/image'
import { TProject } from '@/types/project.type'
import { cn } from '@/lib/utils'
import { SkillIcon } from '../skill'

type ProjectCardProps = {
  data: TProject
  onView?: () => void
}

export function ProjectList({ data, onView, className }: ProjectCardProps & React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "group cursor-pointer relative p-0 shadow-none hover:scale-102 transition duration-200",
        className,
      )}
      onClick={onView}
    >
      <CardContent className='p-0'>
        {data?.is_featured && (
          <Badge
            variant="secondary"
            className="absolute z-20 top-3 right-3 rounded-full bg-lime-500 dark:bg-lime-600"
          >
            <Pin className="size-4 mr-1" />
            Featured
          </Badge>
        )}

        <div className="relative">
          <Image
            src={data?.thumbnail_url}
            alt="Project thumbnail"
            width={800}
            height={160}
            className="rounded-t-xl w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-t-xl">
            <Button
              variant="link"
              className="text-white pointer-events-none"
            >
              View Project
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h1 className="font-semibold line-clamp-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors mb-2">
            {data?.title}
          </h1>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {data?.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            {data?.tech_stacks.map((stack, i) => (
              <SkillIcon key={i} skill={stack} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
