import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { WHY_CARDS } from "@/lib/demo-data";

/** "Why Patients Choose Us" — 4 reassurance cards. */
export function WhyUs() {
  return (
    <Container className="pb-12 pt-24">
      <h2 className="mb-3 text-center text-[30px] font-extrabold text-ink md:text-[34px]">
        Why Patients Choose Us
      </h2>
      <p className="mx-auto mb-12 max-w-[520px] text-center text-[17px] leading-[1.7] text-ink-muted">
        Your comfort and safety come first. Every time.
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_CARDS.map((card) => (
          <Card key={card.title} hoverable className="p-7">
            <span className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-primary-light font-heading text-[19px] font-extrabold text-primary">
              {card.glyph}
            </span>
            <h3 className="mb-2 font-heading text-[18px] font-bold text-ink">
              {card.title}
            </h3>
            <p className="text-[14.5px] leading-[1.7] text-ink-muted">
              {card.desc}
            </p>
          </Card>
        ))}
      </div>
    </Container>
  );
}
