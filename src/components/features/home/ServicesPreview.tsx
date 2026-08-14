import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/features/services/ServiceCard";
import { SERVICES } from "@/lib/demo-data";
import { stagger } from "@/lib/motion";

/** Services preview band (sky background) — 6 cards + "View all" link. */
export function ServicesPreview() {
  return (
    <section id="services" className="relative overflow-hidden bg-primary-light">
      <div className="absolute inset-0 surface-pattern opacity-60" aria-hidden />
      <Container className="relative py-20 md:py-24">
        <Reveal variant="up" className="mb-11 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3 w-fit rounded-full bg-white px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-primary shadow-soft">
              Treatment menu
            </div>
            <h2 className="mb-2.5 text-balance text-[32px] font-extrabold leading-tight text-ink md:text-[44px]">
              Modern dental care, priced before you sit in the chair
            </h2>
            <p className="max-w-[620px] text-[17px] leading-[1.75] text-ink-muted">
              Each service is explained in plain language with visible starting
              fees, so patients can decide confidently.
            </p>
          </div>
          <Link
            href="/services"
            className="rounded-full bg-white px-5 py-3 font-heading text-[15px] font-bold text-primary shadow-soft transition-colors hover:text-primary-dark"
          >
            View All Services →
          </Link>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((svc, i) => (
            <Reveal key={svc.slug} variant="up" delay={stagger(i, 3)} className="h-full">
              <ServiceCard service={svc} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
