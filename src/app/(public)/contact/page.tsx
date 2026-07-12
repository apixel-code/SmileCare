import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { ContactInfo } from "@/components/features/contact/ContactInfo";
import { ContactForm } from "@/components/features/contact/ContactForm";
import { CLINIC } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Visit or call ${CLINIC.name}. ${CLINIC.address}. Open Saturday–Thursday, 5–9 PM. Send us a message or reach us on WhatsApp.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="We’re Here to Help"
        subtitle="Have a question or want to book a visit? Send us a message, call, or drop by — whatever is easiest for you."
      />

      <Container className="py-16 md:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <Reveal variant="up">
            <ContactInfo />
          </Reveal>
          <Reveal variant="up" delay={100}>
            <ContactForm />
          </Reveal>
        </div>

        <Reveal variant="up" className="mt-8">
          <MapPlaceholder />
        </Reveal>
      </Container>
    </>
  );
}
