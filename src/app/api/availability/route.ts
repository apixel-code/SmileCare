import { getAvailability } from "@/server/services/availability.service";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return apiError("A valid date (YYYY-MM-DD) is required.", { status: 400 });
  }
  try {
    return apiResponse(await getAvailability(date));
  } catch {
    return apiError("Could not load availability. Please try again.", {
      status: 500,
    });
  }
}
