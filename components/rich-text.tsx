import { cn } from "@/lib/utils"

interface RichTextProps extends React.ComponentProps<"div"> {
  /** Trusted HTML string to render (e.g. rich-text stored in the DB). */
  html: string | null | undefined
}

/**
 * Renders a trusted HTML string, re-applying list/link styles that
 * Tailwind's Preflight reset strips from injected markup.
 *
 * Only pass HTML you control — the content is rendered verbatim.
 */
export function RichText({ html, className, ...props }: RichTextProps) {
  if (!html) return null

  return (
    <div
      className={cn(
        "[&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_li]:mt-1 [&_a]:underline",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  )
}
