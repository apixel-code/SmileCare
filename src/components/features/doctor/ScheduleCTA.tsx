import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BOOK_HREF } from "@/lib/navigation";
import { DOCTOR_SCHEDULE } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  primary: "text-primary",
  muted: "text-ink-muted",
  cta: "text-cta",
};

/** Chamber schedule card + booking CTA. */
export function ScheduleCTA() {
  return (
    <section id="schedule">
      <Container className="grid items-center gap-12 py-20 lg:grid-cols-2">
        <Reveal variant="up">
          <Card className="p-8">
            <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-primary">
              Chamber Schedule
            </div>
            <div className="flex flex-col">
              {DOCTOR_SCHEDULE.map((row) => (
                <div
                  key={row.day}
                  className="flex items-center justify-between border-b border-primary-light px-1 py-3.5 last:border-b-0"
                >
                  <span className="text-[15.5px] font-medium text-ink">
                    {row.day}
                  </span>
                  <span
                    className={cn(
                      "font-heading text-[15px] font-bold",
                      TONE[row.tone],
                    )}
                  >
                    {row.time}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[13.5px] leading-[1.6] text-ink-muted">
              Emergency patients are seen outside these hours — call the hotline.
            </p>
          </Card>
        </Reveal>

        <Reveal variant="up" delay={120}>
          <h2 className="mb-3.5 text-[28px] font-extrabold text-ink md:text-[32px]">
            Book an Appointment with the Doctor
          </h2>
          <p className="mb-7 max-w-[460px] text-[16px] leading-[1.7] text-ink-muted">
            Serial numbers fill up fast in the evening. Book online now, or
            message us on WhatsApp and we&rsquo;ll confirm your time within
            minutes.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Button href={BOOK_HREF} variant="cta" size="lg">
              Book an Appointment
            </Button>
            <WhatsAppButton label="WhatsApp" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
