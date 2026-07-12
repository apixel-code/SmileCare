import { BOOKING_SERVICE_OPTIONS } from "@/lib/booking";
import { cn } from "@/lib/utils";

/** Step 1 — pick a service (tapping a card advances the wizard). */
export function ServiceStep({
  selected,
  onPick,
}: {
  selected: string | null;
  onPick: (slug: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-3 px-5 pb-8 pt-6">
      <h1 className="font-heading text-[24px] font-extrabold leading-[1.3] text-ink">
        What do you need help with?
      </h1>
      <p className="mb-1 text-[14.5px] leading-[1.6] text-ink-muted">
        Tap one option. Don&rsquo;t worry — you can&rsquo;t choose wrong.
      </p>
      {BOOKING_SERVICE_OPTIONS.map((svc) => {
        const sel = selected === svc.slug;
        return (
          <button
            key={svc.slug}
            type="button"
            onClick={() => onPick(svc.slug)}
            className={cn(
              "flex min-h-[64px] items-center gap-3.5 rounded-2xl border-2 px-[18px] py-3.5 text-left transition-colors",
              sel
                ? "border-primary bg-[#F0F9F9]"
                : "border-[#E1EBF0] bg-white hover:border-primary/40",
            )}
          >
            <span
              className={cn(
                "flex h-11 w-11 flex-none items-center justify-center rounded-xl font-heading text-[16px] font-extrabold",
                sel ? "bg-primary text-white" : "bg-primary-light text-primary",
              )}
            >
              {svc.glyph}
            </span>
            <span className="flex-1">
              <span className="block font-heading text-[16px] font-bold text-ink">
                {svc.name}
              </span>
              <span className="mt-0.5 block text-[13px] text-ink-muted">
                {svc.sub}
              </span>
            </span>
            <span
              className={cn(
                "flex h-6 w-6 flex-none items-center justify-center rounded-full border-2",
                sel ? "border-primary bg-primary" : "border-[#CBD5E1] bg-white",
              )}
            >
              {sel && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
