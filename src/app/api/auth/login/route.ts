import { staffLoginSchema } from "@/lib/validators/auth";
import { staffLogin } from "@/server/services/auth.service";
import { SESSION_COOKIE, sessionCookieOptions } from "@/server/auth/session";
import { apiResponse, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }

  const parsed = staffLoginSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Please check the form.", {
      status: 422,
      code: "VALIDATION",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const result = await staffLogin(parsed.data.phone, parsed.data.password);
    if (!result.ok) return apiError(result.error, { status: 401 });

    const res = apiResponse({
      role: result.session.role,
      name: result.session.name,
    });
    res.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions);
    return res;
  } catch {
    return apiError("Could not log in. Please try again.", { status: 500 });
  }
}
