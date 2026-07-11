import { Button } from "@/components/ui/Button";
import { formatTaka } from "@/lib/constants";
import { BOOK_HREF } from "@/lib/navigation";
import type { ProblemSolution } from "@/types";

/** Split card: the patient's problem (left) → our solution (right). */
export function ProblemSolutionCard({ item }: { item: ProblemSolution }) {
  return (
    <div className="grid h-full grid-cols-1 overflow-hidden rounded-2xl border border-primary-light shadow-soft transition-shadow duration-300 ease-smooth hover:shadow-soft-md sm:grid-cols-2">
      {/* Problem */}
      <div className="flex flex-col gap-2.5 bg-[#F4F6F8] px-[22px] py-[26px]">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
          The problem
        </div>
        <div className="text-[16px] italic leading-[1.65] text-[#475569]">
          &ldquo;{item.pain}&rdquo;
        </div>
      </div>
      {/* Solution */}
      <div className="flex flex-col gap-2 bg-primary px-[22px] py-[26px]">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/70">
          The solution
        </div>
        <div className="font-heading text-[17px] font-bold text-white">
          {item.treatment}
        </div>
        <div className="text-[13.5px] leading-[1.6] text-white/85">
          {item.reassure}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <span className="font-heading text-[14px] font-bold text-white">
            From {formatTaka(item.feeFrom)}
          </span>
          <Button href={BOOK_HREF} variant="cta" size="sm" className="h-9 px-4 text-[13px]">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
