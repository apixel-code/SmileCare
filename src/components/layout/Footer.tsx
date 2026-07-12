import Link from "next/link";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { PRIMARY_NAV, FOOTER_SERVICE_LINKS, BOOK_HREF } from "@/lib/navigation";
import { CLINIC, WHATSAPP_URL } from "@/lib/constants";

const year = new Date().getFullYear();

export function Footer({
  clinicName = CLINIC.shortName,
  address = CLINIC.address,
  phone = CLINIC.phoneDisplay,
}: {
  clinicName?: string;
  address?: string;
  phone?: string;
}) {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-container px-5 py-14 md:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* About */}
          <div>
            <Logo onDark name={clinicName} />
            <p className="mt-4 max-w-[300px] text-sm leading-relaxed text-white/65">
              {CLINIC.about}
            </p>
            <p className="mt-3 max-w-[300px] text-[13px] leading-relaxed text-white/50">
              {address}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <FooterHeading>Quick Links</FooterHeading>
            {PRIMARY_NAV.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
            <FooterLink href={BOOK_HREF}>Book Appointment</FooterLink>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-3">
            <FooterHeading>Services</FooterHeading>
            {FOOTER_SERVICE_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </div>

          {/* Emergency + social */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-cta/40 bg-cta/10 px-6 py-5">
              <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-cta">
                Emergency Hotline — 24/7
              </div>
              <a
                href={`tel:${phone.replace(/[\s-]/g, "")}`}
                className="font-heading text-[22px] font-extrabold text-white transition-colors hover:text-cta"
              >
                {phone}
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <FooterHeading>Follow Us</FooterHeading>
              <a
                href="#"
                className="flex items-center gap-2.5 text-[14.5px] text-white/85 transition-colors hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1877F2] font-heading text-[16px] font-extrabold text-white">
                  f
                </span>
                Facebook Page
              </a>
              <a
                href={WHATSAPP_URL}
                className="flex items-center gap-2.5 text-[14.5px] text-white/85 transition-colors hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-whatsapp">
                  <WhatsAppIcon size={16} color="#fff" />
                </span>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 pt-6 text-[13px] text-white/50">
          <span>
            © {year} {CLINIC.name}
          </span>
          <span>Designed with care</span>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/50">
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[14.5px] text-white/85 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}
