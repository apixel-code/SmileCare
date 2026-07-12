import { toothSchema } from "@/lib/validators/admin";
import { upsertTooth } from "@/server/repositories/dentalchart.repository";
import { getSession } from "@/server/auth/guard";
import { apiResponse, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }
  const parsed = toothSchema.safeParse(body);
  if (!parsed.success) return apiError("Invalid request", { status: 422 });

  try {
    const session = await getSession();
    await upsertTooth(
      parsed.data.patientId,
      parsed.data.toothNo,
      parsed.data.condition,
      session?.sub ?? "unknown",
    );
    return apiResponse({ saved: true });
  } catch {
    return apiError("Could not save the tooth.", { status: 500 });
  }
}
