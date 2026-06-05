# Project Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the client-side project detail modal with individual server-rendered pages at `/projects/[id]`.

**Architecture:** Create a dynamic route `app/projects/[id]/page.tsx` as an async Server Component that calls the existing `fetchProjectById` service. Update `ProjectList` cards to `<Link>` to that route. Remove all modal infrastructure (context, modal component, provider wrapper).

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion (`motion`)

---

### Task 1: Create project detail page

**Files:**
- Create: `app/projects/[id]/page.tsx`

No test runner in this project — verify manually with dev server after implementation.

- [ ] **Step 1: Create `app/projects/[id]/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify the file was created**

Run: `pnpm build` (or check TypeScript via the IDE). Expect no errors for this file in isolation — the imports all exist already.

---

### Task 2: Create project detail loading screen

**Files:**
- Create: `app/projects/[id]/loading.tsx`

- [ ] **Step 1: Create `app/projects/[id]/loading.tsx`**

```tsx
import { LoadingScreen } from "@/components/loading-screen"

export default function Loading() {
  return <LoadingScreen variant="dot-wave" />
}
```

---

### Task 3: Update ProjectList card to use Link

**Files:**
- Modify: `components/project/project-list.tsx`

- [ ] **Step 1: Replace modal open with `<Link>` in `components/project/project-list.tsx`**

Remove the `useProjectModal` import and `onClick` handler. Wrap the card in a `<Link>` and remove the `cursor-pointer` from the card (the link handles it).

Replace the entire file with:

```tsx
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Pin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { TProject } from '@/types/project.type'
import { cn } from '@/lib/utils'
import { SkillIcon } from '../skill'

type ProjectCardProps = {
  data: TProject
}

export function ProjectList({ data, className }: ProjectCardProps & React.ComponentProps<"div">) {
  return (
    <Link href={`/projects/${data.id}`} className="block">
      <Card
        className={cn(
          "group relative p-0 shadow-none hover:scale-102 transition duration-200",
          className,
        )}
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
                <ArrowRight className="w-4 h-4" />
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
    </Link>
  )
}
```

---

### Task 4: Remove ProjectModalProvider from Providers

**Files:**
- Modify: `components/providers/index.tsx`

- [ ] **Step 1: Update `components/providers/index.tsx`**

Replace the entire file with:

```tsx
"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/providers/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  )
}
```

---

### Task 5: Delete modal infrastructure files

**Files:**
- Delete: `components/project/project-modal-context.tsx`
- Delete: `components/project/project-detail-modal.tsx`

- [ ] **Step 1: Delete `components/project/project-modal-context.tsx`**

```bash
rm components/project/project-modal-context.tsx
```

- [ ] **Step 2: Delete `components/project/project-detail-modal.tsx`**

```bash
rm components/project/project-detail-modal.tsx
```

---

### Task 6: Build check and commit

- [ ] **Step 1: Run lint and build**

```bash
pnpm lint && pnpm build
```

Expected: no errors. If TypeScript complains about missing imports (e.g., something still importing the deleted modal files), track down and fix.

- [ ] **Step 2: Start dev server and verify manually**

```bash
pnpm dev
```

- Navigate to `http://localhost:3000/projects`
- Click a project card — should navigate to `/projects/{uuid}` (not open a modal)
- Verify: gallery, title, subtitle, period, description, tech stacks, and links render
- Verify: "Back to Projects" button navigates back to `/projects`
- Verify: dark mode works (toggle theme, check gallery + badges)
- Verify: a direct URL like `http://localhost:3000/projects/{valid-uuid}` loads correctly
- Verify: `http://localhost:3000/projects/invalid-id` renders the Next.js 404 page

- [ ] **Step 3: Commit**

```bash
git add app/projects/[id]/page.tsx app/projects/[id]/loading.tsx components/project/project-list.tsx components/providers/index.tsx docs/superpowers/specs/2026-06-06-project-detail-pages-design.md docs/superpowers/plans/2026-06-06-project-detail-pages.md
git commit -m "feat(projects): replace modal with individual detail pages"
```
