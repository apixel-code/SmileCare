import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CheckIcon } from "@/components/ui/icons";
import { DOCTOR } from "@/lib/constants";
import { BOOK_HREF } from "@/lib/navigation";
import { DOCTOR_PORTRAIT } from "@/lib/demo-data";
import { STAGGER_MS } from "@/lib/motion";

/** Doctor profile hero — portrait + BMDC badge (left), bio + CTAs (right). */
export function DoctorHero() {
  return (
    <section className="relative overflow-hidden bg-primary-light">
      <div className="absolute inset-0 surface-pattern opacity-70" aria-hidden />
      <Container className="relative grid items-center gap-14 py-16 md:py-20 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal variant="scale" className="relative">
          <div className="absolute -left-4 -top-4 hidden h-full w-full rounded-[30px] border-2 border-white md:block" aria-hidden />
          <div className="relative h-[400px] w-full overflow-hidden rounded-[30px] shadow-[0_24px_70px_rgba(14,124,123,0.24)] md:h-[500px]">
            <Image
              src={DOCTOR_PORTRAIT}
              alt={`Portrait of ${DOCTOR.name}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/42 via-transparent to-transparent" />
          </div>
          <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 rounded-2xl bg-white/95 px-[18px] py-3.5 shadow-[0_8px_24px_rgba(26,43,60,0.15)] backdrop-blur">
            <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-primary text-white">
              <CheckIcon size={18} />
            </span>
            <div>
              <div className="font-heading text-[14px] font-extrabold text-ink">
                BMDC Registered
              </div>
              <div className="text-[12.5px] text-ink-muted">
                Reg. No: {DOCTOR.bmdcReg}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" delay={STAGGER_MS}>
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-primary shadow-soft">
            <span className="h-2 w-2 rounded-full bg-cta" />
            {DOCTOR.title}
          </div>
          <h1 className="mb-3.5 text-balance text-[38px] font-extrabold leading-tight text-ink md:text-[58px]">
            {DOCTOR.name}
          </h1>
          <div className="mb-6 flex flex-col gap-2">
            <div className="font-heading text-[18px] font-bold text-[#B98A34]">
              BDS (Dhaka Dental College)
            </div>
            <div className="font-heading text-[18px] font-bold text-[#B98A34]">
              FCPS (Conservative Dentistry &amp; Endodontics)
            </div>
          </div>
          <p className="mb-7 max-w-[560px] text-[16.5px] leading-[1.75] text-ink-muted">
            For more than a decade, Dr. Hasan has been the dentist families trust
            — especially patients who are afraid of the dentist&rsquo;s chair. He
            believes good dentistry starts with listening, explains every step
            before he begins, and never recommends treatment you don&rsquo;t
            need.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Button href={BOOK_HREF} variant="cta" size="lg">
              Book an Appointment
            </Button>
            <WhatsAppButton label="Ask on WhatsApp" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
