import { cn } from "@/lib/utils";
import { CLINIC } from "@/lib/constants";

/**
 * Google Map embed of the clinic location. Shared by Home (LocationSection)
 * and Contact. Map URLs live in CLINIC (single source).
 */
export function ClinicMap({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#E1EBF0] shadow-soft",
        className,
      )}
    >
      <iframe
        title={`${CLINIC.name} location on Google Maps`}
        src={CLINIC.mapEmbedSrc}
        className="block h-[360px] w-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <a
        href={CLINIC.mapDirectionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-5 left-5 flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-heading text-sm font-bold text-white shadow-[0_6px_18px_rgba(14,124,123,0.35)] transition-colors hover:bg-primary-dark"
      >
        Get Directions →
      </a>
    </div>
  );
}
