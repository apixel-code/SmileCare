"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestOtp, verifyOtp } from "@/lib/api";
import { otpRequestSchema, otpVerifySchema } from "@/lib/validators/auth";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

/** Patient OTP login — phase 1: phone, phase 2: 4-digit code. */
export function OtpLoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/portal";

  const [phase, setPhase] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendCode() {
    setError("");
    const parsed = otpRequestSchema.safeParse({ phone });
    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.phone?.[0] ?? "Check the number");
      return;
    }
    setBusy(true);
    const res = await requestOtp(parsed.data.phone);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setPhase("code");
    setCode("");
    setCooldown(60);
  }

  async function submitCode() {
    setError("");
    const parsed = otpVerifySchema.safeParse({ phone, code });
    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.code?.[0] ?? "Check the code");
      return;
    }
    setBusy(true);
    const res = await verifyOtp(parsed.data.phone, parsed.data.code);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push(next);
    router.refresh();
  }

  if (phase === "phone") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendCode();
        }}
        className="flex flex-col gap-4"
        noValidate
      >
        <Field label="Mobile Number" htmlFor="otp-phone" error={error || undefined}>
          <Input
            id="otp-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            error={!!error}
            autoComplete="tel"
            autoFocus
          />
        </Field>
        <Button type="submit" variant="cta" size="lg" disabled={busy} className="w-full">
          {busy ? "Sending…" : "Send Code"}
        </Button>
        <p className="text-center text-[13px] leading-[1.6] text-ink-muted">
          We&rsquo;ll text a 4-digit code to this number. No password needed.
        </p>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submitCode();
      }}
      className="flex flex-col gap-4"
      noValidate
    >
      <p className="text-center text-[14px] text-ink-muted">
        Code sent to <span className="font-semibold text-ink">{phone}</span>{" "}
        <button
          type="button"
          className="font-semibold text-primary underline"
          onClick={() => {
            setPhase("phone");
            setError("");
          }}
        >
          change
        </button>
      </p>
      <Field label="4-digit Code" htmlFor="otp-code" error={error || undefined}>
        <Input
          id="otp-code"
          inputMode="numeric"
          maxLength={4}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="••••"
          error={!!error}
          autoFocus
          className="text-center font-heading text-[24px] font-extrabold tracking-[0.5em]"
        />
      </Field>
      <Button type="submit" variant="cta" size="lg" disabled={busy} className="w-full">
        {busy ? "Verifying…" : "Verify & Log In"}
      </Button>
      <button
        type="button"
        disabled={cooldown > 0 || busy}
        onClick={() => void sendCode()}
        className="min-h-[44px] text-center text-[13.5px] text-ink-muted underline disabled:no-underline disabled:opacity-60"
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
      </button>
    </form>
  );
}
