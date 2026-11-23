# Portfolio v2 — Shader Editorial Redesign

Date: 2026-11-22 · Branch: `v2`

## Intent

Total revamp of the portfolio to match 2026 design trends (3D / immersive, Figma trend #1), inspired by Dribbble shots:

- [Glass Lens: WebGL Refraction Portfolio](https://dribbble.com/shots/27866544-Glass-Lens-WebGL-Refraction-Portfolio) — giant type refracted through a glass object that follows the cursor
- [Denny Pratama — Creative Developer](https://dribbble.com/shots/27894183-Denny-Pratama-Creative-Developer-Portfolio) — 3D identity + motion-driven storytelling
- [Kamil Łempiński bento](https://dribbble.com/shots/22551818-Bento-portfolio-page-design) / [Neon Terminal](https://dribbble.com/shots/27142376-Neon-Terminal-Cyber-Bento-Portfolio-for-Backend-Engineers) — interactive bento tiles for the content below the hero

Why: the current site is a single bento grid that reads like a template. v2 should give a strong, memorable first impression (immersive hero) while keeping the facts recruiters need fast to scan (bento sections).

## Goals

- Immersive WebGL hero: owner's name in giant type, refracted through a glass object that follows the cursor.
- Home becomes one long scroll story: Hero → (01) About → (02) Work → (03) Career → (04) Contact.
- Every bento tile has a reason to be interacted with (tilt, live data, globe drag, copy-to-clipboard).
- Keep light + dark themes (CLAUDE.md requirement).

## Non-goals

- No CMS / Supabase schema changes. Same services, same data.
- No blog, guestbook, Spotify, GitHub heatmap (possible later).
- No per-section morphing of the glass object (hero only for v2; later idea).
- No custom cursor.

## Anti-goals (failure even if it "works")

- Hero that tanks performance on a mid-range laptop or phone.
- Scroll-jacking (Lenis smoothing is OK, hijacking scroll position/snapping is not).
- Content hidden behind interaction — every fact must be readable without hovering, dragging or WebGL.
- Name/role only present inside the WebGL canvas (must also exist in DOM for SEO + screen readers).

## Constraints

- Next.js 15 App Router, React 19, Tailwind v4, shadcn/ui, MagicUI, `motion` — build on these.
- Server Components fetch data (`services/*`); interactive pieces are client components receiving props.
- `prefers-reduced-motion`: no Lenis, no cursor-follow, static hero frame, no scroll animations beyond fades.
- No WebGL / low-end: hero falls back to plain DOM typography over the existing shader background (or `DotPattern` fallback).
- pnpm. Do not run `pnpm lint` as a completion step (owner does). Ask before every commit; conventional commits.

## Approaches considered

| Approach | Trade-off | Decision |
|---|---|---|
| **A. Shader editorial hero + bento sections** | Highest wow, reuses v2 shader/tilt/globe work; adds Three.js (~150KB+, lazy) | **Picked** |
| B. Tactile 3D keycaps, light & minimal | Calm, professional; needs custom 3D model, less "immersive" | Rejected |
| C. Bento OS (evolve current grid) | Cheapest, lowest risk; not a total revamp | Folded into A as the section layout |
| D. Explorable hidden-object room | Most memorable; needs bespoke art, slow for recruiters | Rejected |

## Design

### Global

- **Smooth scroll**: `lenis` (disabled under reduced motion).
- **Nav**: keep the floating pill dock, restyled. Items become section anchors on `/` (Home, Work, Career, Contact) + `/projects` link + theme toggle + `⌘K` button. Active item tracks the section in view.
- **Command palette (`⌘K` / `Ctrl+K`)**: shadcn `command` (adds `cmdk`). Actions: go to section/page, toggle theme, copy email, open GitHub/LinkedIn.
- **Background**: keep `ShaderBackground` (already on `v2`) site-wide.
- **Section headers**: mono eyebrow label `(01) ABOUT` + large Syne heading, consistent across sections.
- **Typography**: Syne stays the display face (brand), pushed to very large sizes (clamp ~ 12–18vw in hero). Plus Jakarta Sans body, JetBrains Mono for labels/eyebrows.
- **Accent**: lime `#7ccf00` primary, blue `#2b7fff` secondary (existing brand pair).

### Hero (100svh)

- React Three Fiber canvas (`three`, `@react-three/fiber`, `@react-three/drei`), loaded with `next/dynamic` + `ssr: false`, mounted only on capable devices.
- Scene: drei `<Text>` "RIZKY / SAFDILA" (Syne font file) as a large backdrop; in front, a glass object (rounded torus-knot or blob) with drei `MeshTransmissionMaterial` (chromatic aberration, slight iridescence). Object lerps toward the cursor, idles with slow rotation, scales slightly on press.
- DOM overlay (real text, also the SEO/a11y source): availability pill (`profile.is_available`), role (`profile.jobTitle`), location + live local time (Asia/Jakarta), one-line tagline, CTAs: lime "Let's talk" (→ #contact) and "View work" (→ #work). Scroll cue at bottom.
- Canvas pauses (`frameloop="never"`) when hero is out of view; DPR capped `[1, 1.5]`; reduced quality transmission on mobile (`samples`, `resolution` lowered).
- Fallback (no WebGL / reduced motion / small screen if perf requires): same overlay + name rendered as DOM type, no canvas.

### (01) About — bento

- Photo tile (existing `ProfileCard`, restyled; verified badge kept).
- Summary tile (current About Me copy).
- Stats tile: years of experience (computed from earliest `careers.start_date`), project count, companies count — `number-ticker`.
- Stack tile: existing tech marquee (`TechCard`) restyled.
- Status tile: local time + "Currently at Bank Mega" (current career entry).

### (02) Selected work

- Featured projects (`fetchProjects({ is_featured: true })`) as large tilt cards (existing `TiltCard`), hover reveals a floating preview/“View case” label.
- "All projects →" to `/projects`.

### (03) Career

- Left: `CareerGlobe` tile (already on `v2`). Right/below: timeline (existing `CareerTimeline` / `TimelineEntry` content) with a line that fills as you scroll (motion `useScroll`).

### (04) Contact

- Huge heading ("Let's build something."), email with copy-to-clipboard + toast-style confirmation, social links (`DATA.contact.social`), availability pill. Footer with `Logo`.

### Other routes

- `/projects`: same section header + grid of `ProjectList` tilt cards (drop BorderBeam/Meteors).
- `/projects/[id]`: restyle header/hero area to match (title in Syne, meta in mono); body content unchanged.
- `/careers`: content moves into home; route redirects to `/#career` (via `next.config.ts` redirect).
- Loading screens: unchanged.

## Decided by owner

- Direction A (shader editorial hero + bento sections). (2026-11-22)
- Work happens on branch `v2`.

## Builder's calls (owner may override)

- Motion library: `motion` (already installed) for scroll/reveal — no GSAP.
- 3D text font: drei `<Text>` needs a font file URL, `next/font` doesn't expose one → self-host Syne (OFL) as `public/fonts/syne-bold.woff` (or .ttf).
- Nav anchors use `/#work` etc. so they also work from `/projects` pages.
- Glass object shape: torus-knot-ish rounded shape; tweak freely for looks.
- Hero tagline copy: placeholder "Software engineer building reliable products for the web." — owner to confirm.
- Default theme stays `light` per CLAUDE.md, unless owner changes it (hero tuned for both).
- Component organisation: new `components/sections/*` for home sections, `components/hero/*` for the 3D hero.
- Remove now-unused pieces (Meteors/BorderBeam/Ripple usages) only where replaced; leave MagicUI files in place.

## Open for the builder

- Exact bento spans/breakpoints, spacing scale, animation timings.
- Transmission material parameters and mobile quality tiers (verify ≥ 50fps on a mid laptop).
- Command palette visual styling.
