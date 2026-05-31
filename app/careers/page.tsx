import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Meteors } from "@/components/magicui/meteors";
import { CareerHeader } from "@/components/career/career-header";
import { CareerStatsGrid } from "@/components/career/career-stats";
import { CareerTimeline } from "@/components/career/career-timeline";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchCareers } from "@/services/career";
import { CareerStats } from "@/types/career.type";

export const careerStats: CareerStats[] = [
  { label: "Years Active", value: "5", suffix: "+" },
  { label: "Projects Shipped", value: "12", suffix: "+" },
  // { label: "Stack Domains", value: "3", suffix: "×" },
];

export default async function Page() {
  const { entries } = await fetchCareers();

  return (
    <div className="my-16 md:my-5">
      <Card className="relative w-full overflow-hidden shadow-none gap-4">
        <Meteors number={30} className="not-dark:hidden" />
        <CardHeader>
          <BlurFade delay={0.5} inView>
            <CareerHeader />
          </BlurFade>
        </CardHeader>
        <CardContent>
          {/* <CareerStatsGrid stats={careerStats} /> */}
          <CareerTimeline entries={entries ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}