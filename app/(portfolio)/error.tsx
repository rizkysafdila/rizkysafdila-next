"use client"

import Link from "next/link"

/** Last line of defence: a client error in any page shows this instead of a blank screen. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto flex min-h-svh max-w-5xl flex-col justify-center px-6 py-32">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">(!) Error</p>
      <h1 className="font-syne text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">Something broke.</h1>
      <p className="mt-6 max-w-md text-muted-foreground">This page hit an unexpected error. Try again, or head back home.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-lime-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-lime-400"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/5"
        >
          Go home
        </Link>
      </div>
    </section>
  )
}
