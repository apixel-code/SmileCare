import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceDetail, getAllServiceSlugs } from "@/lib/service-details";
import { ServiceDetailHero } from "@/components/features/services/detail/ServiceDetailHero";
import { SymptomChecklist } from "@/components/features/services/detail/SymptomChecklist";
import { TreatmentSteps } from "@/components/features/services/detail/TreatmentSteps";
import { ServicePricing } from "@/components/features/services/detail/ServicePricing";
import { BeforeAfterGallery } from "@/components/features/services/detail/BeforeAfterGallery";
import { ServiceFAQ } from "@/components/features/services/detail/ServiceFAQ";
import { ServiceFinalCTA } from "@/components/features/services/detail/ServiceFinalCTA";

type Params = { slug: string };

// Prerender every known service; unknown slugs 404 (data is a fixed set for now).
export function generateStaticParams(): Params[] {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceDetail(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.tagline,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getServiceDetail(slug);
  if (!service) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ServiceDetailHero service={service} />
      <SymptomChecklist service={service} />
      <TreatmentSteps service={service} />
      <ServicePricing service={service} />
      <BeforeAfterGallery service={service} />
      <ServiceFAQ service={service} />
      <ServiceFinalCTA />
    </>
  );
}
