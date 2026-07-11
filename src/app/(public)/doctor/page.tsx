import type { Metadata } from "next";
import { DoctorHero } from "@/components/features/doctor/DoctorHero";
import { DoctorStats } from "@/components/features/doctor/DoctorStats";
import { EducationTimeline } from "@/components/features/doctor/EducationTimeline";
import { TeamGrid } from "@/components/features/doctor/TeamGrid";
import { ScheduleCTA } from "@/components/features/doctor/ScheduleCTA";
import { DOCTOR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About ${DOCTOR.name}`,
  description:
    "Meet Dr. Mahmudul Hasan — BMDC-registered, BDS & FCPS qualified, 10+ years and 5,000+ patients. Gentle, honest dental care in Dhaka.",
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
