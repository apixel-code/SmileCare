import type { ContactInput } from "@/lib/validators/contact";
import type { BookingInput } from "@/lib/validators/booking";
import type { DayAvailability } from "@/server/services/availability.service";
import type { BookingTicket } from "@/server/services/booking.service";

/**
 * Typed client-side API helpers. Components call these instead of raw fetch,
 * so request/response shapes live in one place.
 */

export type FieldErrors = Record<string, string[]>;

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

export async function submitContact(
  input: ContactInput,
): Promise<ContactResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    if (json?.ok) return { ok: true };
    return {
      ok: false,
      error: json?.error?.message ?? "Something went wrong.",
      fieldErrors: json?.error?.details as FieldErrors | undefined,
    };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function fetchAvailability(
  date: string,
): Promise<DayAvailability | null> {
  try {
    const res = await fetch(`/api/availability?date=${date}`);
    const json = await res.json();
    return json?.ok ? (json.data as DayAvailability) : null;
  } catch {
    return null;
  }
}

export type BookingResult =
  | { ok: true; ticket: BookingTicket }
  | { ok: false; error: string; code?: string; fieldErrors?: FieldErrors };

export async function submitBooking(
  input: BookingInput,
): Promise<BookingResult> {
  try {
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    if (json?.ok) return { ok: true, ticket: json.data as BookingTicket };
    return {
      ok: false,
      error: json?.error?.message ?? "Something went wrong.",
      code: json?.error?.code,
      fieldErrors: json?.error?.details as FieldErrors | undefined,
    };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
