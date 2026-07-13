import { walkinSchema } from "@/lib/validators/admin";
import { addWalkin } from "@/server/services/admin.service";
import { getSession } from "@/server/auth/guard";
import { apiResponse, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }
  const parsed = walkinSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Please check the form.", {
      status: 422,
      code: "VALIDATION",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const session = await getSession();
    const result = await addWalkin(parsed.data, session?.sub ?? "reception");
    if (!result.ok) return apiError(result.error, { status: 409 });
    return apiResponse(
      { serialNo: result.serialNo, paymentFailed: result.paymentFailed ?? false },
      { status: 201 },
    );
  } catch {
    return apiError("Could not add the walk-in.", { status: 500 });
  }
}
