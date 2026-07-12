import { z } from "zod";
import { getSession } from "@/server/auth/guard";
import { cancelMyAppointment } from "@/server/services/portal.service";
import { apiResponse, apiError } from "@/lib/api-response";

const schema = z.object({ appointmentId: z.string().min(8) });

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "patient") {
    return apiError("Please log in.", { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError("Invalid request", { status: 422 });

  try {
    const ok = await cancelMyAppointment(parsed.data.appointmentId, session.phone);
    if (!ok) {
      return apiError("This appointment can no longer be cancelled.", {
        status: 409,
      });
    }
    return apiResponse({ cancelled: true });
  } catch {
    return apiError("Could not cancel. Please call us.", { status: 500 });
  }
}
