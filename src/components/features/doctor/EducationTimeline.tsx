import { Reveal } from "@/components/ui/Reveal";
import { DOCTOR_EDUCATION } from "@/lib/demo-data";

/** Vertical education & training timeline. */
export function EducationTimeline() {
  return (
    <section className="mx-auto w-full max-w-[900px] px-5 py-20 md:px-8">
      <Reveal variant="up">
        <h2 className="mb-3 text-center text-[28px] font-extrabold text-ink md:text-[32px]">
          Education &amp; Training
        </h2>
        <p className="mx-auto mb-12 max-w-[480px] text-center text-[16px] leading-[1.7] text-ink-muted">
          Trained at Bangladesh&rsquo;s most respected institutions.
        </p>
      </Reveal>
      <div className="flex flex-col">
        {DOCTOR_EDUCATION.map((ed, i) => {
          const last = i === DOCTOR_EDUCATION.length - 1;
          return (
            <Reveal
              key={ed.year}
              variant="up"
              delay={i * 90}
              className="grid grid-cols-[64px_32px_1fr] md:grid-cols-[100px_40px_1fr]"
            >
              <div className="pb-9 pt-1 text-right font-heading text-[15px] font-extrabold text-primary md:text-[16px]">
                {ed.year}
              </div>
              <div className="flex flex-col items-center">
                <span className="mt-1.5 h-3.5 w-3.5 flex-none rounded-full border-[3px] border-primary-light bg-primary" />
                {!last && <span className="w-0.5 flex-1 bg-primary-light" />}
              </div>
              <div className="pb-9 pl-4">
                <div className="mb-1 font-heading text-[16px] font-bold text-ink md:text-[17px]">
                  {ed.title}
                </div>
                <div className="text-[15px] leading-[1.6] text-ink-muted">
                  {ed.place}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
