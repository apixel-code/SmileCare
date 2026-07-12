import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { WHY_CARDS } from "@/lib/demo-data";
import { stagger } from "@/lib/motion";

/** "Why Patients Choose Us" — 4 reassurance cards. */
export function WhyUs() {
  return (
    <section className="relative overflow-hidden">
      <Container className="pb-14 pt-24 md:pt-28">
      <Reveal variant="up">
        <div className="mx-auto mb-3 w-fit rounded-full bg-primary-light px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
          Comfort-first dentistry
        </div>
        <h2 className="mx-auto mb-3 max-w-[760px] text-balance text-center text-[32px] font-extrabold leading-tight text-ink md:text-[44px]">
          Designed for patients who are nervous about dental treatment
        </h2>
        <p className="mx-auto mb-12 max-w-[620px] text-center text-[17px] leading-[1.8] text-ink-muted">
          Every touchpoint, from booking to payment, is built to feel calm,
          clear, and reassuring.
        </p>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_CARDS.map((card, i) => (
          <Reveal key={card.title} variant="up" delay={stagger(i, 4)} className="h-full">
            <Card hoverable className="group relative h-full overflow-hidden p-7">
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-cta to-primary opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="mb-[18px] flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-primary-light font-heading text-[19px] font-extrabold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                {card.glyph}
              </span>
              <h3 className="mb-2 font-heading text-[18px] font-bold text-ink">
                {card.title}
              </h3>
              <p className="text-[14.5px] leading-[1.7] text-ink-muted">
                {card.desc}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
      </Container>
    </section>
  );
}
