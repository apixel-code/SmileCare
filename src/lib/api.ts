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

// ── Auth ────────────────────────────────────────────────────────────
export type SimpleResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

export type LoginResult =
  | { ok: true; role: string; name: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function requestOtp(phone: string): Promise<SimpleResult> {
  try {
    const json = await postJson("/api/auth/otp/request", { phone });
    if (json?.ok) return { ok: true };
    return {
      ok: false,
      error: json?.error?.message ?? "Something went wrong.",
      fieldErrors: json?.error?.details,
    };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function verifyOtp(
  phone: string,
  code: string,
): Promise<LoginResult> {
  try {
    const json = await postJson("/api/auth/otp/verify", { phone, code });
    if (json?.ok) return { ok: true, role: json.data.role, name: json.data.name };
    return {
      ok: false,
      error: json?.error?.message ?? "Something went wrong.",
      fieldErrors: json?.error?.details,
    };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function staffLogin(
  phone: string,
  password: string,
): Promise<LoginResult> {
  try {
    const json = await postJson("/api/auth/login", { phone, password });
    if (json?.ok) return { ok: true, role: json.data.role, name: json.data.name };
    return {
      ok: false,
      error: json?.error?.message ?? "Something went wrong.",
      fieldErrors: json?.error?.details,
    };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // best-effort
  }
}

// ── Portal ──────────────────────────────────────────────────────────
export async function cancelAppointment(
  appointmentId: string,
): Promise<SimpleResult> {
  try {
    const json = await postJson("/api/portal/cancel", { appointmentId });
    if (json?.ok) return { ok: true };
    return { ok: false, error: json?.error?.message ?? "Could not cancel." };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ── Admin ───────────────────────────────────────────────────────────
export async function advanceQueue(appointmentId: string): Promise<SimpleResult> {
  try {
    const json = await postJson("/api/admin/queue/advance", { appointmentId });
    if (json?.ok) return { ok: true };
    return { ok: false, error: json?.error?.message ?? "Could not update." };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function submitWalkin(input: {
  name: string;
  phone: string;
  age?: string | number;
  serviceSlug: string;
  timeSlot: string;
  paymentTaken?: boolean;
}): Promise<{ ok: true; serialNo: number } | { ok: false; error: string; fieldErrors?: FieldErrors }> {
  try {
    const json = await postJson("/api/admin/walkin", input);
    if (json?.ok) return { ok: true, serialNo: json.data.serialNo };
    return {
      ok: false,
      error: json?.error?.message ?? "Could not add the walk-in.",
      fieldErrors: json?.error?.details,
    };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function saveTooth(input: {
  patientId: string;
  toothNo: number;
  condition: string | null;
}): Promise<SimpleResult> {
  try {
    const json = await postJson("/api/admin/chart", input);
    if (json?.ok) return { ok: true };
    return { ok: false, error: json?.error?.message ?? "Could not save." };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function savePrescription(input: {
  patientId: string;
  diagnosis?: string;
  medicines: Array<{ name: string; dose: string; durationDays: number; afterMeal: boolean }>;
  advice: string[];
  nextVisitDate?: string;
}): Promise<SimpleResult> {
  try {
    const json = await postJson("/api/admin/prescriptions", input);
    if (json?.ok) return { ok: true };
    return { ok: false, error: json?.error?.message ?? "Could not save." };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function collectPaymentApi(input: {
  paymentId: string;
  amount: number;
  method: string;
}): Promise<SimpleResult> {
  try {
    const json = await postJson("/api/admin/payments/collect", input);
    if (json?.ok) return { ok: true };
    return { ok: false, error: json?.error?.message ?? "Could not record." };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function createBillApi(input: {
  patientId: string;
  label: string;
  totalAmount: number;
  paidAmount: number;
  method: string;
}): Promise<SimpleResult> {
  try {
    const json = await postJson("/api/admin/payments/bill", input);
    if (json?.ok) return { ok: true };
    return { ok: false, error: json?.error?.message ?? "Could not create." };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function sendReminderApi(paymentId: string): Promise<SimpleResult> {
  try {
    const json = await postJson("/api/admin/payments/remind", { paymentId });
    if (json?.ok) return { ok: true };
    return { ok: false, error: json?.error?.message ?? "Could not send." };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function saveSettingsApi(input: unknown): Promise<SimpleResult> {
  try {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    if (json?.ok) return { ok: true };
    return { ok: false, error: json?.error?.message ?? "Could not save." };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function createStaffApi(input: {
  name: string;
  phone: string;
  password: string;
  role: string;
}): Promise<SimpleResult> {
  try {
    const json = await postJson("/api/admin/staff", input);
    if (json?.ok) return { ok: true };
    return {
      ok: false,
      error: json?.error?.message ?? "Could not add.",
      fieldErrors: json?.error?.details,
    };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function toggleStaffApi(
  staffId: string,
  isActive: boolean,
): Promise<SimpleResult> {
  try {
    const res = await fetch("/api/admin/staff", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId, isActive }),
    });
    const json = await res.json();
    if (json?.ok) return { ok: true };
    return { ok: false, error: json?.error?.message ?? "Could not update." };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

// ── Booking ─────────────────────────────────────────────────────────
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
