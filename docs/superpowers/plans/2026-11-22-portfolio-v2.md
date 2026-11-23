# Portfolio v2 — Shader Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as one long scroll story (immersive glass/WebGL hero → About → Work → Career → Contact) with restyled project pages.

**Architecture:** `app/(portfolio)/page.tsx` stays an async Server Component that fetches profile, projects and careers, then renders client section components from `components/sections/*`. The hero's 3D scene (`components/hero/*`) is a React Three Fiber canvas loaded with `next/dynamic({ ssr: false })` behind a WebGL capability check, with a DOM overlay that is the real (SEO/a11y) content. Lenis provides smooth scrolling; a cmdk command palette and the restyled dock provide navigation.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind v4, shadcn/ui, MagicUI, `motion`, `three` + `@react-three/fiber@9` + `@react-three/drei@10`, `lenis`, `cmdk` (via shadcn `command`), `cobe` (existing).

**Spec:** `docs/superpowers/specs/2026-11-22-portfolio-v2-design.md`

## Global Constraints

- Branch `v2`. It already contains uncommitted work this plan builds on: `components/immersive/shader-background.tsx`, `components/immersive/tilt-card.tsx`, `components/career/career-globe.tsx`, `constants/locations.ts`.
- No test runner in this project. Verification = `npx tsc --noEmit -p .` (no output = pass), `pnpm build` (exit 0), and browser checks via Playwright against `pnpm dev`.
- Do NOT run `pnpm lint` as a completion step (owner does it).
- Commits: conventional commits, short. **Ask the owner before every commit** — each "Commit" step means: propose the message, wait for approval, then commit.
- Default theme stays `light` (`components/providers/index.tsx`); every visual must work in light and dark.
- `prefers-reduced-motion`: no Lenis, no cursor-follow, static hero frame, only opacity fades.
- Every fact readable without hover/drag/WebGL; name + role exist in DOM, not only in canvas.
- No scroll-jacking (no snap, no hijacked scroll position).
- Accent colors: lime `#7ccf00`, blue `#2b7fff`. Fonts: Syne display (`font-syne`), Plus Jakarta Sans body, JetBrains Mono for eyebrow labels.
- Hero tagline copy: `Software engineer building reliable products for the web.`
- `/careers` redirects (permanent: false) to `/#career`.
- Email: `rizkysafdila@gmail.com` (already in `DATA.contact.social.Email`).

## Review Focus

1. **No WebGL / context creation fails** → hero shows DOM name typography, never a blank 100svh block. (Task 2, Step 5)
2. **Reduced motion on** → no smooth scroll, no cursor-follow, hero static, page fully usable. (Task 1 Step 6, Task 2 Step 5)
3. **Phone width 360px** → giant hero/section type causes no horizontal page scroll. (Task 2 Step 5, Task 7 Step 4)
4. **Supabase returns null/error** (profile, projects or careers) → home renders remaining sections instead of crashing (today `profile!` is asserted). (Task 3 Step 4)
5. **Cross-route hash nav** (`/projects` → `/#career`, and old `/careers` links) → lands on the section, heading not hidden under the fixed dock. (Task 5 Step 5, Task 6 Step 4)

---

### Task 1: Foundation — deps, layout shell, Section primitive, smooth scroll

**Files:**
- Modify: `package.json` (deps)
- Create: `public/fonts/syne-800.woff`
- Create: `components/providers/smooth-scroll.tsx`
- Modify: `components/providers/index.tsx`
- Create: `components/sections/section.tsx`
- Modify: `app/(portfolio)/layout.tsx`
- Modify: `styles/globals.css` (scroll-margin + lenis base CSS)

**Interfaces:**
- Produces: `Section({ id, index, label, title, className, children }: { id: string; index: string; label: string; title: React.ReactNode; className?: string; children: React.ReactNode })` — renders `<section id={id} className="scroll-mt-24 mx-auto max-w-5xl px-6 py-24">` with mono eyebrow `({index}) {LABEL}` and an `h2` in `font-syne` at `text-5xl md:text-7xl`.
- Produces: `SmoothScroll({ children })` wrapping `ReactLenis root` from `lenis/react` with `{ anchors: { offset: -96 }, lerp: 0.1 }`; renders children only (no Lenis) when reduced motion matches.
- Produces: font asset URL `/fonts/syne-800.woff`.

- [ ] **Step 1: Install deps** — `pnpm add three @react-three/fiber@^9 @react-three/drei@^10 lenis` and `pnpm add -D @types/three`, then `pnpm dlx shadcn@latest add command` (creates `components/ui/command.tsx`, adds `cmdk`).
- [ ] **Step 2: Add font file** — download `files/syne-latin-800-normal.woff` from the latest `@fontsource/syne` on cdn.jsdelivr.net to `public/fonts/syne-800.woff`. Verify: `head -c 4 public/fonts/syne-800.woff` prints `wOFF`.
- [ ] **Step 3: Implement `SmoothScroll`** and wrap it inside `Providers` (inside `ThemeProvider`). Import `lenis/dist/lenis.css` in `styles/globals.css`.
- [ ] **Step 4: Implement `Section`.**
- [ ] **Step 5: Layout shell** — in `app/(portfolio)/layout.tsx` remove the `max-w-lg lg:max-w-5xl mx-auto py-12 sm:py-24 px-6` wrapper from `<main>` (sections own their containers now); keep `Navbar`, `ShaderBackground`, `Suspense`, `Analytics`. Pages that are not yet sections (`/projects`, `/projects/[id]`) get the old container classes moved onto their own root `div` so they look unchanged.
- [ ] **Step 6: Verify** — `npx tsc --noEmit -p .` → no output. `pnpm dev`, open `/` and `/projects`: both render as before (home grid now edge-to-edge is acceptable until Task 3). In Playwright `emulateMedia({ reducedMotion: 'reduce' })` → `document.documentElement.classList.contains('lenis')` is `false`; without it → `true`.
- [ ] **Step 7: Commit** — propose `chore: add 3d, lenis and command deps with section shell`.

### Task 2: Hero — WebGL glass scene + DOM overlay

**Files:**
- Create: `hooks/use-webgl-support.ts`
- Create: `components/local-time.tsx`
- Create: `components/hero/hero-scene.tsx`
- Create: `components/hero/hero.tsx`
- Modify: `app/(portfolio)/page.tsx` (render `<Hero>` above the existing grid for now)

**Interfaces:**
- Produces: `useWebGLSupport(): boolean | null` — `null` before mount; `true` only if a `webgl2` or `webgl` context can be created on a throwaway canvas.
- Produces: `LocalTime({ timeZone = "Asia/Jakarta", className }: { timeZone?: string; className?: string })` — renders `HH:mm` + ` WIB`, updates every 30s, renders `--:--` on server to avoid hydration mismatch.
- Produces: `Hero({ profile }: { profile: IProfile | null })` — `<section id="home" className="relative h-svh">`.
- Produces (default export): `HeroScene()` — R3F `<Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} frameloop={inView ? "always" : "never"}>`.

Scene decisions (`hero-scene.tsx`):
- Two drei `<Text font="/fonts/syne-800.woff">` lines `RIZKY` / `SAFDILA`, `fontSize` derived from `viewport.width` (≈ `viewport.width / 5.2`), color from theme (`#0a0a0a` light, `#f5f5f5` dark), placed at z = -1.
- Glass object: `<mesh>` with `torusKnotGeometry args={[0.9, 0.32, 220, 32]}` + drei `MeshTransmissionMaterial` (`thickness 0.6`, `roughness 0.05`, `chromaticAberration 0.12`, `anisotropy 0.2`, `ior 1.25`, `backside`, `samples` 6 desktop / 3 when `size.width < 768`, `resolution` 512 / 256).
- `useFrame`: rotate slowly (`y += dt * 0.25`), lerp position toward `pointer * viewport/4` (factor `1 - exp(-dt*4)`); skip pointer follow under reduced motion.
- drei `<Environment preset="city" />` for reflections; `<Float>` not used (conflicts with pointer lerp).
- `inView` from an `IntersectionObserver` on the hero section passed via prop or context.

Overlay (`hero.tsx`):
- One `h1` with the full name (`profile?.name ?? "Rizky Safdila"`): visible giant DOM type in fallback mode, `sr-only` when the canvas draws the name.
- Top row: availability pill (`profile?.is_available`), `LocalTime`, location "Jakarta, ID".
- Bottom-left: role (`profile?.jobTitle ?? "Software Engineer"`) in mono eyebrow, tagline (Global Constraints copy) in `text-xl md:text-2xl`, CTAs: lime pill `Let's talk` → `/#contact`, outline pill `View work` → `/#work`.
- Bottom-center scroll cue (animated chevron, static under reduced motion).
- Canvas rendered only when `useWebGLSupport() === true` and reduced motion is off; otherwise fallback: name in DOM at `font-syne text-[18vw] leading-[0.85] tracking-tighter`.

- [ ] **Step 1: Implement `useWebGLSupport`** and `LocalTime`.
- [ ] **Step 2: Implement `HeroScene`** (dynamic import target).
- [ ] **Step 3: Implement `Hero`** with `const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false })`.
- [ ] **Step 4: Render `<Hero profile={profile} />`** at top of `app/(portfolio)/page.tsx`.
- [ ] **Step 5: Verify (browser)**:
  - 1440×900 light + dark: name visible through glass, glass follows cursor, console has no errors.
  - Playwright `addInitScript` overriding `HTMLCanvasElement.prototype.getContext` to return `null` → hero shows DOM name, no blank area (Review Focus 1).
  - `reducedMotion: 'reduce'` → no canvas element in `#home`, DOM name shown (Review Focus 2).
  - 360×780: `document.documentElement.scrollWidth <= 360` (Review Focus 3).
  - `npx tsc --noEmit -p .` → no output.
- [ ] **Step 6: Commit** — propose `feat: add webgl glass hero`.

### Task 3: About section (bento) + resilient home data

**Files:**
- Create: `lib/career-stats.ts`
- Create: `components/sections/about-section.tsx`
- Modify: `components/home/profile-card.tsx`, `components/home/summary-card.tsx`, `components/home/tech-card.tsx` (restyle only; drop their own headings in favour of tile labels)
- Modify: `app/(portfolio)/page.tsx`

**Interfaces:**
- Produces: `getCareerStats(entries: CareerEntry[]): { years: number; companies: number; current: CareerEntry | null }` — `years` = whole years from the earliest `start_date` to today (floor, min 0); `companies` = distinct non-null `company`; `current` = first entry with `current === true`, else `null`.
- Produces: `AboutSection({ profile, entries, projectCount }: { profile: IProfile | null; entries: CareerEntry[]; projectCount: number })` — `Section id="about" index="01" label="About"`.
- Consumes: `Section` (Task 1), `LocalTime` (Task 2).

Bento (lg 3 cols): photo tile (row-span 2) · summary tile (col-span 2) · stats tile (`NumberTicker` for years+, projects, companies) · status tile ("Currently at {shortCompany(current.company)}" + `LocalTime`) · stack tile (col-span 3, marquee). Tiles use `BaseCard`. Photo tile renders nothing (not a crash) when `profile` is null. Reuse `shortCompany` by moving it from `career-globe.tsx` to `lib/utils.ts` and importing it in both.

- [ ] **Step 1: Implement `getCareerStats`.** Sanity check in a node REPL-equivalent: run `npx tsx -e` with three entries starting `2023-08-01`, `2024-10-01`, `2025-11-01` (one `current`) on 2026-11-22 → `{ years: 3, companies: 3, current: <2025 entry> }`.
- [ ] **Step 2: Move `shortCompany`** to `lib/utils.ts`; update `career-globe.tsx` import.
- [ ] **Step 3: Implement `AboutSection`**; in `page.tsx` fetch `fetchProfile()`, `fetchProjects()` (all; featured = `filter(p => p.is_featured)`), `fetchCareers()` in one `Promise.all`; remove the old grid; remove `!` assertions — pass `profile ?? null`, `projects ?? []`, `entries ?? []`.
- [ ] **Step 4: Verify** — browser 1440 + 390 light/dark: bento renders, ticker animates. Temporarily set `NEXT_PUBLIC_SUPABASE_URL` to an invalid host in a shell (`NEXT_PUBLIC_SUPABASE_URL=https://invalid.local pnpm dev`) → `/` renders hero + sections without an error overlay (Review Focus 4). `npx tsc --noEmit -p .` → no output.
- [ ] **Step 5: Commit** — propose `feat: add about bento section`.

### Task 4: Work section

**Files:**
- Create: `components/sections/work-section.tsx`
- Modify: `components/project/project-list.tsx` (add optional `size?: "default" | "large"`; large = `h-64` thumbnail, `text-xl` title)
- Modify: `app/(portfolio)/page.tsx`

**Interfaces:**
- Produces: `WorkSection({ projects }: { projects: TProject[] })` — `Section id="work" index="02" label="Selected work"`; 2-col grid of `ProjectList size="large"`; header-right link `All projects →` to `/projects`. Empty array → short "Projects coming soon." line.
- Consumes: `TiltCard` (already in `ProjectList`), `Section`.

- [ ] **Step 1: Add `size` prop** to `ProjectList`.
- [ ] **Step 2: Implement `WorkSection`**; render with featured projects in `page.tsx`.
- [ ] **Step 3: Verify** — browser: cards tilt on hover (mouse), link to `/projects/{id}` works, 390px is 1 column. `npx tsc --noEmit -p .` → no output.
- [ ] **Step 4: Commit** — propose `feat: add selected work section`.

### Task 5: Career section + scroll-drawn timeline + `/careers` redirect

**Files:**
- Create: `components/sections/career-section.tsx`
- Modify: `components/career/career-timeline.tsx` (scroll progress line)
- Modify: `next.config.ts` (redirect)
- Delete: `app/(portfolio)/careers/page.tsx`, `components/career/career-header.tsx` (unused after move)
- Modify: `app/(portfolio)/page.tsx`

**Interfaces:**
- Produces: `CareerSection({ entries }: { entries: CareerEntry[] })` — `Section id="career" index="03" label="Career"`; lg grid `[280px_1fr]`: sticky `CareerGlobe` tile (`lg:sticky lg:top-28`) + `CareerTimeline`.
- `CareerTimeline` adds an absolutely positioned lime line whose `scaleY` = `useScroll({ target, offset: ["start 70%", "end 60%"] }).scrollYProgress` (origin top) over the existing gray rail; under reduced motion the line is fully drawn.
- Redirect: `async redirects() { return [{ source: "/careers", destination: "/#career", permanent: false }] }`.

- [ ] **Step 1: Add progress line** to `CareerTimeline`.
- [ ] **Step 2: Implement `CareerSection`**, render it in `page.tsx`.
- [ ] **Step 3: Add redirect; delete the careers route + `career-header.tsx`.** Check nothing else imports them: `grep -rn "career-header\|/careers" app components constants` → only the navbar entry (fixed in Task 7).
- [ ] **Step 4: Verify** — browser: line fills while scrolling the timeline; globe stays sticky on lg; dark + light OK.
- [ ] **Step 5: Verify hash nav (Review Focus 5)** — navigate to `/careers` → URL ends `/#career`, and `document.querySelector('#career h2').getBoundingClientRect().top` is between `0` and `200` after 1.5s. `npx tsc --noEmit -p .` → no output.
- [ ] **Step 6: Commit** — propose `feat: move career into home with scroll timeline`.

### Task 6: Contact section + footer

**Files:**
- Create: `components/sections/contact-section.tsx`
- Modify: `components/home/contact-info.tsx` (delete if unused after this task)
- Modify: `app/(portfolio)/layout.tsx` (footer visible on all breakpoints)
- Modify: `app/(portfolio)/page.tsx`

**Interfaces:**
- Produces: `ContactSection({ isAvailable }: { isAvailable: boolean })` — `Section id="contact" index="04" label="Contact"`; title `Let's build something.` at `text-6xl md:text-8xl`; email button copies `rizkysafdila@gmail.com` via `navigator.clipboard.writeText`, label switches to `Copied!` for 2s (falls back to `mailto:` link if clipboard API throws); social links from `DATA.contact.social`; availability pill.
- Footer: `Logo` large masked (existing markup) + `© {year} Rizky Safdila`, shown on all breakpoints.

- [ ] **Step 1: Implement `ContactSection`**; render last in `page.tsx`.
- [ ] **Step 2: Footer update** in layout.
- [ ] **Step 3: Remove dead code** — delete `components/home/contact-info.tsx` and `Ripple` usage if no longer imported (`grep -rn "contact-info\|Ripple" app components`).
- [ ] **Step 4: Verify** — click copy → button shows `Copied!`; from `/projects` click a `/#contact` link → lands on contact heading below the dock (Review Focus 5). `npx tsc --noEmit -p .` → no output.
- [ ] **Step 5: Commit** — propose `feat: add contact section and footer`.

### Task 7: Navigation — dock anchors, active section, ⌘K palette

**Files:**
- Modify: `constants/menu.tsx` (`DATA.navbar`)
- Create: `hooks/use-active-section.ts`
- Create: `components/command-menu.tsx`
- Modify: `components/navbar.tsx`
- Modify: `app/(portfolio)/layout.tsx` (mount `CommandMenu`)

**Interfaces:**
- `DATA.navbar` becomes: `{ href: "/#home", icon: HomeIcon, label: "Home" }`, `{ href: "/#work", icon: LayersIcon, label: "Work" }`, `{ href: "/#career", icon: BriefcaseBusinessIcon, label: "Career" }`, `{ href: "/#contact", icon: MailIcon, label: "Contact" }`, `{ href: "/projects", icon: FolderOpenIcon, label: "Projects" }`.
- Produces: `useActiveSection(ids: string[]): string | null` — IntersectionObserver with `rootMargin: "-45% 0px -50% 0px"`; returns id of the section crossing the viewport middle.
- Produces: `CommandMenu()` — shadcn `CommandDialog`; opens on `⌘K`/`Ctrl+K` and on `window` event `"open-command-menu"`. Groups: Navigate (the five nav items), Actions (Toggle theme via `setTheme`, Copy email), Links (GitHub, LinkedIn — open in new tab).
- Navbar: active state = `pathname === "/"` ? item matches `#${activeSection}` : `pathname.startsWith(item.href)`; adds a `⌘K` dock button dispatching `"open-command-menu"`.

- [ ] **Step 1: Update `DATA.navbar`**; implement `useActiveSection`.
- [ ] **Step 2: Implement `CommandMenu`**; mount in layout inside `Providers`.
- [ ] **Step 3: Update `Navbar`.**
- [ ] **Step 4: Verify** — scrolling `/` highlights Home→Work→Career→Contact in turn; `Ctrl+K` opens palette, "Toggle theme" flips theme, "Copy email" copies; at 360px the dock fits without horizontal scroll (`scrollWidth <= 360`, Review Focus 3). `npx tsc --noEmit -p .` → no output.
- [ ] **Step 5: Commit** — propose `feat: add section nav and command palette`.

### Task 8: Restyle `/projects` and `/projects/[id]`

**Files:**
- Modify: `app/(portfolio)/projects/page.tsx`
- Modify: `app/(portfolio)/projects/[id]/page.tsx` (header area only)

**Interfaces:**
- Consumes: `Section` (with `id="projects" index="—" label="Archive" title="All projects"`), `ProjectList`.

- [ ] **Step 1: `/projects`** — replace Card/Meteors/BorderBeam wrapper with `Section`; grid `md:grid-cols-2 lg:grid-cols-3` of `ProjectList`; add `pt-32` so content clears the dock.
- [ ] **Step 2: `/projects/[id]`** — title in `font-syne text-4xl md:text-6xl`, dates + stack in mono eyebrow style, back link `← All projects`; body content unchanged.
- [ ] **Step 3: Verify** — both pages light/dark, 1440 + 390; detail page still shows images/links. `npx tsc --noEmit -p .` → no output.
- [ ] **Step 4: Commit** — propose `feat: restyle project pages`.

### Task 9: Final verification + docs

**Files:**
- Modify: `CLAUDE.md` (Architecture: careers from Supabase, home sections, hero, new deps; routing: `/careers` redirect)

- [ ] **Step 1: `pnpm build`** → exit 0, no type errors.
- [ ] **Step 2: Full browser pass** — Review Focus 1–5 re-checked on the production build (`pnpm start`), light + dark, 1440 / 390 / 360, reduced motion.
- [ ] **Step 3: Perf sanity** — Chrome performance trace or `requestAnimationFrame` counter over 3s while moving the cursor on hero at 1440×900 → ≥ 50 fps; scrolled past hero → hero canvas not rendering (`frameloop` never).
- [ ] **Step 4: Update `CLAUDE.md`.**
- [ ] **Step 5: Commit** — propose `docs: update claude.md for v2 structure`.
