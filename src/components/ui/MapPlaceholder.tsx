import { cn } from "@/lib/utils";

/**
 * Placeholder for the Google Map embed (swapped for a real map before launch).
 * Reused on Home (LocationSection) and Contact.
 */
export function MapPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-[#9EC9D6] bg-[repeating-linear-gradient(45deg,#E8F4F8,#E8F4F8_14px,#F4FAFC_14px,#F4FAFC_28px)]",
        className,
      )}
    >
      <div className="rounded-lg bg-white px-4 py-2.5 font-mono text-[13px] text-ink-muted">
        [ Google Map embed — clinic location ]
      </div>
      <a
        href="#"
        className="absolute bottom-5 left-5 flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-heading text-sm font-bold text-white shadow-[0_6px_18px_rgba(14,124,123,0.35)] transition-colors hover:bg-primary-dark"
      >
        Get Directions →
      </a>
    </div>
  );
}
