"use client";

import { useMemo, useState } from "react";
import { bookingDates } from "@/lib/booking";
import { bookingSchema } from "@/lib/validators/booking";
import { fetchAvailability, submitBooking } from "@/lib/api";
import { TEL_URL, WHATSAPP_URL } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { ServiceStep } from "./steps/ServiceStep";
import { DateTimeStep } from "./steps/DateTimeStep";
import {
  DetailsStep,
  type DetailsErrors,
  type DetailsValues,
} from "./steps/DetailsStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";
import type { DayAvailability } from "@/server/services/availability.service";
import type { BookingTicket } from "@/server/services/booking.service";

const STEP_LABELS = ["Service", "Date & Time", "Your Details", "Confirmation"];

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
    setAvailability(await fetchAvailability(key));
    setSlotsLoading(false);
  }

  function pickDate(key: string) {
    setDateKey(key);
    setSlot(null);
    void loadAvailability(key);
  }

  const scarcityText = (() => {
    const count = availability?.availableCount ?? 0;
    return dateKey && dateKey === dates[0]?.key
      ? `Only ${count} slots left today — booking now is a good idea`
      : `${count} slots available on this day`;
  })();

  const canContinue =
    step === 1
      ? serviceSlug !== null
      : step === 2
        ? !!dateKey && !!slot
        : details.name.trim().length > 1 &&
          details.phone.replace(/[\s-]/g, "").length >= 11;

  async function primary() {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    // step 3 → confirm
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

  return (
    <>
      <PageHero
        eyebrow="Online Booking"
        title="Book Your Appointment"
        subtitle="It takes 2 minutes — no advance payment. Pick a service and time, and get your serial number instantly."
      />

      <Container className="pb-20">
        <Card className="mx-auto -mt-6 max-w-3xl overflow-hidden md:-mt-8">
          {/* Stepper header */}
          <div className="border-b border-primary-light px-6 py-6 md:px-10">
            <Stepper steps={STEP_LABELS} current={step} />
          </div>

          {/* Step content — keyed by step so each change re-animates in rhythm */}
          <div
            key={step}
            className="animate-fade-up-fast px-6 py-8 motion-reduce:animate-none md:px-10 md:py-9"
          >
            {step === 1 && (
              <ServiceStep selected={serviceSlug} onPick={setServiceSlug} />
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
              />
            )}
            {step === 3 && (
              <DetailsStep
                values={details}
                errors={errors}
                onChange={(patch) => setDetails((v) => ({ ...v, ...patch }))}
                onWho={(who) => setDetails((v) => ({ ...v, who }))}
                serverError={serverError}
              />
            )}
            {step === 4 && ticket && (
              <ConfirmationStep ticket={ticket} onRestart={restart} />
            )}
          </div>

          {/* Footer nav (hidden on confirmation) */}
          {step < 4 && (
            <div className="flex items-center justify-between gap-3 border-t border-primary-light bg-[#F9FBFC] px-6 py-5 md:px-10">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  ← Back
                </Button>
              ) : (
                <span />
              )}
              <Button
                variant="cta"
                size="lg"
                onClick={primary}
                disabled={!canContinue || submitting}
                className={
                  !canContinue || submitting ? "opacity-60" : undefined
                }
              >
                {step === 3
                  ? submitting
                    ? "Confirming…"
                    : "Confirm My Appointment ✓"
                  : "Continue →"}
              </Button>
            </div>
          )}
        </Card>

        {/* Trouble booking */}
        {step < 4 && (
          <p className="mx-auto mt-6 max-w-3xl text-center text-[14px] text-ink-muted">
            Trouble booking online?{" "}
            <a href={TEL_URL} className="font-semibold text-primary hover:text-primary-dark">
              Call us
            </a>{" "}
            or{" "}
            <a href={WHATSAPP_URL} className="font-semibold text-primary hover:text-primary-dark">
              message on WhatsApp
            </a>{" "}
            — we&rsquo;ll book it for you.
          </p>
        )}
      </Container>
    </>
  );
}
