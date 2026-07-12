import { Logo } from "@/components/layout/Logo";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { TEL_URL, WHATSAPP_URL, DOCTOR } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEP_LABELS = [
  "Choose a service",
  "Date & time",
  "Your details",
  "Confirmation",
];

const TRUST = ["BMDC Registered", "Painless treatment", "5,000+ happy patients"];

/**
 * Desktop-only side panel (lg+) — brand, a vertical stepper, trust signals and
 * the call/WhatsApp fallback. On mobile the wizard uses its own top progress
 * bar + bottom fallback instead, so this is hidden below lg.
 */
export function BookingBrandPanel({ step }: { step: number }) {
  return (
    <aside className="hidden bg-primary p-10 text-white lg:flex lg:w-[360px] lg:flex-col">
      <Logo onDark />

      <div className="mt-10">
        <h2 className="font-heading text-[26px] font-extrabold leading-tight">
          Book your visit in 2 minutes
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-white/80">
          No advance payment needed. Get your serial number instantly.
        </p>
      </div>

      <ol className="mb-auto mt-9 flex flex-col gap-1">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <li key={label} className="flex items-center gap-3.5 py-2.5">
              <span
                className={cn(
                  "flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 font-heading text-[15px] font-bold transition-colors",
                  done && "border-white bg-white text-primary",
                  active && "border-white bg-white/15 text-white",
                  !done && !active && "border-white/30 text-white/50",
                )}
              >
                {done ? <CheckIcon size={18} /> : n}
              </span>
              <span
                className={cn(
                  "text-[15px] font-semibold transition-colors",
                  active ? "text-white" : done ? "text-white/80" : "text-white/50",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <ul className="mt-8 flex flex-col gap-2.5 border-t border-white/15 pt-7">
        {TRUST.map((t) => (
          <li key={t} className="flex items-center gap-2.5 text-[14px] text-white/85">
            <CheckIcon size={16} className="flex-none text-[#7FD1CF]" />
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-7 rounded-2xl bg-white/10 p-5">
        <div className="mb-3 text-[13.5px] text-white/80">
          Trouble booking online? We&rsquo;ll do it for you.
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={TEL_URL}
            className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-white font-heading text-[14px] font-bold text-primary transition-colors hover:bg-white/90"
          >
            <PhoneIcon size={17} /> Call
          </a>
          <a
            href={WHATSAPP_URL}
            className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-whatsapp font-heading text-[14px] font-bold text-white transition-colors hover:bg-whatsapp-dark"
          >
            <WhatsAppIcon size={17} color="#fff" /> Chat
          </a>
        </div>
      </div>

      <div className="mt-6 text-[12.5px] text-white/50">
        Your appointment is with {DOCTOR.name}.
      </div>
    </aside>
  );
}
