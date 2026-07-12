import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CLINIC } from "@/lib/constants";
import { BOOK_HREF } from "@/lib/navigation";
import { REVIEWS } from "@/lib/demo-data";
import { stagger } from "@/lib/motion";

/** Google-review-style testimonials + booking CTA band. */
export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0 opacity-20 surface-pattern" aria-hidden />
      <Container className="relative py-20 md:py-24">
        <Reveal variant="up">
          <div className="mx-auto mb-3 w-fit rounded-full bg-white/10 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#AEE9E7]">
            Patient proof
          </div>
          <h2 className="mb-3 text-center text-[32px] font-extrabold text-white md:text-[44px]">
            What Our Patients Say
          </h2>
          <p className="mb-12 flex flex-wrap items-center justify-center gap-2 text-center text-[16px] text-white/70">
            <span className="font-heading text-[20px] font-extrabold text-white">
              {CLINIC.rating.score}
            </span>
            <span className="tracking-[2px] text-[#F5A623]">★★★★★</span>
            <span>from {CLINIC.rating.source}</span>
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((rev, i) => (
            <Reveal key={rev.name} variant="up" delay={stagger(i, 3)} className="h-full">
              <Card hoverable className="flex h-full flex-col gap-3.5 border-white/10 bg-white/[0.97] p-6">
              <div className="flex items-center justify-between">
                <span className="tracking-[3px] text-[16px] text-[#F5A623]">
                  ★★★★★
                </span>
                <span className="font-heading text-[12px] font-bold text-ink-muted">
                  G
                </span>
              </div>
              <p className="text-[15px] leading-[1.7] text-ink">
                &ldquo;{rev.text}&rdquo;
              </p>
              <div className="mt-auto flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="h-[42px] w-[42px] flex-none rounded-full bg-primary-light object-cover"
                />
                <div>
                  <div className="font-heading text-[14px] font-bold text-ink">
                    {rev.name}
                  </div>
                  <div className="text-[13px] text-ink-muted">{rev.area}</div>
                </div>
              </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal
          variant="scale"
          className="relative mt-14 flex flex-col items-center gap-[18px] overflow-hidden rounded-[28px] bg-primary px-8 py-12 text-center shadow-[0_26px_70px_rgba(0,0,0,0.28)]"
        >
          <span className="absolute inset-y-0 left-0 w-1/3 animate-slide-shine bg-white/15 blur-lg motion-reduce:animate-none" aria-hidden />
          <div className="font-heading text-[26px] font-extrabold leading-[1.4] text-white md:text-[28px]">
            Ready for a healthier smile?
          </div>
          <div className="text-[16px] leading-[1.7] text-white/85">
            Book online in 2 minutes. No advance payment needed.
          </div>
          <Button href={BOOK_HREF} variant="cta" size="lg" className="mt-1.5">
            Book Appointment
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
