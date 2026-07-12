import type { StaffRole } from "@/lib/constants";

/**
 * THE role-permission matrix — the single source of truth.
 * Used by middleware (pages), API routes, and UI (sidebar/buttons/tabs).
 *
 *                    admin  doctor  receptionist
 *  Queue / Patients    ✓      ✓         ✓
 *  Calendar            ✓      ✓         ✓
 *  Advance queue       ✓      ✓         ✓
 *  Walk-in add         ✓      ✗         ✓
 *  Dental chart edit   ✓      ✓         ✗ (view only)
 *  Write prescription  ✓      ✓         ✗
 *  Bills / collect     ✓      ✗         ✓
 *  Payments screen     ✓      ✗         ✓
 *  Reports             ✓      ✗         ✗
 *  Settings / staff    ✓      ✗         ✗
 *  Delete patient      ✓      ✗         ✗
 */

export type StaffAction =
  | "queue.advance"
  | "walkin.add"
  | "chart.edit"
  | "prescription.write"
  | "payments.manage"
  | "reports.view"
  | "settings.manage"
  | "staff.manage"
  | "patient.delete";

const ACTIONS: Record<StaffAction, readonly StaffRole[]> = {
  "queue.advance": ["admin", "doctor", "receptionist"],
  "walkin.add": ["admin", "receptionist"],
  "chart.edit": ["admin", "doctor"],
  "prescription.write": ["admin", "doctor"],
  "payments.manage": ["admin", "receptionist"],
  "reports.view": ["admin"],
  "settings.manage": ["admin"],
  "staff.manage": ["admin"],
  "patient.delete": ["admin"],
};

export function can(role: string | undefined, action: StaffAction): boolean {
  if (!role) return false;
  return (ACTIONS[action] as readonly string[]).includes(role);
}

/** Page-level access — anything not listed is open to every staff role. */
const ROUTE_RULES: Array<[RegExp, StaffAction]> = [
  [/^\/admin\/reports/, "reports.view"],
  [/^\/admin\/settings/, "settings.manage"],
  [/^\/admin\/payments/, "payments.manage"],
];

/** Returns true when this staff role may open this /admin path. */
export function canAccessAdminPath(role: string, pathname: string): boolean {
  const rule = ROUTE_RULES.find(([re]) => re.test(pathname));
  return rule ? can(role, rule[1]) : true;
}

/** API-level access, mapped by pathname — used by middleware in one place. */
const API_RULES: Array<[RegExp, StaffAction]> = [
  [/^\/api\/admin\/walkin/, "walkin.add"],
  [/^\/api\/admin\/chart/, "chart.edit"],
  [/^\/api\/admin\/prescriptions/, "prescription.write"],
  [/^\/api\/admin\/payments/, "payments.manage"],
  [/^\/api\/admin\/settings/, "settings.manage"],
  [/^\/api\/admin\/staff/, "staff.manage"],
  [/^\/api\/admin\/patients\/.+\/delete/, "patient.delete"],
];

export function canAccessAdminApi(role: string, pathname: string): boolean {
  const rule = API_RULES.find(([re]) => re.test(pathname));
  return rule ? can(role, rule[1]) : true;
}
