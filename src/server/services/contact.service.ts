import type { ContactInput } from "@/lib/validators/contact";

/**
 * Business logic for an inbound contact message.
 * STUB: notification (SMS/email) + persistence land here once those services
 * exist. Kept in the service layer so the route stays thin and this is
 * extractable later.
 */
export async function submitContactMessage(input: ContactInput): Promise<void> {
  // TODO: persist message + notify clinic via SMS/email gateway.
  console.info(`[contact] message received from ${input.phone}`);
}
