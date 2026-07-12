import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BOOK_HREF } from "@/lib/navigation";
import { PROBLEMS_HERO_IMAGE } from "@/lib/demo-data";

/** Reassuring 2-column hero for the Problems page. */
export function ProblemsHero() {
  return (
    <section className="relative overflow-hidden bg-primary-light">
      <div className="absolute inset-0 surface-pattern opacity-70" aria-hidden />
      <Container className="relative grid items-center gap-14 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="[&>*]:animate-fade-up motion-reduce:[&>*]:animate-none">
          <div
            className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-primary shadow-soft"
            style={{ animationDelay: "0.02s" }}
          >
            <span className="h-2 w-2 rounded-full bg-cta" />
            Tell us what hurts
          </div>
          <h1
            className="mb-4 text-balance text-[36px] font-extrabold leading-tight text-ink md:text-[54px]"
            style={{ animationDelay: "0.05s" }}
          >
            Suffering From a Dental Problem? Don&rsquo;t Worry — There&rsquo;s a
            Solution.
          </h1>
          <p
            className="mb-7 max-w-[520px] text-[18px] leading-[1.7] text-ink-muted"
            style={{ animationDelay: "0.15s" }}
          >
            Whatever is bothering you, you are not alone. We treat these problems
            every single day — gently, and without judgment.
          </p>
          <div
            className="flex flex-wrap gap-4"
            style={{ animationDelay: "0.25s" }}
          >
            <Button href={BOOK_HREF} variant="cta" size="lg">
              Book Appointment
            </Button>
            <WhatsAppButton label="Describe Your Problem" />
          </div>
        </div>
        <div className="relative h-[320px] w-full overflow-hidden rounded-[28px] shadow-[0_24px_70px_rgba(14,124,123,0.22)] md:h-[420px]">
          <Image
            src={PROBLEMS_HERO_IMAGE}
            alt="A gentle dental consultation"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="animate-hero-zoom object-cover motion-reduce:animate-none"
          />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/92 p-4 shadow-lift backdrop-blur-md">
            <div className="font-heading text-[15px] font-extrabold text-ink">
              Emergency pain? We prioritize urgent cases.
            </div>
            <div className="text-[13px] text-ink-muted">
              Call or WhatsApp and describe the problem.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
