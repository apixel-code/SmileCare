import { WhatsAppIcon } from "@/components/ui/icons";
import { WHATSAPP_URL } from "@/lib/constants";

/** Sticky bottom bar prompting a free WhatsApp consult (Services page). */
export function ServicesWhatsAppBar() {
  return (
    <div className="sticky bottom-0 z-40 bg-ink shadow-[0_-8px_24px_rgba(26,43,60,0.2)]">
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-5 px-5 py-3.5 md:px-8">
        <div className="text-center text-[15.5px] text-white">
          Not sure which treatment you need?{" "}
          <span className="text-white/70">Ask us — it&rsquo;s free.</span>
        </div>
        <a
          href={WHATSAPP_URL}
          className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-whatsapp px-6 font-heading text-[15px] font-bold text-white transition-colors hover:bg-whatsapp-dark"
        >
          <WhatsAppIcon size={20} color="#fff" /> Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}
