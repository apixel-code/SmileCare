import { TRUST_ITEMS } from "@/lib/demo-data";
import { Reveal } from "@/components/ui/Reveal";

/** Floating trust strip — overlaps the hero bottom edge. */
export function TrustStrip() {
  return (
    <div className="relative z-10 mx-auto -mt-20 max-w-[1120px] px-5 md:px-8">
      <Reveal variant="up" className="glass-panel grid grid-cols-2 gap-3 rounded-[28px] p-3 md:grid-cols-4">
        {TRUST_ITEMS.map((t) => (
          <div key={t.big} className="group flex items-center gap-3 rounded-[22px] p-3 transition-colors hover:bg-primary-light/70">
            <span className="flex h-[50px] w-[50px] flex-none items-center justify-center rounded-2xl bg-primary text-center font-heading text-[16px] font-extrabold text-white shadow-soft-md transition-transform group-hover:scale-105">
              {t.glyph}
            </span>
            <div>
              <div className="font-heading text-[17px] font-extrabold leading-tight text-ink md:text-[18px]">
                {t.big}
              </div>
              <div className="text-[13px] text-ink-muted">{t.small}</div>
            </div>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
