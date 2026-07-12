import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CheckIcon } from "@/components/ui/icons";
import { WHATSAPP_URL } from "@/lib/constants";
import type { ServiceDetail } from "@/lib/service-details";
import { stagger } from "@/lib/motion";

/** "Are you experiencing these symptoms?" — intro + checklist of signs. */
export function SymptomChecklist({ service }: { service: ServiceDetail }) {
  return (
    <Container className="py-[72px]">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.2fr]">
        <Reveal variant="up">
          <h2 className="mb-3.5 text-[28px] font-extrabold text-ink md:text-[32px]">
            Are You Experiencing These Symptoms?
          </h2>
          <p className="text-[16px] leading-[1.7] text-ink-muted">
            {service.symptomsIntro}
          </p>
        </Reveal>
        <div className="flex flex-col gap-3">
          {service.symptoms.map((s, i) => (
            <Reveal key={s} variant="up" delay={stagger(i)}>
              <div className="flex items-center gap-4 rounded-xl border border-primary-light bg-white px-5 py-4 shadow-[0_2px_10px_rgba(26,43,60,0.04)]">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary-light text-primary">
                  <CheckIcon size={16} />
                </span>
                <span className="text-[15.5px] text-ink">{s}</span>
              </div>
            </Reveal>
          ))}
          <p className="px-1 pt-1.5 text-[14px] text-ink-muted">
            Not sure?{" "}
            <a
              href={WHATSAPP_URL}
              className="font-semibold text-primary hover:text-primary-dark"
            >
              Send us a photo on WhatsApp
            </a>{" "}
            — we&rsquo;ll tell you honestly.
          </p>
        </div>
      </div>
    </Container>
  );
}
