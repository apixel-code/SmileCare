import { otpRequestSchema } from "@/lib/validators/auth";
import { requestOtp } from "@/server/services/auth.service";
import { apiResponse, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }

  const parsed = otpRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Please check the phone number.", {
      status: 422,
      code: "VALIDATION",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const result = await requestOtp(parsed.data.phone);
    if (!result.ok) return apiError(result.error, { status: 429 });
    return apiResponse({ sent: true });
  } catch {
    return apiError("Could not send the code. Please try again.", {
      status: 500,
    });
  }
}
