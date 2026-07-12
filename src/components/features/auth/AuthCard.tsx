import type { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { Card } from "@/components/ui/Card";

/** Centered auth card shell shared by patient + staff login pages. */
export function AuthCard({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary-light to-white px-5 py-10">
      <div className="w-full max-w-md animate-fade-up motion-reduce:animate-none">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card className="p-7 md:p-8">
          <h1 className="mb-1.5 text-center font-heading text-[22px] font-extrabold text-ink">
            {title}
          </h1>
          <p className="mb-6 text-center text-[14.5px] leading-[1.6] text-ink-muted">
            {sub}
          </p>
          {children}
        </Card>
      </div>
    </div>
  );
}
