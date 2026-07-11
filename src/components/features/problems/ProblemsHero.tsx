import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BOOK_HREF } from "@/lib/navigation";
import { PROBLEMS_HERO_IMAGE } from "@/lib/demo-data";

/** Reassuring 2-column hero for the Problems page. */
export function ProblemsHero() {
  return (
    <section className="bg-gradient-to-b from-primary-light to-white">
      <Container className="grid items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="[&>*]:animate-fade-up motion-reduce:[&>*]:animate-none">
          <h1
            className="mb-4 text-[32px] font-extrabold leading-[1.25] text-ink md:text-[42px]"
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
        <div className="relative h-[300px] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(14,124,123,0.18)] md:h-[360px]">
          <Image
            src={PROBLEMS_HERO_IMAGE}
            alt="A gentle dental consultation"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
