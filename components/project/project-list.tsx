import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Pin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { TProject } from '@/types/project.type'
import { cn } from '@/lib/utils'
import { SkillIcon } from '../skill'
import { TiltCard } from '@/components/immersive/tilt-card'

type ProjectCardProps = {
  data: TProject
  /** "large" = taller thumbnail + bigger title (home "Selected work") */
  size?: "default" | "large"
}

export function ProjectList({ data, size = "default", className }: ProjectCardProps & React.ComponentProps<"div">) {
  const large = size === "large"

  return (
    <Link href={`/projects/${data.id}`} className={cn("group block", className)}>
      <TiltCard className="h-full">
        <Card className="relative h-full p-0 shadow-none transform-3d">
          <CardContent className='p-0 transform-3d'>
            {data?.is_featured && (
              <Badge
                variant="secondary"
                className="absolute z-20 top-3 right-3 rounded-full bg-lime-500 dark:bg-lime-600 shadow-md translate-z-12"
              >
                <Pin className="size-4 mr-1" />
                Featured
              </Badge>
            )}

            <div className="relative translate-z-4">
              <Image
                src={data?.thumbnail_url}
                alt="Project thumbnail"
                width={800}
                height={160}
                className={cn("rounded-t-xl w-full object-cover", large ? "h-64" : "h-40")}
              />
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-t-xl">
                <Button
                  variant="link"
                  className="text-white pointer-events-none"
                >
                  View Project
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 translate-z-8">
              <h3 className={cn("font-semibold line-clamp-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors mb-2", large && "font-syne text-xl md:text-2xl")}>
                {data?.title}
              </h3>
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
      </TiltCard>
    </Link>
  )
}
