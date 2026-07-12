import { contactSchema } from "@/lib/validators/contact";
import { submitContactMessage } from "@/server/services/contact.service";
import { apiResponse, apiError } from "@/lib/api-response";

// Thin handler: parse → validate (shared Zod) → service → typed response.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Please check the form and try again.", {
      status: 422,
      code: "VALIDATION",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    await submitContactMessage(parsed.data);
    return apiResponse({ received: true }, { status: 201 });
  } catch {
    return apiError("Something went wrong. Please call us instead.", {
      status: 500,
    });
  }
}
