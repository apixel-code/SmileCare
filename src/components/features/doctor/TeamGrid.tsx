import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { TEAM } from "@/lib/demo-data";
import { stagger } from "@/lib/motion";

/** Team member cards. */
export function TeamGrid() {
  return (
    <section className="bg-primary-light">
      <Container className="py-[72px]">
        <Reveal variant="up">
          <h2 className="mb-3 text-center text-[28px] font-extrabold text-ink md:text-[32px]">
            Meet Our Team
          </h2>
          <p className="mx-auto mb-12 max-w-[480px] text-center text-[16px] leading-[1.7] text-ink-muted">
            A small, caring team — you will see the same friendly faces at every
            visit.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {TEAM.map((tm, i) => (
            <Reveal key={tm.name} variant="up" delay={stagger(i, 4)} className="h-full">
              <Card hoverable className="h-full overflow-hidden p-0 text-center">
                <div className="relative h-[200px] w-full bg-[#DCE9EF] md:h-[220px]">
                  <Image
                    src={tm.photo}
                    alt={tm.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="px-4 pb-[22px] pt-[18px]">
                  <div className="mb-1 font-heading text-[16px] font-bold text-ink">
                    {tm.name}
                  </div>
                  <div className="text-[13.5px] font-semibold text-primary">
                    {tm.role}
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
