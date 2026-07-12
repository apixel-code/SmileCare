import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { ServiceDetail } from "@/lib/service-details";

/** Breadcrumb hero — copy + Book CTA on the left, service image on the right. */
export function ServiceDetailHero({ service }: { service: ServiceDetail }) {
  return (
    <section className="bg-gradient-to-b from-primary-light to-white">
      <Container className="grid items-center gap-14 py-12 pb-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="[&>*]:animate-fade-up motion-reduce:[&>*]:animate-none">
          <div style={{ animationDelay: "0.05s" }} className="mb-6">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: service.name },
              ]}
            />
          </div>
          <h1
            className="mb-4 text-[34px] font-extrabold leading-[1.15] text-ink md:text-[44px]"
            style={{ animationDelay: "0.12s" }}
          >
            {service.name}
          </h1>
          <p
            className="mb-7 max-w-[520px] text-[18px] leading-[1.7] text-ink-muted"
            style={{ animationDelay: "0.2s" }}
          >
            {service.tagline}
          </p>
          <div
            className="flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.28s" }}
          >
            <Button href="/book" variant="cta" size="lg">
              Book Appointment
            </Button>
            <div className="flex items-center gap-2.5 text-[14.5px] text-ink-muted">
              <span className="tracking-[2px] text-[#F5A623]">★★★★★</span>
              Rated 4.9 by our patients
            </div>
          </div>
        </div>
        <div className="relative h-[300px] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(14,124,123,0.18)] md:h-[380px]">
          <Image
            src={service.heroImage}
            alt={service.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="animate-hero-zoom object-cover motion-reduce:animate-none"
          />
        </div>
      </Container>
    </section>
  );
}
