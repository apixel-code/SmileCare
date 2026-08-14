import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon, PhoneIcon, ClockIcon, CheckIcon } from "@/components/ui/icons";
import { CLINIC, WHATSAPP_URL, TEL_URL } from "@/lib/constants";
import { BOOK_HREF } from "@/lib/navigation";

const CLINIC_HERO_BG =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1800&q=85";
const CLINIC_OPERATORY_IMAGE =
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&q=85";

/** Full-width modern dental clinic showcase banner with interactive facility cards and dual CTAs. */
export function Hero() {
  return (
    <section className="relative isolate min-h-[640px] overflow-hidden bg-ink lg:min-h-[86vh]">
      {/* Background Clinic Facility Image */}
      <Image
        src={CLINIC_HERO_BG}
        alt={`${CLINIC.name} state-of-the-art modern clinic facility`}
        fill
        priority
        sizes="100vw"
        className="animate-hero-zoom object-cover opacity-35 motion-reduce:animate-none"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(8,28,39,0.98)] via-[rgba(10,55,68,0.90)] to-[rgba(8,28,39,0.65)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.12] surface-pattern"
        aria-hidden
      />

      <Container className="relative flex min-h-[640px] items-center py-14 lg:min-h-[86vh] lg:py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
          {/* Left Column: Clinic Value Proposition */}
          <div className="max-w-[660px] [&>*]:animate-fade-up motion-reduce:[&>*]:animate-none">
            {/* Live Status Pill */}
            <div
              className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#86E4E2] backdrop-blur-md"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-soft-pulse rounded-full bg-cta motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cta" />
              </span>
              Modern & Painless Dental Care • Dhaka
            </div>

            {/* Main Headline */}
            <h1
              className="mb-3 text-balance font-heading text-[38px] font-extrabold leading-[1.08] text-white md:text-[54px] lg:text-[60px]"
              style={{ animationDelay: "0.15s" }}
            >
              Painless, Advanced Dental Care for Your Whole Family.
            </h1>

            {/* Clinic Subtitle */}
            <p
              className="mb-6 text-[17px] leading-[1.75] text-white/85 md:text-[19px]"
              style={{ animationDelay: "0.25s" }}
            >
              {CLINIC.name} is equipped with digital 3D imaging, painless rotary endodontics, and hospital-grade sterilization for a calm, confident smile.
            </p>

            {/* Primary Action Buttons */}
            <div
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap"
              style={{ animationDelay: "0.35s" }}
            >
              <Button href={BOOK_HREF} variant="cta" size="lg" className="shadow-lg shadow-cta/25">
                Book Your Appointment
              </Button>
              <a
                href={WHATSAPP_URL}
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl border border-white/60 bg-white/10 px-7 font-heading text-[16px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-[1.02]"
              >
                <WhatsAppIcon color="#25D366" size={20} /> Chat on WhatsApp
              </a>
            </div>

            {/* Interactive Clinic Feature Pills */}
            <div
              className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3"
              style={{ animationDelay: "0.45s" }}
            >
              {[
                { title: "100% Painless", desc: "Gentle Anesthesia" },
                { title: "Digital 3D X-Ray", desc: "Instant Diagnostics" },
                { title: "Zero Hidden Fees", desc: "Upfront Pricing" },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="group rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/15"
                >
                  <div className="flex items-center gap-1.5 font-heading text-[13.5px] font-bold text-white">
                    <CheckIcon size={14} className="text-[#86E4E2]" />
                    {feat.title}
                  </div>
                  <div className="text-[11.5px] text-white/70">{feat.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive State-of-the-Art Clinic Facility Card */}
          <div className="hidden lg:block">
            <div className="relative ml-auto max-w-[440px] animate-scale-in rounded-[26px] border border-white/20 bg-white/10 p-3.5 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl motion-reduce:animate-none">
              <div className="overflow-hidden rounded-[20px] bg-white">
                {/* Operatory Photo with Floating Feature Badges */}
                <div className="group relative aspect-[4/3] overflow-hidden bg-ink/10">
                  <Image
                    src={CLINIC_OPERATORY_IMAGE}
                    alt="SmileCare Modern Dental Treatment Room"
                    fill
                    sizes="440px"
                    className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1.5 font-heading text-[11.5px] font-extrabold text-primary shadow-soft backdrop-blur-md">
                    🛡️ 100% Autoclave Sterilization
                  </div>
                  <div className="absolute bottom-3.5 left-3.5 rounded-full bg-cta px-3 py-1 font-heading text-[11px] font-bold text-white shadow-soft">
                    Digital Clinic Setup
                  </div>
                </div>

                {/* Chamber Info & Quick Contact */}
                <div className="grid grid-cols-2 gap-2.5 p-3.5">
                  <a
                    href={TEL_URL}
                    className="group flex flex-col rounded-xl bg-primary-light/80 p-3 transition-all hover:bg-primary hover:text-white"
                  >
                    <div className="flex items-center gap-1.5 text-primary group-hover:text-white">
                      <PhoneIcon size={16} />
                      <span className="font-heading text-[12px] font-extrabold uppercase tracking-wider">
                        Call Clinic
                      </span>
                    </div>
                    <div className="mt-1 font-heading text-[13px] font-bold text-ink group-hover:text-white">
                      {CLINIC.phoneDisplay}
                    </div>
                  </a>

                  <div className="flex flex-col rounded-xl bg-[#FFF5F0] p-3">
                    <div className="flex items-center gap-1.5 text-cta">
                      <ClockIcon size={16} />
                      <span className="font-heading text-[12px] font-extrabold uppercase tracking-wider">
                        Chamber Hours
                      </span>
                    </div>
                    <div className="mt-1 font-heading text-[12.5px] font-bold text-ink">
                      Sat – Thu, 5–9 PM
                    </div>
                  </div>
                </div>

                {/* Rating & Trust Footnote */}
                <div className="flex items-center justify-between border-t border-primary-light/60 bg-[#FAFCFD] px-4 py-2.5 text-[12px]">
                  <span className="font-semibold text-ink-muted">
                    ⭐ <strong className="text-ink">4.9 / 5.0</strong> on Google
                  </span>
                  <span className="font-bold text-primary">
                    5,000+ Happy Smiles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
