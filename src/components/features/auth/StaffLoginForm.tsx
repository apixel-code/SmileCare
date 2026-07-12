"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { staffLogin } from "@/lib/api";
import { staffLoginSchema } from "@/lib/validators/auth";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

/** Staff login — phone + password; role comes from the Staff record. */
export function StaffLoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/admin";

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = staffLoginSchema.safeParse({ phone, password });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors({ phone: fe.phone?.[0], password: fe.password?.[0] });
      return;
    }
    setErrors({});
    setBusy(true);
    const res = await staffLogin(parsed.data.phone, parsed.data.password);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Field label="Mobile Number" htmlFor="st-phone" error={errors.phone}>
        <Input
          id="st-phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01XXXXXXXXX"
          error={!!errors.phone}
          autoComplete="username"
          autoFocus
        />
      </Field>
      <Field label="Password" htmlFor="st-pass" error={errors.password}>
        <Input
          id="st-pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          error={!!errors.password}
          autoComplete="current-password"
        />
      </Field>
      {error && (
        <p className="text-[14px] text-danger" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" disabled={busy} className="w-full">
        {busy ? "Logging in…" : "Log In"}
      </Button>
    </form>
  );
}
