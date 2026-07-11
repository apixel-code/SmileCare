import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
import { DOCTOR, WHATSAPP_URL } from "@/lib/constants";
import { DOCTOR_IMAGE } from "@/lib/demo-data";

/** Doctor credibility strip + final booking CTA on brand teal. */
export function ServiceFinalCTA() {
  return (
    <section id="final-cta" className="bg-primary">
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-2">
        <Reveal variant="up" className="flex items-center gap-6">
          <div className="relative h-[110px] w-[110px] flex-none overflow-hidden rounded-full border-[3px] border-white/50">
            <Image
              src={DOCTOR_IMAGE}
              alt={DOCTOR.name}
              fill
              sizes="110px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="mb-1 font-heading text-[22px] font-extrabold text-white">
              {DOCTOR.name}
            </div>
            <div className="mb-2 text-[14.5px] font-semibold text-[#E4B96A]">
              {DOCTOR.degrees}
            </div>
            <div className="text-[14px] leading-[1.6] text-white/80">
              Your treatment will be done personally by Dr. Hasan —{" "}
              {DOCTOR.yearsExperience} years, {DOCTOR.patientsServed} patients.
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delay={120} className="text-center">
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
