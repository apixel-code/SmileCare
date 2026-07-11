import { Reveal } from "@/components/ui/Reveal";
import { MYTHS } from "@/lib/demo-data";

/** Myth vs Fact — dispels common fears that delay treatment. */
export function MythVsFact() {
  return (
    <section className="bg-primary-light">
      <div className="mx-auto w-full max-w-[1000px] px-5 py-[72px] md:px-8">
        <Reveal variant="up">
          <h2 className="mb-3 text-center text-[28px] font-extrabold text-ink md:text-[32px]">
            Myth vs Fact
          </h2>
          <p className="mx-auto mb-11 max-w-[520px] text-center text-[16px] leading-[1.7] text-ink-muted">
            Many people delay treatment because of things they heard. Here is the
            truth.
          </p>
        </Reveal>
        <div className="flex flex-col gap-4">
          {MYTHS.map((m, i) => (
            <Reveal key={m.myth} variant="up" delay={i * 80}>
              <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-soft sm:grid-cols-2">
                <div className="border-b border-primary-light px-[26px] py-6 sm:border-b-0 sm:border-r">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F4F6F8] px-3.5 py-[5px] font-heading text-[12px] font-bold tracking-[0.06em] text-ink-muted">
                    ✕ MYTH
                  </span>
                  <div className="text-[15.5px] italic leading-[1.7] text-[#475569]">
                    &ldquo;{m.myth}&rdquo;
                  </div>
                </div>
                <div className="bg-[#F7FBFC] px-[26px] py-6">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-[5px] font-heading text-[12px] font-bold tracking-[0.06em] text-white">
                    ✓ FACT
                  </span>
                  <div className="text-[15.5px] leading-[1.7] text-ink">
                    {m.fact}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
