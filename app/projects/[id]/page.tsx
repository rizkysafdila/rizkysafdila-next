import * as React from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Code2, Pin } from "lucide-react"
import { fetchProjectById } from "@/services/project"
import { IProjectDetail, IProjectImage } from "@/types/project.type"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RichText } from "@/components/rich-text"
import { SkillBadge } from "@/components/skill"
import { BlurFade } from "@/components/magicui/blur-fade"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function formatMonthYear(date: string | null | undefined): string {
  if (!date) return ""
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ""
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(parsed)
}

function getPeriod(start?: string, end?: string): string {
  const from = formatMonthYear(start)
  const to = end ? formatMonthYear(end) : "Present"
  if (!from) return ""
  return `${from} – ${to}`
}

function getImageUrls(project: IProjectDetail): string[] {
  const images = project.project_images ?? []
  const urls = images
    .map((image) => (typeof image === "string" ? image : (image as IProjectImage).image_url))
    .filter(Boolean)
  return urls.length > 0 ? urls : [project.thumbnail_url].filter(Boolean)
}

function ProjectGallery({ images }: { images: string[] }) {
  return (
    <Carousel className="w-full" opts={{ loop: images.length > 1 }}>
      <CarouselContent>
        {images.map((src, i) => (
          <CarouselItem key={i}>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={src}
                alt={`Project image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}
    </Carousel>
  )
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { project, error } = await fetchProjectById(id)

  if (error || !project) notFound()

  const images = getImageUrls(project)
  const period = getPeriod(project.start_date, project.end_date)

  return (
    <div className="my-16 md:my-5">
      <BlurFade delay={0.2} inView>
        <Button asChild variant="ghost" className="mb-6 -ml-2 gap-1.5">
          <Link href="/projects">
            <ArrowLeft className="size-4" />
            Back to Projects
          </Link>
        </Button>
      </BlurFade>

      <BlurFade delay={0.3} inView>
        <ProjectGallery images={images} />
      </BlurFade>

      <BlurFade delay={0.4} inView>
        <div className="mt-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-semibold leading-snug">{project.title}</h1>
            {project.is_featured && (
              <Badge
                variant="secondary"
                className="shrink-0 rounded-full bg-lime-500 dark:bg-lime-600"
              >
                <Pin className="mr-1 size-3.5" />
                Featured
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground">
            {project.subtitle}
            {period && <> · {period}</>}
          </p>

          <RichText
            html={project.description}
            className="text-sm leading-relaxed text-muted-foreground"
          />

          {project.tech_stacks?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {project.tech_stacks.map((stack, i) => (
                <SkillBadge key={i} skill={stack} size={18} />
              ))}
            </div>
          )}

          {(project.demo_url || project.source_code) && (
            <div className="flex flex-wrap gap-3 pt-1">
              {project.demo_url && (
                <Button asChild>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    Live Demo
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              )}
              {project.source_code && (
                <Button asChild variant="outline">
                  <a href={project.source_code} target="_blank" rel="noopener noreferrer">
                    <Code2 className="size-4" />
                    Source Code
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </BlurFade>
    </div>
  )
}
