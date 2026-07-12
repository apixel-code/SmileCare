"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { savePrescription } from "@/lib/api";
import { COMMON_MEDICINES, DOSE_PRESETS } from "@/lib/medicines";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface RxItem {
  name: string;
  dose: string;
  durationDays: number;
  afterMeal: boolean;
}

const fieldCls =
  "w-full min-h-[50px] rounded-xl border-2 border-[#E1EBF0] bg-white px-4 text-[15px] text-ink outline-none transition-colors focus:border-primary";
const labelCls = "font-heading text-[13px] font-bold text-ink";

/** Write-new-prescription panel — search, dose chips, duration, advice. */
export function RxWriter({ patientId }: { patientId: string }) {
  const router = useRouter();
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [dose, setDose] = useState<string>(DOSE_PRESETS[0]);
  const [afterMeal, setAfterMeal] = useState(true);
  const [duration, setDuration] = useState("7");
  const [items, setItems] = useState<RxItem[]>([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("");
  const [busy, setBusy] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return COMMON_MEDICINES.filter(
      (m) => m.toLowerCase().includes(q) && !items.some((i) => i.name === m),
    ).slice(0, 5);
  }, [query, items]);

  const days = Number(duration);
  const canAdd = query.trim().length >= 2 && Number.isFinite(days) && days > 0;

  function add() {
    if (!canAdd) return;
    setItems((list) => [
      ...list,
      { name: query.trim(), dose, durationDays: days, afterMeal },
    ]);
    setQuery("");
  }

  async function save() {
    setBusy(true);
    const res = await savePrescription({
      patientId,
      diagnosis: diagnosis.trim() || undefined,
      medicines: items,
      advice: advice
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean),
    });
    setBusy(false);
    if (!res.ok) {
      toast(res.error);
      return;
    }
    toast("Prescription saved — visible in the patient's portal");
    setItems([]);
    setDiagnosis("");
    setAdvice("");
    router.refresh();
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Writer */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E1EBF0] bg-white p-6 shadow-soft">
        <div className="font-heading text-[16px] font-extrabold text-ink">
          Write New Prescription
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelCls}>Diagnosis (optional)</span>
          <input
            className={fieldCls}
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Irreversible pulpitis (lower left molar)"
          />
        </label>

        <div className="relative flex flex-col gap-2">
          <span className={labelCls}>Medicine</span>
          <input
            className={fieldCls}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search… e.g. Amox"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-[84px] left-0 right-0 z-20 overflow-hidden rounded-xl border border-[#E1EBF0] bg-white shadow-[0_12px_30px_rgba(26,43,60,0.15)]">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="block w-full border-b border-[#F1F5F8] px-4 py-3 text-left text-[14px] text-ink transition-colors last:border-b-0 hover:bg-[#F0F9F9]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className={labelCls}>Dosage</span>
          <div className="flex flex-wrap gap-2">
            {DOSE_PRESETS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDose(d)}
                className={cn(
                  "min-h-[46px] rounded-[11px] border-2 px-5 font-heading text-[15px] font-extrabold transition-colors",
                  dose === d
                    ? "border-primary bg-primary text-white"
                    : "border-[#E1EBF0] bg-white text-ink hover:border-primary/40",
                )}
              >
                {d}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAfterMeal((v) => !v)}
              className="min-h-[46px] rounded-[11px] border-2 border-[#E1EBF0] bg-white px-4 font-heading text-[13px] font-bold text-ink-muted transition-colors hover:border-primary/40"
            >
              {afterMeal ? "After meals" : "Before meals"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-3.5">
          <label className="flex flex-col gap-2">
            <span className={labelCls}>Duration (days)</span>
            <input
              className={fieldCls}
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="7"
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              disabled={!canAdd}
              onClick={add}
              className={cn(
                "min-h-[50px] w-full rounded-xl font-heading text-[14.5px] font-bold text-white transition-colors",
                canAdd
                  ? "bg-primary hover:bg-primary-dark"
                  : "cursor-not-allowed bg-[#9CC5C4]",
              )}
            >
              + Add to Prescription
            </button>
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelCls}>Advice (one per line)</span>
          <textarea
            className={cn(fieldCls, "min-h-[80px] resize-none py-3 leading-relaxed")}
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder={"Warm salt-water rinse twice daily.\nAvoid chewing on the treated side."}
          />
        </label>

        <button
          type="button"
          disabled={items.length === 0 || busy}
          onClick={save}
          className={cn(
            "min-h-[52px] rounded-xl font-heading text-[15px] font-bold text-white transition-colors",
            items.length > 0 && !busy
              ? "bg-cta hover:bg-cta-dark shadow-[0_4px_14px_rgba(255,122,89,0.35)]"
              : "cursor-not-allowed bg-[#F0B4A2]",
          )}
        >
          {busy ? "Saving…" : "Save Prescription ✓"}
        </button>
      </div>

      {/* Current list */}
      <div className="rounded-2xl border border-[#E1EBF0] bg-white p-6 shadow-soft">
        <div className="mb-3.5 font-heading text-[15px] font-extrabold text-primary">
          ℞ Current Prescription
        </div>
        {items.length === 0 ? (
          <div className="py-6 text-center text-[13.5px] text-[#94A3B8]">
            No medicines added yet.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {items.map((rx, i) => (
              <div
                key={`${rx.name}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-[#EDF4F7] px-3.5 py-3"
              >
                <div className="flex-1">
                  <div className="text-[13.5px] font-semibold text-ink">
                    {rx.name}
                  </div>
                  <div className="mt-0.5 text-[12px] text-ink-muted">
                    <span className="font-heading font-bold text-primary">
                      {rx.dose}
                    </span>{" "}
                    • {rx.durationDays} days •{" "}
                    {rx.afterMeal ? "after meals" : "before meals"}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => setItems((l) => l.filter((_, j) => j !== i))}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-[#E1EBF0] text-[14px] text-ink-muted transition-colors hover:border-danger hover:text-danger"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
