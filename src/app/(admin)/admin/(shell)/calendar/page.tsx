import type { Metadata } from "next";
import Link from "next/link";
import { getWeekCalendar } from "@/server/services/admin.service";
import { todayKey } from "@/server/services/portal.service";
import { SLOT_TIMES, CLOSED_WEEKDAY, DEFAULT_DOCTOR } from "@/lib/booking";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Appointment Calendar" };
export const dynamic = "force-dynamic";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface DayCol {
  key: string;
  day: string;
  num: string;
  isToday: boolean;
}

/** 6 open days (Friday skipped) starting from today + offset weeks. */
function weekDays(offsetWeeks: number): DayCol[] {
  const today = todayKey();
  const [y, m, d] = today.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d) + offsetWeeks * 7 * 86_400_000;
  const out: DayCol[] = [];
  for (let i = 0; out.length < 6 && i < 9; i++) {
    const dt = new Date(base + i * 86_400_000);
    if (dt.getUTCDay() === CLOSED_WEEKDAY) continue;
    const key = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
    out.push({
      key,
      day: DAY_NAMES[dt.getUTCDay()],
      num: `${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]}`,
      isToday: key === today,
    });
  }
  return out;
}

const CELL_STYLE: Record<string, { bg: string; edge: string; text: string }> = {
  waiting: { bg: "bg-[#D9F0EF]", edge: "border-l-primary", text: "text-primary-dark" },
  in_chamber: { bg: "bg-[#D9F0EF]", edge: "border-l-primary", text: "text-primary-dark" },
  completed: { bg: "bg-[#EEF1F4]", edge: "border-l-[#94A3B8]", text: "text-ink-muted" },
  no_show: { bg: "bg-[#FEF0E7]", edge: "border-l-cta", text: "text-cta-dark" },
};

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ w?: string }>;
}) {
  const { w = "0" } = await searchParams;
  const offset = Number(w) || 0;
  const days = weekDays(offset);
  const map = await getWeekCalendar(days[0].key, days[days.length - 1].key);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/calendar?w=${offset - 1}`}
            className="flex h-11 w-11 items-center justify-center rounded-[11px] border border-[#E1EBF0] bg-white text-[16px] text-ink transition-colors hover:border-primary"
          >
            ←
          </Link>
          <span className="font-heading text-[17px] font-extrabold text-ink">
            {days[0].num} – {days[days.length - 1].num}
          </span>
          <Link
            href={`/admin/calendar?w=${offset + 1}`}
            className="flex h-11 w-11 items-center justify-center rounded-[11px] border border-[#E1EBF0] bg-white text-[16px] text-ink transition-colors hover:border-primary"
          >
            →
          </Link>
        </div>
        <span className="rounded-[11px] border-2 border-primary bg-primary-light px-4 py-2.5 font-heading text-[13px] font-bold text-primary">
          {DEFAULT_DOCTOR.name}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E1EBF0] bg-white shadow-soft">
        <div className="min-w-[900px]">
          {/* Day headers */}
          <div className="grid grid-cols-[70px_repeat(6,minmax(0,1fr))] border-b border-[#E1EBF0] bg-[#F7FBFC]">
            <div />
            {days.map((d) => (
              <div
                key={d.key}
                className="border-l border-[#EDF4F7] px-2.5 py-3 text-center"
              >
                <div className="text-[11.5px] font-semibold text-ink-muted">
                  {d.day}
                </div>
                <div
                  className={cn(
                    "font-heading text-[15px] font-extrabold",
                    d.isToday ? "text-primary" : "text-ink",
                  )}
                >
                  {d.num}
                </div>
              </div>
            ))}
          </div>

          {/* Slot rows */}
          {SLOT_TIMES.map((time) => (
            <div
              key={time}
              className="grid min-h-[52px] grid-cols-[70px_repeat(6,minmax(0,1fr))] border-b border-[#F1F5F8] last:border-b-0"
            >
              <div className="px-2.5 py-2 text-right font-heading text-[11.5px] font-bold text-[#94A3B8]">
                {time}
              </div>
              {days.map((d) => {
                const cells = map[d.key]?.[time] ?? [];
                return (
                  <div key={d.key} className="border-l border-[#F1F5F8] p-[3px]">
                    {cells.map((c, i) => {
                      const st = CELL_STYLE[c.status] ?? CELL_STYLE.completed;
                      return (
                        <div
                          key={i}
                          title={`${c.name} — ${c.service}`}
                          className={cn(
                            "mb-[3px] overflow-hidden rounded-lg border-l-[3px] px-2 py-1 last:mb-0",
                            st.bg,
                            st.edge,
                          )}
                        >
                          <div className={cn("truncate font-heading text-[11.5px] font-bold", st.text)}>
                            {c.name}
                          </div>
                          <div className="truncate text-[10.5px] text-ink-muted">
                            {c.service}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <Legend bg="bg-[#D9F0EF]" edge="border-l-primary" label="Confirmed" />
        <Legend bg="bg-[#FEF0E7]" edge="border-l-cta" label="No-show" />
        <Legend bg="bg-[#EEF1F4]" edge="border-l-[#94A3B8]" label="Completed" />
      </div>
    </div>
  );
}

function Legend({ bg, edge, label }: { bg: string; edge: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[12.5px] text-ink-muted">
      <span className={cn("inline-block h-[13px] w-[13px] rounded border-l-[3px]", bg, edge)} />
      {label}
    </span>
  );
}
