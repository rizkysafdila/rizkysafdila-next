import { syne } from "@/fonts"
import { cn } from "@/lib/utils"

interface ILogoProps {
  className?: string
}

export const Logo = ({ className }: ILogoProps) => {
  return (
    <p className={cn(
      "text-xl font-bold font-syne my-auto tracking-tight select-none",
      syne.className,
      className
    )}>
      <span className="text-blue-500">rizky</span>safdila<span className="text-lime-500 font-bold">.</span>
    </p>
  )
}