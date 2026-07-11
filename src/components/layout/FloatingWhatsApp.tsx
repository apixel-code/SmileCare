"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/icons";
import { WHATSAPP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NUDGE } from "@/lib/motion";

/**
 * Routes that render their own sticky WhatsApp CTA (e.g. the Services bar).
 * The floating bubble is suppressed there so the two CTAs don't collide.
 */
const HIDE_ON: string[] = ["/services"];

/** Fixed WhatsApp bubble — bottom-right on public pages (except HIDE_ON routes). */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  if (HIDE_ON.includes(pathname)) return null;

  return (
    <a
      href={WHATSAPP_URL}
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-[70] flex h-[60px] w-[60px] items-center justify-center rounded-full bg-whatsapp shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:bg-whatsapp-dark",
        NUDGE,
      )}
    >
      <WhatsAppIcon size={30} color="#fff" />
    </a>
  );
}
