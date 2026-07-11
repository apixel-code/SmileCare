import Link from "next/link";
import { CLINIC } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** SmileCare wordmark — teal "S" tile + name. Shared by Navbar and Footer. */
export function Logo({
  onDark = false,
  href = "/",
}: {
  onDark?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary font-heading text-[19px] font-extrabold text-white">
        {CLINIC.shortName.charAt(0)}
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "block font-heading text-[18px] font-bold",
            onDark ? "text-white" : "text-ink",
          )}
        >
          {CLINIC.shortName}
        </span>
        <span
          className={cn(
            "block text-[11px] tracking-[0.06em]",
            onDark ? "text-white/60" : "text-ink-muted",
          )}
        >
          {CLINIC.tagline}
        </span>
      </span>
    </Link>
  );
}
