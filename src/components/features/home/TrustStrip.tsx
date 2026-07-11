import { TRUST_ITEMS } from "@/lib/demo-data";
import { Reveal } from "@/components/ui/Reveal";

/** Floating trust strip — overlaps the hero bottom edge. */
export function TrustStrip() {
  return (
    <div className="relative z-10 mx-auto -mt-14 max-w-[1100px] px-5 md:px-8">
      <Reveal variant="up" className="grid grid-cols-2 gap-5 rounded-2xl bg-white p-7 shadow-lift md:grid-cols-4">
        {TRUST_ITEMS.map((t) => (
          <div key={t.big} className="flex items-center gap-3.5">
            <span className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-xl bg-primary-light font-heading text-[17px] font-extrabold text-primary">
              {t.glyph}
            </span>
            <div>
              <div className="font-heading text-[17px] font-extrabold leading-tight text-ink">
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
