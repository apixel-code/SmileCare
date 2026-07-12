import { bookingSchema } from "@/lib/validators/booking";
import { createBooking } from "@/server/services/booking.service";
import { apiResponse, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Please check the form and try again.", {
      status: 422,
      code: "VALIDATION",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const result = await createBooking(parsed.data);
    if (!result.ok) {
      return apiError(result.error, {
        status: result.code === "SLOT_FULL" ? 409 : 400,
        code: result.code,
      });
    }
    return apiResponse(result.ticket, { status: 201 });
  } catch {
    return apiError(
      "Something went wrong booking your appointment. Please call us.",
      { status: 500 },
    );
  }
}
