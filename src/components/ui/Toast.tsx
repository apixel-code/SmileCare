"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Minimal toast — one message at a time, bottom-center (design style). */
const ToastContext = createContext<(msg: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((m: string) => {
    setMsg(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 3200);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {msg && (
        <div className="fixed inset-x-4 bottom-5 z-[200] mx-auto flex w-fit max-w-[calc(100vw-2rem)] animate-fade-up-fast items-center gap-2.5 rounded-xl bg-ink px-5 py-3.5 font-heading text-[13.5px] font-bold text-white shadow-[0_12px_30px_rgba(26,43,60,0.35)] sm:bottom-7 sm:max-w-md sm:px-6 sm:text-[14px]">
          <span className="mt-px flex-none text-[16px] leading-none text-[#4ADE80]">✓</span>
          <span className="min-w-0">{msg}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}
