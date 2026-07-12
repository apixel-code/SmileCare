/** Tiny className joiner (no extra deps). Falsy values are dropped. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** +8801XXXXXXXXX → 01XXXXXXXXX for display. */
export function displayPhone(phone: string): string {
  return phone.replace(/^\+88/, "");
}
