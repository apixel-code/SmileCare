import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/features/services/ServiceCard";
import { SERVICES } from "@/lib/demo-data";

/** Services preview band (sky background) — 6 cards + "View all" link. */
export function ServicesPreview() {
  return (
    <section id="services" className="mt-12 bg-primary-light">
      <Container className="py-20">
        <Reveal variant="up" className="mb-11 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="mb-2.5 text-[30px] font-extrabold text-ink md:text-[34px]">
              Our Services
            </h2>
            <p className="text-[17px] leading-[1.7] text-ink-muted">
              Clear prices. No hidden costs. Ever.
            </p>
          </div>
          <Link
            href="/services"
            className="font-heading text-[15px] font-bold text-primary transition-colors hover:text-primary-dark"
          >
            View All Services →
          </Link>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((svc, i) => (
            <Reveal key={svc.slug} variant="up" delay={(i % 3) * 100} className="h-full">
              <ServiceCard service={svc} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
