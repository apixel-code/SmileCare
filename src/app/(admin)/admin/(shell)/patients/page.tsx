import type { Metadata } from "next";
import Link from "next/link";
import { adminSearchPatients } from "@/server/services/admin.service";
import { displayPhone } from "@/lib/utils";

export const metadata: Metadata = { title: "Patients" };
export const dynamic = "force-dynamic";

export default async function AdminPatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  const { items, total } = await adminSearchPatients(q, pageNum);
  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <form method="GET" className="flex gap-2.5">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name or phone…"
          className="h-[50px] w-full max-w-md rounded-xl border-2 border-[#E1EBF0] bg-white px-4 text-[15px] text-ink outline-none transition-colors focus:border-primary"
        />
        <button
          type="submit"
          className="h-[50px] rounded-xl bg-primary px-6 font-heading text-[14px] font-bold text-white transition-colors hover:bg-primary-dark"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E1EBF0] bg-white shadow-soft">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E1EBF0] bg-[#F7FBFC]">
              {["PATIENT", "PHONE", "AGE", "BLOOD", "ALLERGIES", ""].map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 font-heading text-[12px] font-bold tracking-[0.05em] text-ink-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[14px] text-ink-muted">
                  {q ? `No patients match “${q}”.` : "No patients yet."}
                </td>
              </tr>
            )}
            {items.map((p) => (
              <tr key={p.id} className="border-b border-[#EDF4F7] last:border-b-0">
                <td className="px-4 py-3.5">
                  <Link
                    href={`/admin/patients/${p.id}`}
                    className="flex items-center gap-3 font-semibold text-ink hover:text-primary"
                  >
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary-light font-heading text-[14px] font-extrabold text-primary">
                      {p.name.charAt(0)}
                    </span>
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3.5 text-[13.5px] text-ink">
                  {displayPhone(p.phone)}
                </td>
                <td className="px-4 py-3.5 text-[13.5px] text-ink-muted">
                  {p.age ?? "—"}
                </td>
                <td className="px-4 py-3.5 text-[13.5px] text-ink-muted">
                  {p.bloodGroup ?? "—"}
                </td>
                <td className="px-4 py-3.5">
                  {p.allergies.length > 0 ? (
                    <span className="rounded-full border border-[#F5C6C6] bg-[#FDE8E8] px-3 py-1 font-heading text-[11px] font-extrabold text-[#C0392B]">
                      ⚠ {p.allergies.join(", ")}
                    </span>
                  ) : (
                    <span className="text-[13px] text-ink-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Link
                    href={`/admin/patients/${p.id}`}
                    className="font-heading text-[13px] font-bold text-primary hover:text-primary-dark"
                  >
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-3 text-[13.5px] text-ink-muted">
          {pageNum > 1 && (
            <Link
              href={`/admin/patients?q=${encodeURIComponent(q)}&page=${pageNum - 1}`}
              className="font-heading font-bold text-primary"
            >
              ← Prev
            </Link>
          )}
          Page {pageNum} of {totalPages} ({total} patients)
          {pageNum < totalPages && (
            <Link
              href={`/admin/patients?q=${encodeURIComponent(q)}&page=${pageNum + 1}`}
              className="font-heading font-bold text-primary"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
