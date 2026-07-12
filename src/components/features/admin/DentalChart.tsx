"use client";

import { useState } from "react";
import { saveTooth } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

/**
 * Adult dental chart — 32 teeth (universal numbering), click to cycle
 * healthy → cavity → filled → extracted → crown → healthy. Saves per click.
 */
type Cond = "cavity" | "filled" | "extracted" | "crown";
const CYCLE: Array<Cond | null> = [null, "cavity", "filled", "extracted", "crown"];

const META: Record<string, { bg: string; border: string; num: string; label: string }> = {
  healthy: { bg: "bg-[#FDFEFE]", border: "border-[#D5E3EA]", num: "text-ink-muted", label: "Healthy" },
  cavity: { bg: "bg-[#F8D7D7]", border: "border-[#D64545]", num: "text-[#A83232]", label: "Cavity" },
  filled: { bg: "bg-[#D6E6F7]", border: "border-[#3B78C2]", num: "text-[#2A5A96]", label: "Filled" },
  extracted: { bg: "bg-[#E4E8EC]", border: "border-[#94A3B8]", num: "text-[#94A3B8]", label: "Extracted" },
  crown: { bg: "bg-[#F6E7C4]", border: "border-[#C9A036]", num: "text-[#8A6D2B]", label: "Crown" },
};

export function DentalChart({
  patientId,
  initial,
}: {
  patientId: string;
  initial: Record<number, string>;
}) {
  const toast = useToast();
  const [teeth, setTeeth] = useState<Record<number, string>>(initial);

  async function cycle(toothNo: number) {
    const raw = teeth[toothNo] ?? null; // may be "other" from DB
    const current = CYCLE.includes(raw as Cond) ? (raw as Cond) : null;
    const idx = CYCLE.indexOf(current);
    const next = CYCLE[(idx + 1) % CYCLE.length];

    // optimistic
    setTeeth((t) => {
      const copy = { ...t };
      if (next === null) delete copy[toothNo];
      else copy[toothNo] = next;
      return copy;
    });

    const res = await saveTooth({ patientId, toothNo, condition: next });
    if (!res.ok) {
      toast(res.error);
      setTeeth((t) => {
        const copy = { ...t };
        if (raw === null) delete copy[toothNo];
        else copy[toothNo] = raw;
        return copy;
      });
    }
  }

  const renderRow = (nums: number[], upper: boolean) => (
    <div className="grid w-full max-w-[900px] grid-cols-8 gap-1.5 md:grid-cols-[repeat(16,minmax(0,1fr))]">
      {nums.map((n) => {
        const cond = teeth[n] ?? "healthy";
        const m = META[cond] ?? META.healthy;
        return (
          <button
            key={n}
            type="button"
            title={`Tooth ${n}: ${m.label} — click to change`}
            onClick={() => cycle(n)}
            className={cn(
              "flex aspect-[0.8] items-center justify-center border-[1.5px] transition-colors",
              upper ? "rounded-t-lg rounded-b-xl" : "rounded-t-xl rounded-b-lg",
              m.bg,
              m.border,
            )}
          >
            <span className={cn("font-heading text-[11px] font-bold", m.num)}>
              {n}
            </span>
          </button>
        );
      })}
    </div>
  );

  const upper = Array.from({ length: 16 }, (_, i) => i + 1);
  const lower = Array.from({ length: 16 }, (_, i) => 32 - i);

  return (
    <div className="rounded-2xl border border-[#E1EBF0] bg-white p-6 shadow-soft">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="font-heading text-[16px] font-extrabold text-ink">
          Adult Dental Chart{" "}
          <span className="text-[12.5px] font-medium text-ink-muted">
            — click a tooth to change its condition
          </span>
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(META).map(([key, m]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted"
            >
              <span
                className={cn(
                  "inline-block h-3.5 w-3.5 rounded border",
                  m.bg,
                  m.border,
                )}
              />
              {m.label}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-[11.5px] font-semibold tracking-[0.1em] text-[#94A3B8]">
          UPPER JAW
        </div>
        {renderRow(upper, true)}
        {renderRow(lower, false)}
        <div className="text-[11.5px] font-semibold tracking-[0.1em] text-[#94A3B8]">
          LOWER JAW
        </div>
      </div>
    </div>
  );
}
