import { collectSchema } from "@/lib/validators/admin";
import { recordCollection } from "@/server/services/payments.service";
import { getSession } from "@/server/auth/guard";
import { apiResponse, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }
  const parsed = collectSchema.safeParse(body);
  if (!parsed.success) return apiError("Check the amount.", { status: 422 });

  try {
    const session = await getSession();
    const result = await recordCollection(
      parsed.data.paymentId,
      parsed.data.amount,
      parsed.data.method,
      session?.sub ?? "unknown",
    );
    if (!result.ok) {
      return apiError("Amount exceeds the due, or bill not found.", { status: 409 });
    }
    return apiResponse({ newDue: result.newDue });
  } catch {
    return apiError("Could not record the payment.", { status: 500 });
  }
}
