import { ProfileCard } from "@/components/profile/profile-card";
import { SummaryCard } from "@/components/profile/summary-card";
import { TechCard } from "@/components/profile/tech-card";

const profileData = {
  name: 'Muhammad Rizky Safdila',
  jobTitle: 'Software Engineer',
  available: true,
  verified: true,
  photo: '/images/rizky-alt.png',
}

export default function Home() {
  return (
    <div className="my-3 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <ProfileCard data={profileData} />
      </div>

      <div className="md:col-span-2 flex flex-col gap-4">
        <SummaryCard />
        <TechCard />
      </div>
    </div>
  );
}
