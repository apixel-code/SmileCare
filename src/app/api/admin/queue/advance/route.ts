import { advanceSchema } from "@/lib/validators/admin";
import { advanceQueueItem } from "@/server/services/admin.service";
import { apiResponse, apiError } from "@/lib/api-response";

// Staff-only (enforced by middleware for /api/admin/*).
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }
  const parsed = advanceSchema.safeParse(body);
  if (!parsed.success) return apiError("Invalid request", { status: 422 });

  try {
    const result = await advanceQueueItem(parsed.data.appointmentId);
    if (!result.ok) {
      return apiError("This appointment can't be advanced.", { status: 409 });
    }
    return apiResponse({ status: result.newStatus });
  } catch {
    return apiError("Something went wrong.", { status: 500 });
  }
}
