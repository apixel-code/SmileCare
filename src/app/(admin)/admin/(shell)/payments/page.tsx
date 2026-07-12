import type { Metadata } from "next";
import { getPaymentsScreen } from "@/server/services/payments.service";
import { PaymentsTable } from "@/components/features/admin/PaymentsTable";
import { formatTaka } from "@/lib/constants";

export const metadata: Metadata = { title: "Payments" };
export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const { rows, stats } = await getPaymentsScreen();

  const cards = [
    { label: "Collected Today", value: formatTaka(stats.today), color: "text-ink" },
    { label: "Collected This Month", value: formatTaka(stats.month), color: "text-ink" },
    { label: "Total Due", value: formatTaka(stats.totalDue), color: "text-danger" },
    { label: "Pending Bills", value: String(stats.pendingCount), color: "text-warning" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-[#E1EBF0] bg-white px-5 py-5 shadow-soft"
          >
            <div className="mb-2 text-[13px] text-ink-muted">{c.label}</div>
            <div className={`font-heading text-[26px] font-extrabold ${c.color}`}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      <PaymentsTable rows={rows} />
    </div>
  );
}
