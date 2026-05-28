import { cn } from "@/lib/utils";

interface LetterDropLoaderProps {
  name?: string;
  accent?: string;
  subtitle?: string;
  className?: string;
}

const LETTER_DELAY = 0.06; // seconds between each letter

export function LetterDropLoader({
  name = "rizky",
  accent = "safdila",
  subtitle = "Software Engineer",
  className,
}: LetterDropLoaderProps) {
  const nameLetters = name.split("");
  const accentLetters = accent.split("");
  const allLetters = [...nameLetters, ...accentLetters];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Animated name */}
      <div className="flex items-baseline gap-0.5">
        {allLetters.map((char, i) => {
          const isAccent = i >= nameLetters.length;
          return (
            <span
              key={i}
              className={cn(
                "inline-block font-sans text-2xl font-bold leading-none",
                isAccent ? "text-lime-500" : "text-foreground"
              )}
              style={{
                animation: `letterDrop 2s ease-in-out ${(i * LETTER_DELAY).toFixed(2)}s infinite`,
                opacity: 0,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Subtitle */}
      <span
        className="font-mono text-[10px] uppercase tracking-[3px] text-white/20"
        style={{
          animation: `letterDrop 2s ease-in-out ${(allLetters.length * LETTER_DELAY + 0.1).toFixed(2)}s infinite`,
          opacity: 0,
        }}
      >
        {subtitle}
      </span>

      <style>{`
        @keyframes letterDrop {
          0%   { opacity: 0; transform: translateY(-10px); }
          15%  { opacity: 1; transform: translateY(0); }
          70%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
}
