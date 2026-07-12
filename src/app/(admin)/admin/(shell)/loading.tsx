/**
 * Instant skeleton for every admin screen — appears the moment a sidebar
 * link is clicked, while the server fetches real data.
 */
export default function AdminLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-5" aria-busy aria-label="Loading">
      {/* stat chips */}
      <div className="flex flex-wrap gap-3.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[62px] w-[170px] rounded-[14px] border border-[#E1EBF0] bg-white"
          />
        ))}
      </div>
      {/* table */}
      <div className="overflow-hidden rounded-2xl border border-[#E1EBF0] bg-white">
        <div className="h-[44px] bg-[#F7FBFC]" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 border-t border-[#EDF4F7] px-5 py-4">
            <div className="h-7 w-12 rounded-lg bg-[#EDF2F5]" />
            <div className="flex-1">
              <div className="mb-2 h-3.5 w-1/3 rounded bg-[#EDF2F5]" />
              <div className="h-3 w-1/4 rounded bg-[#F1F5F8]" />
            </div>
            <div className="h-8 w-24 rounded-full bg-[#F1F5F8]" />
            <div className="h-10 w-32 rounded-[11px] bg-[#EDF2F5]" />
          </div>
        ))}
      </div>
    </div>
  );
}
