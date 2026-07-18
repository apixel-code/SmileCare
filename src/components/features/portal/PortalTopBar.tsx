"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { FamilyMember } from "@/types/portal";

/** Teal portal header — greeting + family switcher (one phone = whole family). */
export function PortalTopBar({
  greeting,
  members,
  selectedId,
}: {
  greeting: string;
  members: FamilyMember[];
  selectedId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = members.find((m) => m.id === selectedId) ?? members[0];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="relative overflow-hidden bg-ink px-5 pb-20 pt-5 md:px-8">
      <div className="absolute inset-0 surface-pattern opacity-20" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary-dark/80" aria-hidden />
      <div className="relative mx-auto flex max-w-2xl items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[13px] text-white/75">{greeting}</div>
          <div className="font-heading text-[22px] font-extrabold leading-tight text-white sm:text-[24px]">
            Hello, {selected?.name}
          </div>
        </div>

        <div className="relative flex flex-none items-center gap-2" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Switch patient or log out"
            className="flex min-h-[48px] items-center gap-2.5 rounded-2xl border-[1.5px] border-white/40 bg-white/14 px-2.5 font-heading text-[14px] font-bold text-white shadow-[0_12px_34px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:bg-white/20 sm:px-3.5"
          >
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-white text-[13px] font-extrabold text-primary">
              {selected?.name?.charAt(0) ?? "?"}
            </span>
            <span className="hidden max-w-[90px] truncate sm:inline">{selected?.name}</span>
            <span className="text-[11px]">▼</span>
          </button>

          {open && (
            <div className="absolute right-0 top-[54px] z-20 flex min-w-[220px] animate-fade-up-fast flex-col gap-0.5 rounded-2xl bg-white p-2 shadow-[0_16px_40px_rgba(26,43,60,0.25)] motion-reduce:animate-none">
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(`/portal?m=${m.id}`);
                  }}
                  className={cn(
                    "flex min-h-[48px] items-center gap-3 rounded-[9px] px-3.5 text-left transition-colors",
                    m.id === selected?.id ? "bg-primary-light" : "hover:bg-primary-light/50",
                  )}
                >
                  <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-primary-light font-heading text-[13px] font-extrabold text-primary">
                    {m.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-[14px] font-semibold text-ink">
                      {m.name}
                    </span>
                    {m.age !== undefined && (
                      <span className="block text-[12px] text-ink-muted">
                        Age {m.age}
                      </span>
                    )}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.push("/portal/login");
                  router.refresh();
                }}
                className="mt-1 flex min-h-[44px] items-center justify-center rounded-[9px] border-t border-primary-light text-[13.5px] font-semibold text-ink-muted transition-colors hover:bg-primary-light/50 hover:text-danger"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
