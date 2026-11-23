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

**Data flow.** Pages are `async` Server Components that call functions in `services/`. Each service file is marked `"use server"` and builds a Supabase client via `createClient()` from `utils/supabase/server.ts` (cookie-based SSR client). Services return `{ data, error }`-shaped objects — e.g. `fetchProfile()` returns `{ profile, error }`, `fetchProjects()` returns `{ projects, error }`, `fetchCareers()` returns `{ entries, error }`. The home page (`app/(portfolio)/page.tsx`) runs all three in parallel with `Promise.all` and passes `?? null` / `?? []` defaults down — sections must render (not crash) when a fetch fails. Supabase `select` strings use aliasing to map snake_case columns to the camelCase shape the UI types expect (e.g. `jobTitle:title`, `photo:profile_image`). Note `fetchProjects` does `JSON.parse(project.tech_stacks)` — `tech_stacks` is stored as a JSON string column.

**Not all data is from Supabase.** Skills (`constants/skill.ts`), nav/social links (`constants/menu.tsx`) and globe coordinates (`constants/locations.ts`, keyed by the `careers.location` string — add a row for each new city or it won't appear on the globe) are hardcoded. Careers come from the Supabase `careers` table.

**Routing.** `app/(portfolio)/` is the route group for everything. `/` is one long scroll page built from sections: `Hero` (`#home`) → `AboutSection` (`#about`) → `WorkSection` (`#work`) → `CareerSection` (`#career`) → `ContactSection` (`#contact`). Other routes: `/projects`, `/projects/[id]`. `/careers` is a redirect to `/#career` (`next.config.ts`). Nav links use `/#section` anchors so they work from any route.

**Home sections.** `components/sections/section.tsx` is the shared wrapper (`id`, `index`, `label`, `title`, optional `aside`) — it renders the mono `(01) LABEL` eyebrow + Syne heading and carries `scroll-mt-24` so anchors land below the fixed dock. Section components live in `components/sections/`.

**Hero / WebGL.** `components/hero/hero.tsx` (Server Component) renders the profile name as giant Syne type, one word per line (`MUHAMMAD / RIZKY / SAFDILA`), fitted between the top meta row and the bottom tagline/CTA block via `components/hero/constants.ts`. `components/immersive/shader-background.tsx` is the site-wide WebGL background (falls back to `DotPattern`); `tilt-card.tsx` gives project cards a 3D hover tilt. `components/career/career-globe.tsx` (cobe) falls back to a legend without WebGL. Anything that uses WebGL must have a no-WebGL fallback.

**Scrolling & navigation.** Smooth scroll is Lenis (`components/providers/smooth-scroll.tsx`), mounted as a sibling in root mode and disabled under `prefers-reduced-motion`; it also re-applies the URL hash after hydration. Scrollable overlays need `data-lenis-prevent`. The dock (`components/navbar.tsx`) highlights the section in view via `hooks/use-active-section.ts` (`aria-current`). `components/command-menu.tsx` is the ⌘K / Ctrl+K palette (shadcn `command` / cmdk).

**Loading UI.** `app/(portfolio)/loading.tsx` renders `<LoadingScreen variant="..." />` (Next.js Suspense loading UI); `app/(portfolio)/projects/[id]/loading.tsx` for project detail.

**Loading screens.** `components/loading-screen.tsx` switches between several animated loader components in `components/ui/*-loader.tsx` (`dot-wave`, `bracket-scan`, `letter-drop`, `progress`) via a `variant` prop. The `hooks/use-page-loader.ts` / `use-loading-counter.ts` hooks (client-side) enforce a minimum display duration so loaders don't flash.

**Path alias.** `@/*` maps to the repo root (`tsconfig.json`), so imports look like `@/components/...`, `@/services/...`, `@/lib/utils`.

## Component conventions

- **shadcn/ui** (New York style, `components.json`). Primitives live in `components/ui/`; do not hand-edit generated primitives unless intentional. Icon library is `lucide-react`.
- **MagicUI** components live in `components/magicui/` and are installed from the `@magicui` registry (`components.json` → `https://magicui.design/r/{name}`). Animations use `motion` (Framer Motion successor).
- `components/sections/` (home sections), `components/hero/`, `components/immersive/`, `components/home/` (about tiles), `components/career/`, `components/project/` hold composed components; `components/base-card.tsx` is a shared card wrapper (server-rendered; its theme colour comes from the `--magic-card-gradient` CSS variable).
- Respect `prefers-reduced-motion` in every animation, and decide it in effects/handlers — not by branching render output — to avoid hydration mismatches.
- `cn()` from `lib/utils.ts` (clsx + tailwind-merge) is the standard class-merging helper. `formatPeriod()` in the same file computes career timeline date ranges.
- **Tailwind CSS v4** — config is CSS-first in `styles/globals.css` (no `tailwind.config.js`); base color `neutral`, CSS variables enabled.
- **Theming** via `next-themes` (`components/providers/theme-provider.tsx`), default theme is `light`, toggled with `class` attribute. Account for both light and dark mode when styling.
- **Fonts** are defined centrally in `fonts/index.ts` (`next/font/google`): Plus Jakarta Sans (body), Syne (`--font-syne`, used as `font-syne`), JetBrains Mono (`--font-jetbrains-mono`, used as `font-mono` for eyebrow labels). Accent colours: lime `#7ccf00`, blue `#2b7fff`.

## Types

Domain types live in `types/*.type.ts` (e.g. `IProfile` in `profile.type.ts`, `CareerEntry`/`CareerStats` in `career.type.ts`). Service select shapes should match these interfaces.

## IMPORTANT!!!
Notes:
- No need to run `pnpm lint` every time you completed the code, i'll do it myself
- Use conventional commit with short and descriptive message, ask me every time before you commit the changes