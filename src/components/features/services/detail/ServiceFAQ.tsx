import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import type { ServiceDetail } from "@/lib/service-details";
import { STAGGER_MS } from "@/lib/motion";

/** "Questions patients ask us" — answer-first FAQ accordion (SEO/AEO). */
export function ServiceFAQ({ service }: { service: ServiceDetail }) {
  return (
    <section className="mx-auto w-full max-w-[840px] px-5 py-20 md:px-8">
      <Reveal variant="up">
        <h2 className="mb-3 text-center text-[28px] font-extrabold text-ink md:text-[32px]">
          Questions Patients Ask Us
        </h2>
        <p className="mx-auto mb-10 text-center text-[16px] leading-[1.7] text-ink-muted">
          Honest answers, in plain language.
        </p>
      </Reveal>
      <Reveal variant="up" delay={STAGGER_MS}>
        <Accordion items={service.faqs} name={`faq-${service.slug}`} />
      </Reveal>
    </section>
  );
}
