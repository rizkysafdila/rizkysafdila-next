import { cn } from "@/lib/utils"

interface SectionProps {
  id: string
  /** Eyebrow index, e.g. "01" */
  index: string
  /** Eyebrow label, e.g. "About" (rendered uppercase) */
  label: string
  title: React.ReactNode
  /** Optional element aligned to the right of the title (e.g. a link) */
  aside?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function Section({ id, index, label, title, aside, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("mx-auto max-w-5xl scroll-mt-24 px-6 py-24", className)}>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            ({index}) {label}
          </p>
          <h2 className="font-syne text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            {title}
          </h2>
        </div>
        {aside}
      </header>
      {children}
    </section>
  )
}
