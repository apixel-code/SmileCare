import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import type { ServiceDetail } from "@/lib/service-details";

/** "How the treatment works" — 4-step timeline with PAINLESS labels. */
export function TreatmentSteps({ service }: { service: ServiceDetail }) {
  return (
    <section className="bg-primary-light">
      <Container className="py-[72px]">
        <Reveal variant="up">
          <h2 className="mb-3 text-center text-[28px] font-extrabold text-ink md:text-[32px]">
            How the Treatment Works
          </h2>
          <p className="mx-auto mb-12 max-w-[520px] text-center text-[16px] leading-[1.7] text-ink-muted">
            {service.stepsIntro}
          </p>
        </Reveal>
        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {service.steps.map((step, i) => (
            <Reveal key={step.n} variant="up" delay={i * 100} className="h-full">
              <Card className="h-full p-[26px]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-heading text-[17px] font-extrabold text-white">
                    {step.n}
                  </span>
                  {step.painless && (
                    <span className="rounded-full bg-[#F0FBF4] px-3 py-[5px] font-heading text-[11.5px] font-bold tracking-[0.04em] text-[#1F8A5B]">
                      PAINLESS
                    </span>
                  )}
                </div>
                <h3 className="mb-2 font-heading text-[16.5px] font-bold text-ink">
                  {step.title}
                </h3>
                <p className="text-[14px] leading-[1.7] text-ink-muted">
                  {step.desc}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
