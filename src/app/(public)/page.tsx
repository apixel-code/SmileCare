import { Hero } from "@/components/features/home/Hero";
import { TrustStrip } from "@/components/features/home/TrustStrip";
import { WhyUs } from "@/components/features/home/WhyUs";
import { ServicesPreview } from "@/components/features/home/ServicesPreview";
import { DoctorSpotlight } from "@/components/features/home/DoctorSpotlight";
import { Testimonials } from "@/components/features/home/Testimonials";
import { LocationSection } from "@/components/features/home/LocationSection";
import { CLINIC, DOCTOR } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/demo-data";

/** schema.org Dentist (LocalBusiness) — local SEO for "dentist near me". */
const dentistJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: CLINIC.name,
  url: SITE_URL,
  telephone: CLINIC.phoneE164,
  email: CLINIC.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: CLINIC.address,
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "17:00",
      closes: "21:00",
    },
  ],
  priceRange: "৳৳",
  founder: {
    "@type": "Person",
    name: DOCTOR.name,
    jobTitle: "Dental Surgeon",
    description: DOCTOR.degrees,
  },
  makesOffer: SERVICES.slice(0, 6).map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "MedicalProcedure", name: s.name },
  })),
  // NOTE: add aggregateRating only once real Google reviews are wired in.
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistJsonLd) }}
      />
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
