import type { ContactInput } from "@/lib/validators/contact";

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
