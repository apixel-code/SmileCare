import { DOCTOR } from "@/lib/constants";

/**
 * Booking configuration — single source of truth for slot times, capacity,
 * chamber days and the default doctor. Shared by the availability API, the
 * booking service, and the wizard UI.
 */

export const CLINIC_TZ = "Asia/Dhaka";
export const CLOSED_WEEKDAY = 5; // Friday (0=Sun)
export const BOOKING_DAYS_AHEAD = 8;

/** 30-min slots, chamber hours 5:00 PM – 9:00 PM. */
export const SLOT_TIMES = [
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
] as const;
export type SlotTime = (typeof SLOT_TIMES)[number];

/** Max appointments per slot before it's shown as full. */
export const SLOT_CAPACITY = 3;

/** Single doctor for now (Staff collection lands in P4 auth). */
export const DEFAULT_DOCTOR = {
  key: "dr-mahmudul-hasan",
  name: DOCTOR.name,
} as const;

export interface BookingServiceOption {
  slug: string;
  glyph: string;
  name: string;
  sub: string;
}

export const BOOKING_SERVICE_OPTIONS: BookingServiceOption[] = [
  { slug: "scaling-polishing", glyph: "Sc", name: "Scaling & Polishing", sub: "Cleaning, fresh breath" },
  { slug: "root-canal", glyph: "RC", name: "Root Canal", sub: "For tooth pain" },
  { slug: "braces-orthodontics", glyph: "Br", name: "Braces", sub: "Straighten teeth" },
  { slug: "tooth-extraction", glyph: "Ex", name: "Tooth Extraction", sub: "Removing a tooth" },
  { slug: "general-checkup", glyph: "GC", name: "General Checkup", sub: "Regular examination" },
  { slug: "not-sure", glyph: "?", name: "Not sure — let the doctor decide", sub: "The doctor will examine and advise" },
];

export function serviceNameFromSlug(slug: string): string {
  return (
    BOOKING_SERVICE_OPTIONS.find((s) => s.slug === slug)?.name ??
    "General Checkup"
  );
}

export interface BookingDate {
  key: string; // YYYY-MM-DD
  dayLabel: string; // Today / Tmrw / Mon...
  dateLabel: string; // "12 Jul"
  weekday: number;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Bookable dates (Dhaka time), skipping the closed weekday. */
export function bookingDates(count = BOOKING_DAYS_AHEAD): BookingDate[] {
  const todayKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: CLINIC_TZ,
  }).format(new Date()); // YYYY-MM-DD
  const [y, m, d] = todayKey.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);

  const out: BookingDate[] = [];
  for (let i = 0; out.length < count && i < count + 4; i++) {
    const dt = new Date(base + i * 86_400_000);
    const wd = dt.getUTCDay();
    if (wd === CLOSED_WEEKDAY) continue;
    const key = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
    out.push({
      key,
      dayLabel: i === 0 ? "Today" : i === 1 ? "Tmrw" : DAY_NAMES[wd],
      dateLabel: `${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]}`,
      weekday: wd,
    });
  }
  return out;
}

export function isBookableDate(key: string): boolean {
  return bookingDates().some((d) => d.key === key);
}

/** Pretty date for the confirmation ticket, e.g. "Sat, 12 Jul". */
export function ticketDateLabel(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DAY_NAMES[dt.getUTCDay()]}, ${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]}`;
}

/** Parse a slot label like "5:30 PM" into 24h parts. */
export function slotTo24h(slot: string): { hour: number; minute: number } {
  const m = slot.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!m) return { hour: 17, minute: 0 };
  let h = Number(m[1]);
  const minute = Number(m[2]);
  const pm = /pm/i.test(m[3]);
  if (pm && h !== 12) h += 12;
  if (!pm && h === 12) h = 0;
  return { hour: h, minute };
}

/** Google Calendar "add event" link for the appointment (Dhaka time). */
export function googleCalendarUrl(opts: {
  title: string;
  dateKey: string;
  slot: string;
  details?: string;
  location?: string;
  durationMin?: number;
}): string {
  const { hour, minute } = slotTo24h(opts.slot);
  const [y, m, d] = opts.dateKey.split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  const startLocal = `${y}${pad(m)}${pad(d)}T${pad(hour)}${pad(minute)}00`;
  const endMin = minute + (opts.durationMin ?? 30);
  const endHour = hour + Math.floor(endMin / 60);
  const endLocal = `${y}${pad(m)}${pad(d)}T${pad(endHour)}${pad(endMin % 60)}00`;
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${startLocal}/${endLocal}`,
    ctz: CLINIC_TZ,
    ...(opts.details ? { details: opts.details } : {}),
    ...(opts.location ? { location: opts.location } : {}),
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
