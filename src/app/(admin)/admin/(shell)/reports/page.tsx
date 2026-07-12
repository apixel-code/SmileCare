import type { Metadata } from "next";
import { getMonthlyReport } from "@/server/services/reports.service";
import { formatTaka } from "@/lib/constants";

export const metadata: Metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

const BAR_COLORS = ["#0E7C7B", "#2A9D9C", "#5BB8B7", "#8CD0CF", "#BCE4E3"];

export default async function AdminReportsPage() {
  const report = await getMonthlyReport();
  const { kpis, popularServices, newVsReturning, revenueTrend } = report;

  const kpiCards = [
    { label: "Patients This Month", value: String(kpis.patientsThisMonth) },
    { label: "Revenue This Month", value: formatTaka(kpis.revenueThisMonth) },
    { label: "Total Due", value: formatTaka(kpis.totalDue) },
    { label: "New Patients", value: String(kpis.newPatients) },
  ];

  const maxCount = Math.max(1, ...popularServices.map((s) => s.count));

  // Donut math
  const totalVisitors = newVsReturning.newCount + newVsReturning.returningCount;
  const returningPct =
    totalVisitors === 0
      ? 0
      : Math.round((newVsReturning.returningCount / totalVisitors) * 100);

  // Line chart math (600×220 viewBox, y 30..180)
  const maxRev = Math.max(1, ...revenueTrend.map((r) => r.amount));
  const pts = revenueTrend.map((r, i) => ({
    x: 70 + i * 104,
    y: 180 - (r.amount / maxRev) * 145,
    label: r.label,
    amount: r.amount,
  }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${pts[0].x},180 ${line} ${pts[pts.length - 1].x},180`;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[13.5px] font-semibold text-ink-muted">
        Monthly Report — {report.monthLabel}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiCards.map((k) => (
          <div key={k.label} className="rounded-2xl border border-[#E1EBF0] bg-white px-6 py-5 shadow-soft">
            <div className="mb-2 text-[13px] text-ink-muted">{k.label}</div>
            <div className="font-heading text-[30px] font-extrabold text-ink">
              {k.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Popular services — bars */}
        <div className="rounded-2xl border border-[#E1EBF0] bg-white p-6 shadow-soft">
          <div className="mb-5 font-heading text-[15px] font-extrabold text-ink">
            Most Popular Services
          </div>
          {popularServices.length === 0 ? (
            <div className="py-8 text-center text-[13.5px] text-[#94A3B8]">
              No appointments this month yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {popularServices.map((s, i) => (
                <div
                  key={s.label}
                  className="grid grid-cols-[130px_minmax(0,1fr)_40px] items-center gap-3"
                >
                  <div className="truncate text-right text-[13px] font-medium text-ink">
                    {s.label}
                  </div>
                  <div className="h-[26px] overflow-hidden rounded-[7px] bg-[#F1F5F8]">
                    <div
                      className="h-full rounded-[7px]"
                      style={{
                        width: `${(s.count / maxCount) * 100}%`,
                        background: BAR_COLORS[i % BAR_COLORS.length],
                      }}
                    />
                  </div>
                  <div className="font-heading text-[14px] font-extrabold text-ink">
                    {s.count}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New vs returning — donut */}
        <div className="flex flex-col rounded-2xl border border-[#E1EBF0] bg-white p-6 shadow-soft">
          <div className="mb-3 font-heading text-[15px] font-extrabold text-ink">
            New vs Returning Patients
          </div>
          {totalVisitors === 0 ? (
            <div className="flex flex-1 items-center justify-center py-8 text-[13.5px] text-[#94A3B8]">
              No visitors this month yet.
            </div>
          ) : (
            <div className="flex flex-1 flex-wrap items-center justify-center gap-7">
              <svg width="150" height="150" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.9" fill="none" stroke="#E8F4F8" strokeWidth="6" />
                <circle
                  cx="21"
                  cy="21"
                  r="15.9"
                  fill="none"
                  stroke="#0E7C7B"
                  strokeWidth="6"
                  strokeDasharray={`${returningPct} ${100 - returningPct}`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
                <text x="21" y="20" textAnchor="middle" fontWeight="800" fontSize="8" fill="#1A2B3C">
                  {returningPct}%
                </text>
                <text x="21" y="27" textAnchor="middle" fontSize="3.4" fill="#64748B">
                  returning
                </text>
              </svg>
              <div className="flex flex-col gap-2.5 text-[13px] text-ink">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded bg-primary" />
                  Returning — {newVsReturning.returningCount}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded border border-[#CBDDE4] bg-primary-light" />
                  New — {newVsReturning.newCount}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revenue trend — line */}
      <div className="rounded-2xl border border-[#E1EBF0] bg-white p-6 shadow-soft">
        <div className="mb-4 font-heading text-[15px] font-extrabold text-ink">
          Revenue Trend — Last 6 Months
        </div>
        <svg width="100%" height="220" viewBox="0 0 640 220" preserveAspectRatio="none">
          {[180, 130, 80, 30].map((y) => (
            <line key={y} x1="40" y1={y} x2="620" y2={y} stroke={y === 180 ? "#E1EBF0" : "#F1F5F8"} strokeWidth="1" />
          ))}
          <polyline points={area} fill="rgba(14,124,123,0.08)" stroke="none" />
          <polyline
            points={line}
            fill="none"
            stroke="#0E7C7B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {pts.map((p) => (
            <g key={p.label}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke="#0E7C7B" strokeWidth="3" />
              <text x={p.x} y="205" textAnchor="middle" fontSize="11" fill="#64748B">
                {p.label}
              </text>
              {p.amount > 0 && (
                <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0E7C7B">
                  ৳{p.amount >= 1000 ? `${Math.round(p.amount / 1000)}k` : p.amount}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
