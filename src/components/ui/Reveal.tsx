"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "down" | "left" | "right" | "fade" | "scale";

const HIDDEN: Record<RevealVariant, string> = {
  up: "opacity-0 translate-y-6",
  down: "opacity-0 -translate-y-6",
  left: "opacity-0 translate-x-6",
  right: "opacity-0 -translate-x-6",
  fade: "opacity-0",
  scale: "opacity-0 scale-95",
};

/**
 * Scroll-reveal wrapper (DRY). Animates children in when they enter the
 * viewport. Use `delay` on siblings for a rhythmic, staggered cascade.
 * Respects prefers-reduced-motion (content shows instantly, no transform).
 */
export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  duration = 700,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
      className={cn(
        "ease-smooth transition-all will-change-[opacity,transform]",
        "motion-reduce:!translate-x-0 motion-reduce:!translate-y-0 motion-reduce:!scale-100 motion-reduce:!opacity-100 motion-reduce:!transition-none",
        shown ? "translate-x-0 translate-y-0 scale-100 opacity-100" : HIDDEN[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
