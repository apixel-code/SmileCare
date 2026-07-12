import type { Metadata } from "next";
import { getTodayQueue } from "@/server/services/admin.service";
import { QueueTable } from "@/components/features/admin/QueueTable";

export const metadata: Metadata = { title: "Today's Queue" };
export const dynamic = "force-dynamic";

const CHIPS = [
  { key: "total", label: "Total Today", dot: "bg-primary" },
  { key: "completed", label: "Completed", dot: "bg-success" },
  { key: "waiting", label: "Waiting", dot: "bg-warning" },
  { key: "noShow", label: "No-show", dot: "bg-[#94A3B8]" },
] as const;

export default async function AdminQueuePage() {
  const queue = await getTodayQueue();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-3.5">
        {CHIPS.map((c) => (
          <div
            key={c.key}
            className="flex items-center gap-3 rounded-[14px] border border-[#E1EBF0] bg-white px-5 py-3.5 shadow-[0_2px_8px_rgba(26,43,60,0.04)]"
          >
            <span className={`inline-block h-3 w-3 rounded-full ${c.dot}`} />
            <span className="font-heading text-[24px] font-extrabold text-ink">
              {queue.stats[c.key]}
            </span>
            <span className="text-[14px] text-ink-muted">{c.label}</span>
          </div>
        ))}
      </div>

      <QueueTable rows={queue.rows} />
    </div>
  );
}
