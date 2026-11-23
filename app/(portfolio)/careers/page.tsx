import { BlurFade } from "@/components/magicui/blur-fade";
import { Meteors } from "@/components/magicui/meteors";
import { CareerHeader } from "@/components/career/career-header";
import { CareerTimeline } from "@/components/career/career-timeline";
import { CareerGlobe } from "@/components/career/career-globe";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchCareers } from "@/services/career";

export default async function Page() {
  const { entries } = await fetchCareers();

  return (
    <div className="max-w-lg lg:max-w-5xl mx-auto py-12 sm:py-24 px-6 my-16 md:my-5">
      <Card className="relative w-full overflow-hidden shadow-none gap-4">
        <Meteors number={30} className="not-dark:hidden" />
        <CardHeader className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <BlurFade delay={0.5} inView>
            <CareerHeader />
          </BlurFade>
          <BlurFade delay={0.75} inView className="w-full max-w-64 self-center md:w-64 md:self-auto">
            <CareerGlobe entries={entries ?? []} />
          </BlurFade>
        </CardHeader>
        <CardContent>
          <CareerTimeline entries={entries ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}