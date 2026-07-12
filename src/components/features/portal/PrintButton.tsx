"use client";

/** Opens the browser print dialog — users save the prescription as PDF. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-4 font-heading text-[13px] font-bold text-white transition-colors hover:bg-primary-dark print:hidden"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v10m0 0 4-4m-4 4-4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 19h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
      PDF
    </button>
  );
}
