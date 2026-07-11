import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CLINIC } from "@/lib/constants";
import { BOOK_HREF } from "@/lib/navigation";
import { REVIEWS } from "@/lib/demo-data";

/** Google-review-style testimonials + booking CTA band. */
export function Testimonials() {
  return (
    <section className="bg-primary-light">
      <Container className="py-20">
        <h2 className="mb-3 text-center text-[30px] font-extrabold text-ink md:text-[34px]">
          What Our Patients Say
        </h2>
        <p className="mb-12 flex items-center justify-center gap-2 text-center text-[16px] text-ink-muted">
          <span className="font-heading text-[20px] font-extrabold text-ink">
            {CLINIC.rating.score}
          </span>
          <span className="tracking-[2px] text-[#F5A623]">★★★★★</span>
          <span>from {CLINIC.rating.source}</span>
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((rev) => (
            <Card key={rev.name} className="flex flex-col gap-3.5 p-6">
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
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-[18px] rounded-2xl bg-primary px-8 py-12 text-center">
          <div className="font-heading text-[26px] font-extrabold leading-[1.4] text-white md:text-[28px]">
            Ready for a healthier smile?
          </div>
          <div className="text-[16px] leading-[1.7] text-white/85">
            Book online in 2 minutes. No advance payment needed.
          </div>
          <Button href={BOOK_HREF} variant="cta" size="lg" className="mt-1.5">
            Book Appointment
          </Button>
        </div>
      </Container>
    </section>
  );
}
