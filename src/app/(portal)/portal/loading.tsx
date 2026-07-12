/** Instant skeleton for portal pages while member data loads. */
export default function PortalLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-[#F7FBFC]" aria-busy aria-label="Loading">
      <div className="bg-primary px-5 pb-16 pt-5 md:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <div className="mb-2 h-3 w-24 rounded bg-white/25" />
            <div className="h-6 w-44 rounded bg-white/35" />
          </div>
          <div className="h-12 w-32 rounded-xl bg-white/20" />
        </div>
      </div>
      <div className="mx-auto -mt-12 flex max-w-2xl flex-col gap-6 px-5 pb-12 md:px-8">
        <div className="h-[170px] rounded-2xl bg-white shadow-[0_12px_34px_rgba(26,43,60,0.08)]" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[96px] rounded-2xl border border-[#EDF4F7] bg-white" />
          ))}
        </div>
        <div className="h-[120px] rounded-2xl border border-[#EDF4F7] bg-white" />
      </div>
    </div>
  );
}
