import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneIcon } from "@/components/ui/icons";
import { CLINIC, TEL_URL } from "@/lib/constants";

/** Coral emergency band — "in severe pain?" + click-to-call. */
export function EmergencyStrip() {
  return (
    <section className="bg-cta">
      <Container className="flex flex-wrap items-center justify-between gap-6 py-12">
        <Reveal variant="up">
          <div className="mb-1.5 font-heading text-[24px] font-extrabold text-white md:text-[26px]">
            In severe pain right now?
          </div>
          <div className="text-[16px] leading-[1.6] text-white/90">
            Call us immediately — we keep emergency slots open every day.
          </div>
        </Reveal>
        <a
          href={TEL_URL}
          className="inline-flex h-[60px] items-center gap-3 rounded-xl bg-white px-8 font-heading text-[20px] font-extrabold text-ink shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#FFF3EF] md:text-[22px]"
        >
          <PhoneIcon size={24} className="text-cta" />
          {CLINIC.phoneDisplay}
        </a>
      </Container>
    </section>
  );
}
