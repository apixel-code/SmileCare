/** Canonical site URL — set NEXT_PUBLIC_SITE_URL in production (Vercel env). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
