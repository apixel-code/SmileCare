import { SESSION_COOKIE } from "@/server/auth/session";
import { apiResponse } from "@/lib/api-response";

export async function POST() {
  const res = apiResponse({ loggedOut: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
