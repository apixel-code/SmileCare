import { WhatsAppIcon } from "@/components/ui/icons";
import { WHATSAPP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** White outline WhatsApp button (green border) — reused across marketing pages. */
export function WhatsAppButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <a
      href={WHATSAPP_URL}
      className={cn(
        "inline-flex h-14 items-center gap-2.5 rounded-xl border border-whatsapp/30 bg-white px-7 font-heading text-[16px] font-semibold text-ink shadow-soft transition-colors hover:bg-[#F0FBF4] hover:border-whatsapp/50",
        className,
      )}
    >
      <WhatsAppIcon color="#25D366" /> {label}
    </a>
  );
}
