"use client";

import { useState } from "react";
import { contactSchema } from "@/lib/validators/contact";
import { submitContact } from "@/lib/api";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";

type FieldName = "name" | "phone" | "message";
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY = { name: "", phone: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const set =
    (key: FieldName) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fe.name?.[0],
        phone: fe.phone?.[0],
        message: fe.message?.[0],
      });
      return;
    }
    setErrors({});
    setStatus("submitting");

    const res = await submitContact(parsed.data);
    if (res.ok) {
      setStatus("success");
      setValues(EMPTY);
    } else {
      setStatus("error");
      if (res.fieldErrors) {
        setErrors({
          name: res.fieldErrors.name?.[0],
          phone: res.fieldErrors.phone?.[0],
          message: res.fieldErrors.message?.[0],
        });
      }
      setServerError(res.error);
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-primary-light bg-white p-10 text-center shadow-soft">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
          <CheckIcon size={26} />
        </span>
        <h3 className="mb-2 font-heading text-[20px] font-bold text-ink">
          Thank you — message sent!
        </h3>
        <p className="mb-6 max-w-[360px] text-[15px] leading-[1.7] text-ink-muted">
          We&rsquo;ll get back to you shortly. For anything urgent, please call
          us directly.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-primary-light bg-white p-7 shadow-soft"
    >
      <Field label="Your Name" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          name="name"
          value={values.name}
          onChange={set("name")}
          placeholder="e.g. Rahima Akter"
          error={!!errors.name}
          autoComplete="name"
        />
      </Field>

      <Field label="Mobile Number" htmlFor="phone" error={errors.phone}>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          value={values.phone}
          onChange={set("phone")}
          placeholder="01XXXXXXXXX"
          error={!!errors.phone}
          autoComplete="tel"
        />
      </Field>

      <Field label="How can we help?" htmlFor="message" error={errors.message}>
        <Textarea
          id="message"
          name="message"
          value={values.message}
          onChange={set("message")}
          placeholder="Tell us briefly what you need — a problem, a question, or a time that suits you."
          error={!!errors.message}
        />
      </Field>

      {serverError && (
        <p className="text-[14px] text-danger" role="alert">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        variant="cta"
        size="lg"
        className="w-full"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
