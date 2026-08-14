import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ClockIcon } from "@/components/ui/icons";
import { DOCTOR, CLINIC } from "@/lib/constants";
import { DOCTOR_IMAGE } from "@/lib/demo-data";
import { STAGGER_MS } from "@/lib/motion";

/** Doctor spotlight with portrait, bio, chamber hours and profile CTA. */
export function DoctorSpotlight() {
  const chamber = CLINIC.hours[0];
  return (
    <Container className="py-20 md:py-28">
      <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal variant="scale" className="relative">
          <div className="absolute -left-4 -top-4 hidden h-full w-full rounded-[28px] border-2 border-primary-light md:block" aria-hidden />
          <div className="group relative h-[440px] w-full overflow-hidden rounded-[28px] shadow-lift">
            <Image
              src={DOCTOR_IMAGE}
              alt={`Portrait of ${DOCTOR.name}`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>
          <div className="pointer-events-none absolute left-5 top-5 animate-float rounded-2xl bg-white/95 px-4 py-2.5 font-heading text-[13px] font-bold text-primary shadow-lift motion-reduce:animate-none">
            BMDC Registered
          </div>
          <div className="absolute bottom-5 right-5 rounded-2xl bg-white/95 p-4 shadow-lift backdrop-blur-md">
            <div className="font-heading text-[24px] font-extrabold text-primary">
              {DOCTOR.patientsServed}
            </div>
            <div className="text-[12.5px] text-ink-muted">patients served</div>
          </div>
        </Reveal>
        <Reveal variant="right" delay={STAGGER_MS}>
          <div className="mb-3.5 w-fit rounded-full bg-primary-light px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
            Certified Dental Specialists
          </div>
          <h2 className="mb-2 text-balance text-[32px] font-extrabold leading-tight text-ink md:text-[44px]">
            Expert Care Backed by Qualified Specialists
          </h2>
          <div className="mb-5 font-heading text-[15px] font-semibold text-[#B98A34]">
            BDS &amp; FCPS Surgeons, Orthodontists &amp; Child Specialists
          </div>
          <p className="mb-6 max-w-[540px] text-[16px] leading-[1.75] text-ink-muted">
            At {CLINIC.name}, our multidisciplinary medical team has treated over {DOCTOR.patientsServed} patients. We are dedicated to painless procedures, transparent advice, and gentle care that puts fearful patients completely at ease.
          </p>
          <div className="mb-7 flex max-w-[540px] items-center gap-3.5 rounded-[22px] border border-primary-light/60 bg-white px-6 py-[18px] shadow-soft">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary-light text-primary">
              <ClockIcon size={20} />
            </span>
            <div className="text-[15.5px] text-ink">
              <strong className="font-heading">Chamber Hours:</strong> {chamber.label},{" "}
              {chamber.value}
            </div>
          </div>
          <Button href="/doctor" variant="primary">
            Meet Our Specialists
          </Button>
        </Reveal>
      </div>
    </Container>
  );
}
