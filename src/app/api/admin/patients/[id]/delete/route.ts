import { deletePatientById } from "@/server/services/admin.service";
import { apiResponse, apiError } from "@/lib/api-response";

// Admin-only (middleware maps this path to the patient.delete permission).
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id || id.length < 8) return apiError("Invalid patient", { status: 400 });
  try {
    await deletePatientById(id);
    return apiResponse({ deleted: true });
  } catch {
    return apiError("Could not delete the patient.", { status: 500 });
  }
}
