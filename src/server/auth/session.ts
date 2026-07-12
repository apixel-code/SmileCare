import { SignJWT, jwtVerify } from "jose";
import type { StaffRole } from "@/lib/constants";

/**
 * Stateless session: HS256 JWT in an httpOnly cookie.
 * Edge-safe (jose only, no mongoose) so middleware can verify it too.
 */

export const SESSION_COOKIE = "sc_session";
export const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7; // 7 days

export type SessionRole = "patient" | StaffRole;

export interface Session {
  sub: string; // patientId or staffId
  role: SessionRole;
  phone: string;
  name: string;
}

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set in environment");
  return new TextEncoder().encode(s);
}

export async function signSession(session: Session): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_S}s`)
    .sign(secret());
}

export async function verifySessionToken(
  token: string,
): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || !payload.role) return null;
    return {
      sub: String(payload.sub),
      role: payload.role as SessionRole,
      phone: String(payload.phone ?? ""),
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_S,
};
