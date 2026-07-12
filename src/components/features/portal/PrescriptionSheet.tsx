import { CLINIC, DOCTOR } from "@/lib/constants";
import type { MyPrescription } from "@/server/services/portal.service";

/** Clinic-letterhead prescription — matches the portal design; print-friendly. */
export function PrescriptionSheet({ rx }: { rx: MyPrescription }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_34px_rgba(26,43,60,0.1)] print:rounded-none print:shadow-none">
      {/* Letterhead */}
      <div className="flex items-center justify-between gap-4 bg-primary px-6 py-5 print:bg-primary">
        <div className="flex items-center gap-3">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[11px] bg-white font-heading text-[19px] font-extrabold text-primary">
            {CLINIC.shortName.charAt(0)}
          </div>
          <div>
            <div className="font-heading text-[16px] font-extrabold text-white">
              {CLINIC.name}
            </div>
            <div className="text-[11px] text-white/75">
              {CLINIC.address} • {CLINIC.phoneDisplay}
            </div>
          </div>
        </div>
      </div>

      {/* Doctor bar */}
      <div className="flex items-baseline justify-between gap-2 border-b border-[#EDF4F7] px-6 py-3.5">
        <div className="font-heading text-[14px] font-bold text-ink">
          {rx.doctorName}
        </div>
        <div className="text-[11.5px] text-ink-muted">
          BDS, FCPS • BMDC Reg. {DOCTOR.bmdcReg}
        </div>
      </div>

      {/* Patient bar */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-[#EDF4F7] bg-[#F7FBFC] px-6 py-3">
        <Meta label="Patient" value={rx.patientName} />
        {rx.patientAge !== undefined && (
          <Meta label="Age" value={String(rx.patientAge)} />
        )}
        <Meta label="Date" value={rx.dateLabel} />
        {rx.diagnosis && <Meta label="Dx" value={rx.diagnosis} />}
      </div>

      {/* Medicines */}
      <div className="px-6 py-[18px]">
        <div className="mb-3 font-heading text-[13px] font-extrabold tracking-[0.08em] text-primary">
          ℞ MEDICINES
        </div>
        <div className="overflow-hidden rounded-xl border border-[#EDF4F7]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F7FBFC]">
                <Th>Medicine</Th>
                <Th>Dosage</Th>
                <Th>Duration</Th>
              </tr>
            </thead>
            <tbody>
              {rx.medicines.map((med) => (
                <tr key={med.name} className="border-t border-[#EDF4F7]">
                  <td className="px-3.5 py-3 text-[13.5px] font-semibold text-ink">
                    {med.name}
                  </td>
                  <td className="px-3.5 py-3 text-[13px] text-ink">
                    <span className="font-heading font-bold text-primary">
                      {med.dose}
                    </span>
                    <br />
                    <span className="text-[11.5px] text-ink-muted">
                      {med.afterMeal ? "after meals" : "before meals"}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-[13px] text-ink">
                    {med.durationDays} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advice */}
      {rx.advice.length > 0 && (
        <div className="px-6 pb-[18px]">
          <div className="mb-2.5 font-heading text-[13px] font-extrabold tracking-[0.08em] text-primary">
            DOCTOR&rsquo;S ADVICE
          </div>
          <ul className="flex list-disc flex-col gap-1.5 pl-5">
            {rx.advice.map((a) => (
              <li key={a} className="text-[13.5px] leading-[1.65] text-ink">
                {a}
              </li>
            ))}
            {rx.nextVisitDate && (
              <li className="text-[13.5px] leading-[1.65] font-semibold text-ink">
                Next visit: {rx.nextVisitDate}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Signature */}
      <div className="flex justify-end px-6 pb-[22px] pt-2">
        <div className="text-center">
          <div className="rotate-[-3deg] font-[cursive] text-[24px] text-primary">
            {rx.doctorName
              .replace("Dr. ", "")
              .split(" ")
              .map((w, i, arr) => (i < arr.length - 1 ? `${w.charAt(0)}.` : w))
              .join(" ")}
          </div>
          <div className="mt-1 border-t-[1.5px] border-ink pt-1.5 text-[11.5px] leading-snug text-ink-muted">
            {rx.doctorName}
            <br />
            BDS, FCPS
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[12.5px] text-ink-muted">
      {label}: <strong className="text-ink">{value}</strong>
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3.5 py-2.5 font-heading text-[12px] font-bold text-ink-muted">
      {children}
    </th>
  );
}
