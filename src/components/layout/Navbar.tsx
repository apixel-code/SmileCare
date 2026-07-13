"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { MenuIcon, CloseIcon, UserIcon } from "@/components/ui/icons";
import { PRIMARY_NAV, BOOK_HREF } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Navbar({ clinicName }: { clinicName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Close the drawer on route change; lock body scroll while it's open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    // NOTE: backdrop-blur lives on the inner bar, NOT on <header> — a
    // backdrop-filter ancestor becomes the containing block for position:fixed
    // children and would trap the drawer inside the 76px-tall header.
    // z-[80]: the header is a stacking context, so the drawer inside it can
    // only beat the FloatingWhatsApp bubble (z-[70]) if the header itself does.
    <header className="sticky top-0 z-[80]">
      <div className="border-b border-primary-light bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-container items-center justify-between gap-4 px-5 md:px-8">
          <Logo name={clinicName} />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
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
            <Button href="/portal" variant="outline" className="hidden sm:inline-flex">
              <UserIcon size={18} /> Login
            </Button>
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
      </div>

      {/* Mobile slide-in drawer */}
      <div
        className={cn(
          // above the FloatingWhatsApp bubble (z-[70])
          "fixed inset-0 z-[80] lg:hidden",
          open ? "visible" : "invisible",
        )}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-ink/40 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
          aria-hidden
        />
        {/* Panel */}
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-lift transition-transform duration-300 ease-smooth",
            open ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between">
            <Logo name={clinicName} />
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
          {/* Login + Booking CTAs always visible */}
          <div className="mt-auto flex flex-col gap-3 pt-6">
            <Button href="/portal" variant="outline" size="lg" className="w-full">
              <UserIcon size={20} /> Login
            </Button>
            <Button href={BOOK_HREF} variant="cta" size="lg" className="w-full">
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
