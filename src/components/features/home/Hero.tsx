import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ClockIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { CLINIC, DOCTOR, TEL_URL, WHATSAPP_URL } from "@/lib/constants";
import { BOOK_HREF } from "@/lib/navigation";
import { HERO_IMAGE } from "@/lib/demo-data";

/** Full-width doctor banner with gradient overlay and dual CTAs. */
export function Hero() {
  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-ink lg:min-h-[calc(100vh-76px)]">
      <Image
        src={HERO_IMAGE}
        alt={`${DOCTOR.name}, dental surgeon at his clinic`}
        fill
        priority
        sizes="100vw"
        className="animate-hero-zoom object-cover motion-reduce:animate-none"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(8,28,39,0.98)] via-[rgba(10,95,94,0.80)] to-[rgba(8,28,39,0.20)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.18] surface-pattern"
        aria-hidden
      />
      <Container className="relative flex min-h-[720px] items-center py-12 lg:min-h-[calc(100vh-76px)]">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="max-w-[700px] [&>*]:animate-fade-up motion-reduce:[&>*]:animate-none">
          <div
            className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#AEE9E7] backdrop-blur-md"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-soft-pulse rounded-full bg-cta motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cta" />
            </span>
            {DOCTOR.eyebrow}
          </div>
          <h1
            className="mb-4 text-balance text-[42px] font-extrabold leading-[1.02] text-white md:text-[64px] lg:text-[72px]"
            style={{ animationDelay: "0.15s" }}
          >
            A calmer dental visit starts here.
          </h1>
          <div
            className="mb-5 font-heading text-[15px] font-semibold text-[#F1C46D] md:text-[17px]"
            style={{ animationDelay: "0.25s" }}
          >
            {DOCTOR.name} · {DOCTOR.degrees}
          </div>
          <p
            className="mb-8 max-w-[590px] text-[18px] leading-[1.8] text-white/82 md:text-[20px]"
            style={{ animationDelay: "0.35s" }}
          >
            Pain-free treatment, honest pricing, digital records, and a gentle
            team that explains every step before touching a tooth.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: "0.45s" }}>
            <Button href={BOOK_HREF} variant="cta" size="lg">
              Book Your Appointment
            </Button>
            <a
              href={WHATSAPP_URL}
              className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl border-[1.5px] border-white/60 bg-white/10 px-7 font-heading text-[17px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <WhatsAppIcon color="#25D366" /> Chat on WhatsApp
            </a>
          </div>
          <div
            className="mt-8 grid max-w-[620px] grid-cols-2 gap-3 sm:grid-cols-3"
            style={{ animationDelay: "0.55s" }}
          >
            {[
              ["5,000+", "patients treated"],
              ["4.9★", "Google rating"],
              ["No hidden", "treatment fees"],
            ].map(([big, small]) => (
              <div key={big} className="rounded-2xl border border-white/16 bg-white/10 p-4 backdrop-blur-md">
                <div className="font-heading text-[22px] font-extrabold text-white">
                  {big}
                </div>
                <div className="text-[12.5px] leading-snug text-white/70">{small}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative ml-auto max-w-[430px] animate-scale-in rounded-[28px] border border-white/18 bg-white/12 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.30)] backdrop-blur-xl motion-reduce:animate-none">
            <div className="overflow-hidden rounded-[22px] bg-white">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=85"
                  alt="Modern dental clinic treatment room"
                  fill
                  sizes="430px"
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 font-heading text-[12px] font-extrabold text-primary shadow-soft">
                  Live queue + online booking
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4">
                <a href={TEL_URL} className="rounded-2xl bg-primary-light p-4 transition-transform hover:-translate-y-1">
                  <PhoneIcon size={19} />
                  <div className="mt-3 font-heading text-[14px] font-extrabold text-ink">
                    Call clinic
                  </div>
                  <div className="text-[12px] text-ink-muted">{CLINIC.phoneDisplay}</div>
                </a>
                <div className="rounded-2xl bg-[#FFF3EE] p-4">
                  <ClockIcon size={19} />
                  <div className="mt-3 font-heading text-[14px] font-extrabold text-ink">
                    Chamber
                  </div>
                  <div className="text-[12px] text-ink-muted">Sat-Thu, 5-9 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </Container>
    </section>
  );
}
