"use client";

import { useMemo, useState } from "react";
import { bookingDates } from "@/lib/booking";
import { bookingSchema } from "@/lib/validators/booking";
import { fetchAvailability, submitBooking } from "@/lib/api";
import { TEL_URL, WHATSAPP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { ServiceStep } from "./steps/ServiceStep";
import { DateTimeStep } from "./steps/DateTimeStep";
import {
  DetailsStep,
  type DetailsErrors,
  type DetailsValues,
} from "./steps/DetailsStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";
import { BookingBrandPanel } from "./BookingBrandPanel";
import type { DayAvailability } from "@/server/services/availability.service";
import type { BookingTicket } from "@/server/services/booking.service";

export function BookingWizard() {
  const dates = useMemo(() => bookingDates(), []);

  const [step, setStep] = useState(1);
  const [serviceSlug, setServiceSlug] = useState<string | null>(null);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  const [availability, setAvailability] = useState<DayAvailability | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [details, setDetails] = useState<DetailsValues>({
    who: "self",
    name: "",
    phone: "",
    age: "",
    note: "",
  });
  const [errors, setErrors] = useState<DetailsErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [ticket, setTicket] = useState<BookingTicket | null>(null);

  async function loadAvailability(key: string) {
    setSlotsLoading(true);
    setAvailability(null);
    const data = await fetchAvailability(key);
    setAvailability(data);
    setSlotsLoading(false);
  }

  function pickService(slug: string) {
    setServiceSlug(slug);
    setStep(2);
  }
  function pickDate(key: string) {
    setDateKey(key);
    setSlot(null);
    void loadAvailability(key);
  }

  const scarcityText = (() => {
    const count = availability?.availableCount ?? 0;
    if (dateKey && dateKey === dates[0]?.key) {
      return `Only ${count} slots left today — booking now is a good idea`;
    }
    return `${count} slots available on this day`;
  })();

  const canConfirm =
    details.name.trim().length > 1 &&
    details.phone.replace(/[\s-]/g, "").length >= 11;

  async function confirm() {
    setServerError("");
    const parsed = bookingSchema.safeParse({
      serviceSlug,
      date: dateKey,
      timeSlot: slot,
      who: details.who,
      name: details.name,
      phone: details.phone,
      age: details.age,
      note: details.note || undefined,
    });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors({ name: fe.name?.[0], phone: fe.phone?.[0], age: fe.age?.[0] });
      return;
    }
    setErrors({});
    setSubmitting(true);
    const res = await submitBooking(parsed.data);
    setSubmitting(false);

    if (res.ok) {
      setTicket(res.ticket);
      setStep(4);
      return;
    }
    if (res.code === "SLOT_FULL") {
      setSlot(null);
      if (dateKey) void loadAvailability(dateKey);
      setStep(2);
      setServerError("");
      return;
    }
    setServerError(res.error);
  }

  function restart() {
    setStep(1);
    setServiceSlug(null);
    setDateKey(null);
    setSlot(null);
    setAvailability(null);
    setDetails({ who: "self", name: "", phone: "", age: "", note: "" });
    setErrors({});
    setServerError("");
    setTicket(null);
  }

  const backVisible = step > 1 && step < 4;

  return (
    <div className="min-h-screen bg-primary-light lg:flex lg:items-center lg:justify-center lg:p-8">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-[0_0_40px_rgba(26,43,60,0.08)] md:my-8 md:min-h-0 md:max-w-2xl md:rounded-3xl lg:my-0 lg:max-w-5xl lg:flex-row lg:shadow-[0_30px_80px_rgba(26,43,60,0.18)]">
        {/* Desktop side panel (lg+) */}
        <BookingBrandPanel step={step} />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile / tablet header + progress bar */}
          <div className="sticky top-0 z-10 border-b border-primary-light bg-white px-5 pb-3 pt-3.5 lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                aria-label="Back"
                onClick={() => step > 1 && setStep(step - 1)}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl border border-primary-light bg-white text-[18px] text-ink",
                  !backVisible && "invisible",
                )}
              >
                ←
              </button>
              <div className="text-center">
                <div className="font-heading text-[16px] font-extrabold text-ink">
                  Book Appointment
                </div>
                <div className="mt-0.5 text-[12.5px] text-ink-muted">
                  {step === 4 ? "Done!" : `Step ${step} of 4`}
                </div>
              </div>
              <div className="w-11" />
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "h-[5px] flex-1 rounded-full",
                    n <= step ? "bg-primary" : "bg-[#E1EBF0]",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Desktop header (stepper lives in the side panel) */}
          <div className="hidden items-center gap-4 border-b border-primary-light px-10 pb-5 pt-8 lg:flex">
            <button
              type="button"
              aria-label="Back"
              onClick={() => step > 1 && setStep(step - 1)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border border-primary-light bg-white text-[18px] text-ink transition-colors hover:border-primary",
                !backVisible && "invisible",
              )}
            >
              ←
            </button>
            <div>
              <div className="font-heading text-[19px] font-extrabold text-ink">
                Book Appointment
              </div>
              <div className="text-[13px] text-ink-muted">
                {step === 4 ? "All done!" : `Step ${step} of 4`}
              </div>
            </div>
          </div>

          {step === 1 && (
            <ServiceStep selected={serviceSlug} onPick={pickService} />
          )}
          {step === 2 && (
            <DateTimeStep
              dates={dates}
              selectedDate={dateKey}
              onPickDate={pickDate}
              slots={availability?.slots ?? []}
              slotsLoading={slotsLoading}
              selectedSlot={slot}
              onPickSlot={setSlot}
              scarcityText={scarcityText}
              canNext={!!dateKey && !!slot}
              onNext={() => dateKey && slot && setStep(3)}
            />
          )}
          {step === 3 && (
            <DetailsStep
              values={details}
              errors={errors}
              onChange={(patch) => setDetails((v) => ({ ...v, ...patch }))}
              onWho={(who) => setDetails((v) => ({ ...v, who }))}
              canConfirm={canConfirm}
              submitting={submitting}
              serverError={serverError}
              onConfirm={confirm}
            />
          )}
          {step === 4 && ticket && (
            <ConfirmationStep ticket={ticket} onRestart={restart} />
          )}

          {/* Fallback (mobile / tablet only — desktop has it in the side panel) */}
          {step !== 4 && (
            <div className="flex flex-col gap-3 border-t border-primary-light bg-[#F7FBFC] p-5 lg:hidden">
              <div className="text-center text-[14px] text-ink-muted">
                Having trouble booking online? Call us directly — we&rsquo;ll do
                it for you.
              </div>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={TEL_URL}
                  className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-primary font-heading text-[15px] font-bold text-white transition-colors hover:bg-primary-dark"
                >
                  <PhoneIcon size={18} /> Call Now
                </a>
                <a
                  href={WHATSAPP_URL}
                  className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-whatsapp font-heading text-[15px] font-bold text-white transition-colors hover:bg-whatsapp-dark"
                >
                  <WhatsAppIcon size={18} color="#fff" /> WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
