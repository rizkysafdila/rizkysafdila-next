"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowUpRight, Code2, Pin, X } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RichText } from "@/components/rich-text"
import { SkillBadge } from "@/components/skill"
import { cn } from "@/lib/utils"
import { IProjectDetail, IProjectImage } from "@/types/project.type"

interface ProjectDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loading: boolean
  error: boolean
  project: IProjectDetail | null
}

/** Render an ISO date string as e.g. "Jan 2024"; empty input yields "". */
function formatMonthYear(date: string | null | undefined): string {
  if (!date) return ""
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ""
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(parsed)
}

function getPeriod(start?: string, end?: string): string {
  const from = formatMonthYear(start)
  const to = end ? formatMonthYear(end) : "Present"
  if (!from) return ""
  return `${from} – ${to}`
}

/** Normalize project_images (objects or strings) to a list of image URLs,
 *  falling back to the thumbnail when there are no gallery images. */
function getImageUrls(project: IProjectDetail): string[] {
  const images = project.project_images ?? []
  const urls = images
    .map((image) =>
      typeof image === "string" ? image : (image as IProjectImage).image_url
    )
    .filter(Boolean)
  return urls.length > 0 ? urls : [project.thumbnail_url].filter(Boolean)
}

function ProjectGallery({ images }: { images: string[] }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <Carousel setApi={setApi} className="w-full" opts={{ loop: images.length > 1 }}>
      <CarouselContent>
        {images.map((src, i) => (
          <CarouselItem key={i}>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={src}
                alt={`Project image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "size-2 rounded-full transition-colors",
                  i === current ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </>
      )}
    </Carousel>
  )
}

function GallerySkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-muted aspect-video w-full animate-pulse rounded-lg" />
      <div className="space-y-2">
        <div className="bg-muted h-5 w-1/2 animate-pulse rounded" />
        <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
      </div>
      <div className="bg-muted h-20 w-full animate-pulse rounded" />
    </div>
  )
}

export function ProjectDetailModal({
  open,
  onOpenChange,
  loading,
  error,
  project,
}: ProjectDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <DialogClose className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-background/70 text-foreground shadow-sm ring-offset-background backdrop-blur-sm transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="grid max-h-[90vh] gap-4 overflow-y-auto p-6">
        {loading && (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Loading project</DialogTitle>
              <DialogDescription>Fetching project details</DialogDescription>
            </DialogHeader>
            <GallerySkeleton />
          </>
        )}

        {!loading && error && (
          <div className="py-10 text-center">
            <DialogHeader className="items-center">
              <DialogTitle>Couldn&apos;t load project</DialogTitle>
              <DialogDescription>
                Something went wrong loading the project details. Please try again.
              </DialogDescription>
            </DialogHeader>
          </div>
        )}

        {!loading && !error && project && (
          <>
            <ProjectGallery images={getImageUrls(project)} />

            <DialogHeader>
              <div className="flex items-start justify-between gap-3">
                <DialogTitle className="text-xl leading-snug">
                  {project.title}
                </DialogTitle>
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
              <DialogDescription>
                {project.subtitle}
                {getPeriod(project.start_date, project.end_date) && (
                  <>
                    {" · "}
                    {getPeriod(project.start_date, project.end_date)}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

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
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo
                      <ArrowUpRight className="size-4" />
                    </a>
                  </Button>
                )}
                {project.source_code && (
                  <Button asChild variant="outline">
                    <a
                      href={project.source_code}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Code2 className="size-4" />
                      Source Code
                    </a>
                  </Button>
                )}
              </div>
            )}
          </>
        )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
