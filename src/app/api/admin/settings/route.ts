import { settingsSchema } from "@/lib/validators/admin";
import { updateSettings } from "@/server/repositories/settings.repository";
import { getSession } from "@/server/auth/guard";
import { apiResponse, apiError } from "@/lib/api-response";

// Settings are admin-only (middleware allows any staff; tighten here).
export async function PUT(request: Request) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return apiError("Only the admin can change settings.", { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Please check the settings.", {
      status: 422,
      code: "VALIDATION",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    await updateSettings(parsed.data);
    return apiResponse({ saved: true });
  } catch {
    return apiError("Could not save settings.", { status: 500 });
  }
}
