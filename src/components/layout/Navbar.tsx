"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon, MenuIcon, CloseIcon } from "@/components/ui/icons";
import { PRIMARY_NAV, BOOK_HREF } from "@/lib/navigation";
import { WHATSAPP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-primary-light bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-container items-center justify-between gap-6 px-5 md:px-8">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {PRIMARY_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-[15px] font-medium transition-colors hover:text-primary",
                isActive(link.href) ? "text-primary" : "text-ink",
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-[27px] left-0 h-[2px] w-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            aria-label="Chat on WhatsApp"
            className="hidden h-12 w-12 items-center justify-center rounded-xl border-[1.5px] border-whatsapp bg-white transition-colors hover:bg-[#F0FBF4] sm:flex"
          >
            <WhatsAppIcon color="#25D366" />
          </a>
          <Button href={BOOK_HREF} variant="cta" className="hidden sm:inline-flex">
            Book Appointment
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-xl text-ink lg:hidden"
          >
            <MenuIcon size={26} />
          </button>
        </div>
      </div>

      {/* Mobile slide-in drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white p-6 shadow-lift">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-ink"
              >
                <CloseIcon size={26} />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {PRIMARY_NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-[17px] font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-primary-light text-primary"
                      : "text-ink hover:bg-primary-light",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* Booking CTA always visible */}
            <div className="mt-auto flex flex-col gap-3 pt-6">
              <Button
                href={BOOK_HREF}
                variant="cta"
                size="lg"
                className="w-full"
              >
                Book Appointment
              </Button>
              <Button
                href={WHATSAPP_URL}
                external
                variant="whatsapp"
                size="lg"
                className="w-full"
              >
                <WhatsAppIcon color="#25D366" /> Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
