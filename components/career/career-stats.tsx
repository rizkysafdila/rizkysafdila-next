import { NumberTicker } from "@/components/ui/number-ticker";
import { MagicCard } from "../magicui/magic-card";
import { CareerStats } from "@/types/career.type";

interface CareerStatsProps {
  stats: CareerStats[];
}

export function CareerStatsGrid({ stats }: CareerStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-10">
      {stats.map((stat) => (
        <MagicCard key={stat.label} className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            {stat.label}
          </p>
          <p className="text-3xl font-bold tracking-tight text-foreground leading-none">
            <NumberTicker value={`${stat.value}${stat.suffix ?? ""}`} />
          </p>
        </MagicCard>
      ))}
    </div>
  );
}
