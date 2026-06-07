import { BlurFade } from "@/components/magicui/blur-fade";
import { Meteors } from "@/components/magicui/meteors";
import { CareerHeader } from "@/components/career/career-header";
import { CareerTimeline } from "@/components/career/career-timeline";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchCareers } from "@/services/career";

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
          <CareerTimeline entries={entries ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}