import { Hero } from "@/components/features/home/Hero";
import { TrustStrip } from "@/components/features/home/TrustStrip";
import { WhyUs } from "@/components/features/home/WhyUs";
import { ServicesPreview } from "@/components/features/home/ServicesPreview";
import { DoctorSpotlight } from "@/components/features/home/DoctorSpotlight";
import { Testimonials } from "@/components/features/home/Testimonials";
import { LocationSection } from "@/components/features/home/LocationSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WhyUs />
      <ServicesPreview />
      <DoctorSpotlight />
      <Testimonials />
      <LocationSection />
    </>
  );
}
