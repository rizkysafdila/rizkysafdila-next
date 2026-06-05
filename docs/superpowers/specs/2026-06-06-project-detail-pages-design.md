# Project Detail Pages Design

**Date:** 2026-06-06
**Status:** Approved

## Summary

Replace the client-side modal for project details with individual server-rendered pages at `/projects/[id]`. Removes modal infrastructure entirely.

## Architecture

### New route

`app/projects/[id]/page.tsx` — async Server Component. Calls `fetchProjectById(id)` from `services/project.ts`. Renders the full project detail UI (gallery, title, subtitle, period, description, tech stacks, links) plus a "Back to Projects" link.

`app/projects/[id]/loading.tsx` — renders `<LoadingScreen variant="dot-wave" />` (matching the existing projects loading pattern).

### Updated components

`components/project/project-list.tsx` — replace `onClick={() => open(data.id)}` with a Next.js `<Link href={/projects/${data.id}}>` wrapper. Remove `useProjectModal` import and usage.

### Deleted files

- `components/project/project-modal-context.tsx`
- `components/project/project-detail-modal.tsx`

### Updated providers

`components/providers/index.tsx` — remove `ProjectModalProvider` wrapper. `Providers` becomes just `ThemeProvider`.

## Data Flow

Page receives `params.id` → calls `fetchProjectById(id)` (already exists, no changes needed) → renders detail. No client-side state needed for fetching.

## Content reuse

The helper functions from the modal (`formatMonthYear`, `getPeriod`, `getImageUrls`, `ProjectGallery`) move into the new page file or a shared utility. `RichText`, `SkillBadge`, `SkillIcon` components are unchanged.

## Navigation

- Project card (`ProjectList`) links to `/projects/[id]`
- Detail page has a `<Link href="/projects">← Back to Projects</Link>` button at the top

## Error handling

If `fetchProjectById` returns an error or null project, render a not-found state (Next.js `notFound()` from `next/navigation`).
