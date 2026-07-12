import { billSchema } from "@/lib/validators/admin";
import { createNewBill } from "@/server/services/payments.service";
import { getSession } from "@/server/auth/guard";
import { apiResponse, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", { status: 400 });
  }
  const parsed = billSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Please check the bill.", {
      status: 422,
      code: "VALIDATION",
      details: parsed.error.flatten().fieldErrors,
    });
  }
  if (parsed.data.paidAmount > parsed.data.totalAmount) {
    return apiError("Paid can't exceed the total.", { status: 422 });
  }

  try {
    const session = await getSession();
    const result = await createNewBill({
      ...parsed.data,
      byKey: session?.sub ?? "unknown",
    });
    return apiResponse({ id: result.id }, { status: 201 });
  } catch {
    return apiError("Could not create the bill.", { status: 500 });
  }
}
