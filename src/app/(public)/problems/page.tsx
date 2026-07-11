import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ProblemsHero } from "@/components/features/problems/ProblemsHero";
import { ProblemSolutionCard } from "@/components/features/problems/ProblemSolutionCard";
import { MythVsFact } from "@/components/features/problems/MythVsFact";
import { EmergencyStrip } from "@/components/features/problems/EmergencyStrip";
import { PROBLEMS } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Problems We Solve",
  description:
    "Toothache, bad breath, bleeding gums, crooked or yellow teeth — whatever is bothering you, there's a clear, affordable solution. We treat these gently, every day.",
};

export default function ProblemsPage() {
  return (
    <>
      <ProblemsHero />

      <Container className="py-[72px]">
        <Reveal variant="up">
          <h2 className="mb-3 text-center text-[28px] font-extrabold text-ink md:text-[32px]">
            In Your Words — And Our Answer
          </h2>
          <p className="mx-auto mb-12 max-w-[520px] text-center text-[16px] leading-[1.7] text-ink-muted">
            Find your problem below. Every one of them has a clear, affordable
            solution.
          </p>
        </Reveal>
        <div className="grid gap-[22px] lg:grid-cols-2">
          {PROBLEMS.map((item, i) => (
            <Reveal
              key={item.pain}
              variant="up"
              delay={(i % 2) * 100}
              className="h-full"
            >
              <ProblemSolutionCard item={item} />
            </Reveal>
          ))}
        </div>
      </Container>

      <MythVsFact />
      <EmergencyStrip />
    </>
  );
}
