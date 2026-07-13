"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { collectPaymentApi, sendReminderApi } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatTaka, PAYMENT_METHOD } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AdminPaymentRow } from "@/server/services/payments.service";

const FILTERS = ["All", "Paid", "Due", "Partial"] as const;

const METHOD_BADGE: Record<string, string> = {
  bkash: "bg-[#FCE7F0] text-[#E2136E]",
  nagad: "bg-[#FEF0E0] text-[#F6921E]",
  card: "bg-[#E8ECF1] text-ink",
  cash: "bg-[#EEF1F4] text-ink-muted",
};

export function PaymentsTable({ rows }: { rows: AdminPaymentRow[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [collectFor, setCollectFor] = useState<AdminPaymentRow | null>(null);
  const [receiptFor, setReceiptFor] = useState<AdminPaymentRow | null>(null);
  const toast = useToast();
  const router = useRouter();

  const filtered = useMemo(() => {
    if (filter === "All") return rows;
    return rows.filter((r) => r.status === filter.toLowerCase());
  }, [rows, filter]);

  async function remind(row: AdminPaymentRow) {
    const res = await sendReminderApi(row.id);
    toast(res.ok ? `Reminder SMS sent to ${row.name}` : res.error);
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "min-h-[44px] rounded-[11px] border-2 px-5 font-heading text-[13.5px] font-bold transition-colors",
              filter === f
                ? "border-primary bg-primary text-white"
                : "border-[#E1EBF0] bg-white text-ink-muted hover:border-primary/40",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Mobile: card list (no horizontal scroll) */}
      <div className="flex flex-col gap-2.5 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#E1EBF0] bg-white px-4 py-10 text-center text-[14px] text-[#94A3B8] shadow-soft">
            No payments match this filter.
          </div>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="rounded-2xl border border-[#E1EBF0] bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-ink">{p.name}</span>
                  <span className="block text-[12px] text-ink-muted">{p.phone}</span>
                </span>
                <StatusPill status={p.status} />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-ink-muted">
                <span className="text-ink">{p.label}</span>
                <span>·</span>
                <span>{p.dateLabel}</span>
                <span
                  className={cn(
                    "ml-auto inline-block rounded-lg px-2 py-0.5 font-heading text-[11px] font-extrabold uppercase",
                    METHOD_BADGE[p.method] ?? "bg-[#EEF1F4] text-ink-muted",
                  )}
                >
                  {p.method}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#F7FBFC] p-3 text-center">
                <div>
                  <div className="text-[11px] text-ink-muted">Total</div>
                  <div className="font-heading text-[14px] font-bold text-ink">{formatTaka(p.total)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-ink-muted">Paid</div>
                  <div className="font-heading text-[14px] font-bold text-success">{formatTaka(p.paid)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-ink-muted">Due</div>
                  <div className={cn("font-heading text-[14px] font-extrabold", p.due > 0 ? "text-danger" : "text-ink-muted")}>
                    {p.due > 0 ? formatTaka(p.due) : "—"}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {p.status !== "paid" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setCollectFor(p)}
                      className="min-h-[48px] flex-1 rounded-[10px] bg-cta px-3.5 font-heading text-[13.5px] font-bold text-white transition-colors hover:bg-cta-dark"
                    >
                      Collect Payment
                    </button>
                    <button
                      type="button"
                      aria-label="Send SMS reminder"
                      onClick={() => remind(p)}
                      className="flex h-12 w-12 flex-none items-center justify-center rounded-[10px] border border-[#E1EBF0] text-[16px] text-primary transition-colors hover:bg-[#F0F9F9]"
                    >
                      ✉
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReceiptFor(p)}
                    className="min-h-[48px] w-full rounded-[10px] border-2 border-[#E1EBF0] bg-white px-3.5 font-heading text-[13.5px] font-bold text-primary transition-colors hover:bg-[#F0F9F9]"
                  >
                    View Receipt
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: full table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-[#E1EBF0] bg-white shadow-soft md:block">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E1EBF0] bg-[#F7FBFC]">
              {["DATE", "PATIENT", "BILL", "TOTAL", "PAID", "DUE", "METHOD", "STATUS", "ACTION"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-3 font-heading text-[11.5px] font-bold tracking-[0.05em] text-ink-muted first:pl-4 last:pr-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-[14px] text-[#94A3B8]">
                  No payments match this filter.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-[#EDF4F7] last:border-b-0">
                <td className="px-3 py-3.5 pl-4 text-[12.5px] font-semibold text-ink-muted">
                  {p.dateLabel}
                </td>
                <td className="px-3 py-3.5">
                  <span className="block text-[14px] font-semibold text-ink">{p.name}</span>
                  <span className="block text-[12px] text-ink-muted">{p.phone}</span>
                </td>
                <td className="px-3 py-3.5 text-[13px] text-ink">{p.label}</td>
                <td className="px-3 py-3.5 font-heading text-[13.5px] font-bold text-ink">
                  {formatTaka(p.total)}
                </td>
                <td className="px-3 py-3.5 font-heading text-[13.5px] font-bold text-success">
                  {formatTaka(p.paid)}
                </td>
                <td
                  className={cn(
                    "px-3 py-3.5 font-heading text-[13.5px] font-extrabold",
                    p.due > 0 ? "text-danger" : "text-ink-muted",
                  )}
                >
                  {p.due > 0 ? formatTaka(p.due) : "—"}
                </td>
                <td className="px-3 py-3.5">
                  <span
                    className={cn(
                      "inline-block rounded-lg px-2.5 py-1 font-heading text-[11.5px] font-extrabold uppercase",
                      METHOD_BADGE[p.method] ?? "bg-[#EEF1F4] text-ink-muted",
                    )}
                  >
                    {p.method}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <StatusPill status={p.status} />
                </td>
                <td className="px-3 py-3 pr-4">
                  <div className="flex items-center gap-2">
                    {p.status !== "paid" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setCollectFor(p)}
                          className="min-h-[44px] flex-1 whitespace-nowrap rounded-[10px] bg-cta px-3.5 font-heading text-[13px] font-bold text-white transition-colors hover:bg-cta-dark"
                        >
                          Collect Payment
                        </button>
                        <button
                          type="button"
                          title="Send SMS reminder"
                          onClick={() => remind(p)}
                          className="flex h-11 w-11 flex-none items-center justify-center rounded-[10px] border border-[#E1EBF0] text-[16px] text-primary transition-colors hover:bg-[#F0F9F9]"
                        >
                          ✉
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setReceiptFor(p)}
                        className="min-h-[44px] flex-1 whitespace-nowrap rounded-[10px] border-2 border-[#E1EBF0] bg-white px-3.5 font-heading text-[13px] font-bold text-primary transition-colors hover:bg-[#F0F9F9]"
                      >
                        View Receipt
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {collectFor && (
        <CollectModal
          row={collectFor}
          onClose={() => setCollectFor(null)}
          onDone={(msg) => {
            setCollectFor(null);
            toast(msg);
            router.refresh();
          }}
        />
      )}
      {receiptFor && (
        <ReceiptModal row={receiptFor} onClose={() => setReceiptFor(null)} />
      )}
    </>
  );
}

/** Collect Payment modal — amount + method chips. */
function CollectModal({
  row,
  onClose,
  onDone,
}: {
  row: AdminPaymentRow;
  onClose: () => void;
  onDone: (msg: string) => void;
}) {
  const [amount, setAmount] = useState(String(row.due));
  const [method, setMethod] = useState<string>(row.method === "cash" ? "cash" : row.method);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0 || amt > row.due) {
      setError(`Enter an amount between 1 and ${row.due}.`);
      return;
    }
    setBusy(true);
    const res = await collectPaymentApi({ paymentId: row.id, amount: amt, method });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onDone(`${formatTaka(amt)} collected from ${row.name}`);
  }

  return (
    <ModalShell onClose={onClose} label="Collect payment">
      <div className="font-heading text-[18px] font-extrabold text-ink">
        Collect Payment
      </div>
      <div className="text-[13.5px] text-ink-muted">
        {row.name} — {row.label} · due{" "}
        <strong className="text-danger">{formatTaka(row.due)}</strong>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="font-heading text-[12.5px] font-bold text-ink">Amount (৳)</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="min-h-[50px] w-full rounded-xl border-2 border-[#E1EBF0] px-3.5 font-heading text-[18px] font-bold text-ink outline-none transition-colors focus:border-primary"
        />
      </label>
      <div className="flex flex-col gap-1.5">
        <span className="font-heading text-[12.5px] font-bold text-ink">Method</span>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHOD.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={cn(
                "min-h-[46px] rounded-[11px] border-2 px-4 font-heading text-[13px] font-bold uppercase transition-colors",
                method === m
                  ? "border-primary bg-primary text-white"
                  : "border-[#E1EBF0] bg-white text-ink-muted hover:border-primary/40",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-[13.5px] text-danger">{error}</p>}
      <button
        type="button"
        disabled={busy}
        onClick={submit}
        className="min-h-[52px] rounded-xl bg-cta font-heading text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(255,122,89,0.35)] transition-colors hover:bg-cta-dark disabled:opacity-60"
      >
        {busy ? "Recording…" : "Record Payment ✓"}
      </button>
    </ModalShell>
  );
}

/** Receipt modal — transaction list for a paid bill. */
function ReceiptModal({
  row,
  onClose,
}: {
  row: AdminPaymentRow;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose} label="Receipt">
      <div className="font-heading text-[18px] font-extrabold text-ink">Receipt</div>
      <div className="text-[13.5px] text-ink-muted">
        {row.name} — {row.label}
      </div>
      <div className="flex flex-col gap-1">
        {row.transactions.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-[#EDF4F7] px-1 py-2.5 text-[14px] last:border-b-0"
          >
            <span className="text-ink-muted">
              {t.atLabel} · <span className="uppercase">{t.method}</span>
            </span>
            <span className="font-heading font-bold text-ink">
              {formatTaka(t.amount)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl bg-[#F0FBF4] px-4 py-3">
        <span className="font-heading text-[14px] font-extrabold text-success">
          TOTAL PAID
        </span>
        <span className="font-heading text-[20px] font-extrabold text-success">
          {formatTaka(row.paid)}
        </span>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  children,
  onClose,
  label,
}: {
  children: React.ReactNode;
  onClose: () => void;
  label: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-6"
      onClick={onClose}
    >
      <div
        className="flex w-[420px] max-w-full animate-scale-in flex-col gap-3.5 rounded-[20px] bg-white p-6 shadow-[0_24px_60px_rgba(26,43,60,0.35)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        {children}
      </div>
    </div>
  );
}
