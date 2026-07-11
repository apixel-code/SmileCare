import { WhatsAppIcon } from "@/components/ui/icons";
import { WHATSAPP_URL } from "@/lib/constants";

/** Fixed WhatsApp bubble — bottom-right on all public pages. */
export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[70] flex h-[60px] w-[60px] items-center justify-center rounded-full bg-whatsapp shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-colors hover:bg-whatsapp-dark"
    >
      <WhatsAppIcon size={30} color="#fff" />
    </a>
  );
}
