import { prescriptionSchema } from "@/lib/validators/admin";
import { createPrescription } from "@/server/repositories/prescription.repository";
import { getSession } from "@/server/auth/guard";
import { DEFAULT_DOCTOR } from "@/lib/booking";
import { apiResponse, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }
  const parsed = prescriptionSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Please check the prescription.", {
      status: 422,
      code: "VALIDATION",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const session = await getSession();
    const doctorName =
      session?.role === "doctor" ? session.name : DEFAULT_DOCTOR.name;
    const result = await createPrescription({
      patientId: parsed.data.patientId,
      doctorKey: session?.sub ?? DEFAULT_DOCTOR.key,
      doctorName,
      diagnosis: parsed.data.diagnosis,
      medicines: parsed.data.medicines,
      advice: parsed.data.advice,
      nextVisitDate: parsed.data.nextVisitDate,
    });
    return apiResponse({ id: result.id }, { status: 201 });
  } catch {
    return apiError("Could not save the prescription.", { status: 500 });
  }
}
