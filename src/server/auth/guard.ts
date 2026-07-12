import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  verifySessionToken,
  type Session,
  type SessionRole,
} from "./session";

/**
 * THE role-check helper (per project rules: one place, not per-route).
 * Server Components / route handlers read the session through these.
 */

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Redirect to the right login unless the session has one of `roles`. */
export async function requireRole(
  ...roles: SessionRole[]
): Promise<Session> {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) {
    redirect(roles.includes("patient") ? "/portal/login" : "/admin/login");
  }
  return session;
}
