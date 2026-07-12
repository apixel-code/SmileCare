import { formatTaka, TEL_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PortalPayment } from "@/types/portal";

const METHOD_BADGE: Record<string, string> = {
  bkash: "bg-[#E2136E]",
  nagad: "bg-[#F6921E]",
  card: "bg-ink",
  cash: "bg-ink-muted",
};

/** Payment history rows — due rows highlighted with Pay Now. */
export function PaymentsList({ items }: { items: PortalPayment[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[#EDF4F7] bg-white p-6 text-center text-[14px] text-ink-muted shadow-[0_4px_14px_rgba(26,43,60,0.05)]">
        No payments recorded yet.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EDF4F7] bg-white shadow-[0_4px_14px_rgba(26,43,60,0.05)]">
      {items.map((p) => (
        <div
          key={p.id}
          className={cn(
            "flex items-center gap-3.5 border-b border-[#EDF4F7] px-[18px] py-[15px] last:border-b-0",
            p.isDue && "bg-[#FFF6F2]",
          )}
        >
          <span
            className={cn(
              "inline-flex h-[26px] min-w-[52px] flex-none items-center justify-center rounded-md px-2 font-heading text-[11px] font-bold uppercase text-white",
              p.isDue ? "bg-cta" : (METHOD_BADGE[p.method] ?? "bg-ink-muted"),
            )}
          >
            {p.isDue ? "DUE" : p.method}
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold text-ink">
              {p.label}
            </span>
            <span className="mt-px block text-[12px] text-ink-muted">
              {p.isDue ? "Due at next visit" : p.dateLabel}
            </span>
          </span>
          {p.isDue ? (
            <span className="flex items-center gap-2.5">
              <span className="font-heading text-[15px] font-extrabold text-cta">
                {formatTaka(p.amount)}
              </span>
              <a
                href={TEL_URL}
                className="flex min-h-[40px] items-center rounded-[10px] bg-cta px-4 font-heading text-[12.5px] font-bold text-white shadow-[0_4px_12px_rgba(255,122,89,0.35)] transition-colors hover:bg-cta-dark"
              >
                Pay Now
              </a>
            </span>
          ) : (
            <span className="font-heading text-[15px] font-bold text-ink">
              {formatTaka(p.amount)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
