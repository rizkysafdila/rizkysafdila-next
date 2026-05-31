# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`).

```bash
pnpm dev      # start dev server with Turbopack (http://localhost:3000)
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # next lint (ESLint flat config, eslint.config.mjs)
```

There is no test runner configured in this project.

## Environment

Supabase is the data source. Both vars are read in `utils/supabase/server.ts` and `next.config.ts`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`next.config.ts` whitelists image hosts; the Supabase URL's `/storage/v1/object/public/**` path is derived from `NEXT_PUBLIC_SUPABASE_URL`, so that env var must be set for `next/image` to load profile/project images.

## Architecture

Next.js 15 (App Router, React 19) personal portfolio. Server Components by default; data is fetched on the server and passed down as props.

**Data flow.** Pages are `async` Server Components that call functions in `services/`. Each service file is marked `"use server"` and builds a Supabase client via `createClient()` from `utils/supabase/server.ts` (cookie-based SSR client). Services return `{ data, error }`-shaped objects — e.g. `fetchProfile()` returns `{ profile, error }`, `fetchProjects()` returns `{ projects, error }`. The home page (`app/(home)/page.tsx`) runs both in parallel with `Promise.all`. Supabase `select` strings use aliasing to map snake_case columns to the camelCase shape the UI types expect (e.g. `jobTitle:title`, `photo:profile_image`). Note `fetchProjects` does `JSON.parse(project.tech_stacks)` — `tech_stacks` is stored as a JSON string column.

**Not all data is from Supabase.** The careers page (`app/careers/page.tsx`) and skills (`constants/skill.ts`) use hardcoded constant arrays defined inline/in `constants/`, not Supabase. Career data in `app/careers/page.tsx` is placeholder content.

**Routing.** `app/(home)/` is a route group for the landing page (`/`). Other routes: `/careers`, `/projects`. Each route has a `loading.tsx` that renders `<LoadingScreen variant="..." />` (Next.js Suspense loading UI).

**Loading screens.** `components/loading-screen.tsx` switches between several animated loader components in `components/ui/*-loader.tsx` (`dot-wave`, `bracket-scan`, `letter-drop`, `progress`) via a `variant` prop. The `hooks/use-page-loader.ts` / `use-loading-counter.ts` hooks (client-side) enforce a minimum display duration so loaders don't flash.

**Path alias.** `@/*` maps to the repo root (`tsconfig.json`), so imports look like `@/components/...`, `@/services/...`, `@/lib/utils`.

## Component conventions

- **shadcn/ui** (New York style, `components.json`). Primitives live in `components/ui/`; do not hand-edit generated primitives unless intentional. Icon library is `lucide-react`.
- **MagicUI** components live in `components/magicui/` and are installed from the `@magicui` registry (`components.json` → `https://magicui.design/r/{name}`). Animations use `motion` (Framer Motion successor).
- `components/home/`, `components/career/`, `components/project/` hold page-specific composed components; `components/base-card.tsx` is a shared card wrapper.
- `cn()` from `lib/utils.ts` (clsx + tailwind-merge) is the standard class-merging helper. `formatPeriod()` in the same file computes career timeline date ranges.
- **Tailwind CSS v4** — config is CSS-first in `styles/globals.css` (no `tailwind.config.js`); base color `neutral`, CSS variables enabled.
- **Theming** via `next-themes` (`components/providers/theme-provider.tsx`), default theme is `light`, toggled with `class` attribute. Account for both light and dark mode when styling.
- **Fonts** are defined centrally in `fonts/index.ts` (`next/font/google`): Public Sans (body), Syne (`--font-syne`, used as `font-syne`), JetBrains Mono.

## Types

Domain types live in `types/*.type.ts` (e.g. `IProfile` in `profile.type.ts`, `CareerEntry`/`CareerStats` in `career.type.ts`). Service select shapes should match these interfaces.
