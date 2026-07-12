/**
 * SMS gateway stub — BD gateway integration lands here (SMS_API_KEY in env).
 * In dev it logs to the server console so flows are testable end-to-end.
 */
export async function sendSms(phone: string, message: string): Promise<void> {
  if (process.env.SMS_API_KEY) {
    // TODO: call the real BD SMS gateway.
    return;
  }
  console.info(`[sms → ${phone}] ${message}`);
}
