import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceGridCard } from "@/components/features/services/ServiceGridCard";
import { ServicesWhatsAppBar } from "@/components/features/services/ServicesWhatsAppBar";
import { SERVICES } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Our Dental Services",
  description:
    "Modern, painless treatment for every dental problem — with transparent pricing. Scaling, root canal, crowns, braces, implants and more.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Transparent Pricing"
        title="Our Dental Services"
        subtitle="Modern, painless treatment for every dental problem — with transparent pricing."
      />

      <Container className="px-5 pb-24 pt-6 md:px-8">
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc) => (
            <ServiceGridCard key={svc.slug} service={svc} />
          ))}
        </div>
      </Container>

      <ServicesWhatsAppBar />
    </>
  );
}
