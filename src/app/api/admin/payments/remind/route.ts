import { remindSchema } from "@/lib/validators/admin";
import { sendDueReminder } from "@/server/services/payments.service";
import { apiResponse, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }
  const parsed = remindSchema.safeParse(body);
  if (!parsed.success) return apiError("Invalid request", { status: 422 });

  try {
    const sent = await sendDueReminder(parsed.data.paymentId);
    if (!sent) return apiError("Nothing due on this bill.", { status: 409 });
    return apiResponse({ sent: true });
  } catch {
    return apiError("Could not send the reminder.", { status: 500 });
  }
}
