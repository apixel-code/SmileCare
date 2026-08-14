import type { Metadata } from "next";
import { DoctorHero } from "@/components/features/doctor/DoctorHero";
import { DoctorStats } from "@/components/features/doctor/DoctorStats";
import { EducationTimeline } from "@/components/features/doctor/EducationTimeline";
import { TeamGrid } from "@/components/features/doctor/TeamGrid";
import { ScheduleCTA } from "@/components/features/doctor/ScheduleCTA";

export const metadata: Metadata = {
  title: "Our Dental Specialists & Team",
  description:
    "Meet our certified dental surgeons and specialists at SmileCare Dental Clinic Dhaka. Multidisciplinary painless dental care for the entire family.",
};

export default function DoctorPage() {
  return (
    <>
      <DoctorHero />
      <DoctorStats />
      <EducationTimeline />
      <TeamGrid />
      <ScheduleCTA />
    </>
  );
}
