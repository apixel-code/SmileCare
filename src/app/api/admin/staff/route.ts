import { staffCreateSchema, staffToggleSchema } from "@/lib/validators/admin";
import {
  createStaff,
  setStaffActive,
  staffExists,
} from "@/server/repositories/staff.repository";
import { hashPassword } from "@/server/auth/password";
import { normalizePhone } from "@/lib/validators/booking";
import { getSession } from "@/server/auth/guard";
import { apiResponse, apiError } from "@/lib/api-response";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "admin" ? session : null;
}

/** Create a staff member (admin only). */
export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return apiError("Only the admin can manage staff.", { status: 403 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }
  const parsed = staffCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Please check the form.", {
      status: 422,
      code: "VALIDATION",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const phone = normalizePhone(parsed.data.phone);
    if (await staffExists(phone)) {
      return apiError("A staff member with this phone already exists.", {
        status: 409,
      });
    }
    const result = await createStaff({
      name: parsed.data.name,
      phone,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role,
    });
    return apiResponse({ id: result.id }, { status: 201 });
  } catch {
    return apiError("Could not add the staff member.", { status: 500 });
  }
}

/** Enable/disable a staff member (admin only). */
export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return apiError("Only the admin can manage staff.", { status: 403 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }
  const parsed = staffToggleSchema.safeParse(body);
  if (!parsed.success) return apiError("Invalid request", { status: 422 });
  if (parsed.data.staffId === admin.sub && !parsed.data.isActive) {
    return apiError("You can't deactivate yourself.", { status: 409 });
  }

  try {
    await setStaffActive(parsed.data.staffId, parsed.data.isActive);
    return apiResponse({ saved: true });
  } catch {
    return apiError("Could not update the staff member.", { status: 500 });
  }
}
