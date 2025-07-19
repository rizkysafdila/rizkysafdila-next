import { ProfileCard } from "@/components/profile/profile-card";

const profileData = {
  name: 'Muhammad Rizky Safdila',
  jobTitle: 'Software Engineer',
  available: true,
  verified: true,
  photo: '/images/rizky-alt.png',
}

export default function Home() {
  return (
    <div className="my-5 grid grid-cols-6">
      <ProfileCard data={profileData} className="col-span-2" />
    </div>
  );
}
