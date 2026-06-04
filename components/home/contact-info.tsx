import { DATA } from "@/constants/menu"

export function ContactInfo() {
  return (
    <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
      <h3 className="text-2xl font-semibold font-syne">
        Let&apos;s <span className="text-lime-500">connect</span>
      </h3>
      <div className="flex items-center gap-3">
        {Object.entries(DATA.contact.social).map(([name, social]) => (
          <a
            key={name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="flex size-11 items-center justify-center rounded-xl border bg-background text-foreground transition-colors hover:bg-accent"
          >
            <social.icon className="size-5" />
          </a>
        ))}
      </div>
    </div>
  )
}
