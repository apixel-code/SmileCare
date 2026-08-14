import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
import { CLINIC, WHATSAPP_URL } from "@/lib/constants";
import { DOCTOR_IMAGE } from "@/lib/demo-data";
import { STAGGER_MS } from "@/lib/motion";

/** Doctor credibility strip + final booking CTA on brand teal. */
export function ServiceFinalCTA() {
  return (
    <section id="final-cta" className="bg-primary">
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-2">
        <Reveal variant="up" className="flex items-center gap-5">
          <div className="relative h-[96px] w-[96px] flex-none overflow-hidden rounded-2xl border-2 border-white/20 shadow-soft">
            <Image
              src={DOCTOR_IMAGE}
              alt={`${CLINIC.name} Dental Care Specialists`}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="mb-1 font-heading text-[20px] font-extrabold text-white">
              {CLINIC.name}
            </div>
            <div className="mb-1.5 text-[14px] font-semibold text-[#E4B96A]">
              Certified BDS &amp; FCPS Dental Specialists
            </div>
            <div className="text-[13.5px] leading-[1.55] text-white/80">
              Painless procedures, 100% sterilized equipment, and honest treatment plans for your whole family.
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delay={STAGGER_MS} className="text-center">
          <div className="mb-[18px] font-heading text-[24px] font-extrabold leading-[1.4] text-white md:text-[26px]">
            Book Your Appointment Today
          </div>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Button href="/book" variant="cta" size="lg">
              Book Appointment
            </Button>
            <a
              href={WHATSAPP_URL}
              className="inline-flex h-14 items-center gap-2.5 rounded-xl border-[1.5px] border-white/70 px-7 font-heading text-[16px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              <WhatsAppIcon color="#25D366" /> WhatsApp Instead
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
