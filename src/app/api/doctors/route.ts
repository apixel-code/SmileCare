import { getDoctors } from "@/server/services/doctors.service";
import { apiResponse, apiError } from "@/lib/api-response";

/** Public: active doctors for the booking wizard's doctor picker. */
export async function GET() {
  try {
    return apiResponse(await getDoctors());
  } catch {
    return apiError("Could not load doctors.", { status: 500 });
  }
}
