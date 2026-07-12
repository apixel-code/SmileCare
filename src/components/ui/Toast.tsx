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
        <div className="fixed bottom-7 left-1/2 z-[200] flex -translate-x-1/2 animate-fade-up-fast items-center gap-2.5 whitespace-nowrap rounded-xl bg-ink px-6 py-3.5 font-heading text-[14px] font-bold text-white shadow-[0_12px_30px_rgba(26,43,60,0.35)]">
          <span className="text-[16px] text-[#4ADE80]">✓</span>
          {msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}
