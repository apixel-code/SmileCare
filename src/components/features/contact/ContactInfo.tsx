import { Card } from "@/components/ui/Card";
import { PhoneIcon, WhatsAppIcon, ClockIcon } from "@/components/ui/icons";
import { CLINIC, WHATSAPP_URL } from "@/lib/constants";
import { getPublicClinicInfo } from "@/server/repositories/settings.repository";

/** Clinic contact details — address, call, WhatsApp, chamber hours. */
export async function ContactInfo() {
  const clinic = await getPublicClinicInfo();
  const telHref = `tel:${clinic.phoneDisplay.replace(/[\s-]/g, "")}`;
  return (
    <div className="flex flex-col gap-4">
      <Card className="px-6 py-[22px]">
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-primary">
          Address
        </div>
        <div className="text-[15.5px] leading-[1.7] text-ink">
          {clinic.address}
        </div>
      </Card>

      <a href={telHref}>
        <Card hoverable className="flex items-center gap-4 px-6 py-[22px]">
          <IconTile>
            <PhoneIcon size={20} />
          </IconTile>
          <div>
            <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-primary">
              Call Now
            </div>
            <div className="font-heading text-[19px] font-extrabold text-ink">
              {clinic.phoneDisplay}
            </div>
          </div>
        </Card>
      </a>

      <a href={WHATSAPP_URL}>
        <Card hoverable className="flex items-center gap-4 px-6 py-[22px]">
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-[#F0FBF4]">
            <WhatsAppIcon size={20} color="#25D366" />
          </span>
          <div>
            <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-primary">
              WhatsApp
            </div>
            <div className="font-heading text-[16px] font-bold text-ink">
              Chat with us — we reply fast
            </div>
          </div>
        </Card>
      </a>

      <Card className="px-6 py-[22px]">
        <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-primary">
          <ClockIcon size={16} /> Chamber Hours
        </div>
        <div className="flex flex-col gap-2">
          {CLINIC.hours.map((h) => (
            <div key={h.label} className="flex justify-between text-[15px]">
              <span className={h.off ? "text-ink-muted" : "text-ink"}>
                {h.label}
              </span>
              <span className="font-semibold text-ink">{h.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary-light text-primary">
      {children}
    </span>
  );
}
