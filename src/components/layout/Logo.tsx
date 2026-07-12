import Link from "next/link";
import { CLINIC } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** SmileCare wordmark — teal tile + name. Shared by Navbar and Footer.
 *  `name` overrides the default (live clinic name from settings). */
export function Logo({
  onDark = false,
  href = "/",
  name = CLINIC.shortName,
}: {
  onDark?: boolean;
  href?: string;
  name?: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary font-heading text-[19px] font-extrabold text-white">
        {name.charAt(0)}
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "block font-heading text-[18px] font-bold",
            onDark ? "text-white" : "text-ink",
          )}
        >
          {name}
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
