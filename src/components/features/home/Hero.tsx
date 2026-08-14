"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon, CheckIcon } from "@/components/ui/icons";
import { CLINIC, WHATSAPP_URL } from "@/lib/constants";
import { BOOK_HREF } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const CLINIC_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=2000&q=85",
    alt: "Modern dental clinic operatory suite with advanced digital equipment",
  },
  {
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=2000&q=85",
    alt: "State-of-the-art dental hospital care facility",
  },
  {
    url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=2000&q=85",
    alt: "High-tech dental surgery room and sterilization unit",
  },
  {
    url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=2000&q=85",
    alt: "Hospital grade painless dental treatment center",
  },
];

/** Full-width centered modern dental hospital/clinic showcase banner with multi-image crossfade slider and dual CTAs. */
export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % CLINIC_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate min-h-[640px] overflow-hidden bg-ink lg:min-h-[85vh]">
      {/* Background Multi-Image Sliding Carousel */}
      {CLINIC_SLIDES.map((slide, index) => (
        <Image
          key={slide.url}
          src={slide.url}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={cn(
            "object-cover transition-all duration-1000 ease-smooth",
            index === current
              ? "scale-100 opacity-85"
              : "pointer-events-none scale-105 opacity-0",
          )}
        />
      ))}

      {/* Soft vignette overlay so the clinic interior is vivid & clear while text is 100% readable */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[rgba(8,28,39,0.65)] via-[rgba(8,38,48,0.50)] to-[rgba(8,28,39,0.80)]"
        aria-hidden
      />

      <Container className="relative flex min-h-[640px] items-center justify-center py-20 text-center lg:min-h-[85vh] lg:py-28">
        <div className="mx-auto max-w-[880px] [&>*]:animate-fade-up motion-reduce:[&>*]:animate-none">
          {/* Live Status Badge */}
          <div
            className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/12 px-5 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#86E4E2] shadow-soft backdrop-blur-md"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-soft-pulse rounded-full bg-cta motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cta" />
            </span>
            State-of-the-Art Dental Hospital & Clinic • Dhaka
          </div>

          {/* Main Headline */}
          <h1
            className="mx-auto mb-4 max-w-[820px] text-balance font-heading text-[40px] font-extrabold leading-[1.08] text-white md:text-[58px] lg:text-[66px]"
            style={{ animationDelay: "0.15s" }}
          >
            Painless, Advanced Dental Care for Your Whole Family.
          </h1>

          {/* Clinic Subtitle */}
          <p
            className="mx-auto mb-8 max-w-[680px] text-[17px] leading-[1.8] text-white/90 md:text-[20px]"
            style={{ animationDelay: "0.25s" }}
          >
            {CLINIC.name} combines world-class dental specialists, digital 3D imaging, and hospital-grade sterilization for a gentle, fear-free experience.
          </p>

          {/* Centered Action Buttons */}
          <div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "0.35s" }}
          >
            <Button
              href={BOOK_HREF}
              variant="cta"
              size="lg"
              className="h-14 px-8 text-[16px] shadow-xl shadow-cta/30 hover:scale-[1.02]"
            >
              Book Your Appointment
            </Button>
            <a
              href={WHATSAPP_URL}
              className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl border border-white/60 bg-white/10 px-8 font-heading text-[16px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-[1.02]"
            >
              <WhatsAppIcon color="#25D366" size={21} /> Chat on WhatsApp
            </a>
          </div>

          {/* Centered Feature Badges */}
          <div
            className="mx-auto mt-10 grid max-w-[760px] grid-cols-1 gap-3 sm:grid-cols-3"
            style={{ animationDelay: "0.45s" }}
          >
            {[
              { title: "100% Painless Care", desc: "Gentle Anesthesia Tech" },
              { title: "Digital 3D X-Ray", desc: "Instant Accurate Scans" },
              { title: "Zero Hidden Fees", desc: "Transparent Upfront Pricing" },
            ].map((feat) => (
              <div
                key={feat.title}
                className="group rounded-2xl border border-white/16 bg-white/10 p-4 text-center backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/18 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center gap-1.5 font-heading text-[14px] font-bold text-white">
                  <CheckIcon size={15} className="text-[#86E4E2]" />
                  {feat.title}
                </div>
                <div className="mt-0.5 text-[12px] text-white/75">{feat.desc}</div>
              </div>
            ))}
          </div>

          {/* Slide Indicator Dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {CLINIC_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setCurrent(idx)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  idx === current
                    ? "w-8 bg-[#86E4E2]"
                    : "w-2 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
