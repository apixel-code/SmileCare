import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { DOCTOR, WHATSAPP_URL } from "@/lib/constants";
import { BOOK_HREF } from "@/lib/navigation";
import { HERO_IMAGE } from "@/lib/demo-data";

/** Full-width doctor banner with gradient overlay and dual CTAs. */
export function Hero() {
  return (
    <section className="relative min-h-[620px] bg-ink lg:h-[85vh]">
      <Image
        src={HERO_IMAGE}
        alt={`${DOCTOR.name}, dental surgeon at his clinic`}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(16,38,52,0.96)] via-[rgba(16,52,58,0.80)] to-transparent"
        aria-hidden
      />
      <Container className="relative flex h-full min-h-[620px] items-center py-20 lg:min-h-0">
        <div className="max-w-[620px]">
          <div className="mb-5 inline-flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7FD1CF]">
            <span className="inline-block h-[2px] w-7 bg-[#7FD1CF]" />
            {DOCTOR.eyebrow}
          </div>
          <h1 className="mb-1.5 text-[40px] font-extrabold leading-[1.1] text-white md:text-[56px]">
            {DOCTOR.name}
          </h1>
          <div className="mb-6 font-heading text-[17px] font-semibold text-[#E4B96A]">
            {DOCTOR.degrees}
          </div>
          <p className="mb-3.5 font-heading text-[24px] font-bold leading-[1.35] text-white md:text-[30px]">
            Pain-Free, Modern Dental Care You Can Trust
          </p>
          <p className="mb-8 max-w-[480px] text-[17px] leading-[1.7] text-white/80">
            Advanced treatment with a gentle touch — right here in your
            neighborhood.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href={BOOK_HREF} variant="cta" size="lg">
              Book Your Appointment
            </Button>
            <a
              href={WHATSAPP_URL}
              className="inline-flex h-14 items-center gap-2.5 rounded-xl border-[1.5px] border-white/70 bg-white/10 px-7 font-heading text-[17px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <WhatsAppIcon color="#25D366" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
