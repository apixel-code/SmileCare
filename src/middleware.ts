import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/server/auth/session";

const STAFF_ROLES = ["admin", "doctor", "receptionist"];

/** Edge guard for the protected areas. Role logic lives here + guard.ts only. */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login pages are public.
  if (pathname === "/portal/login" || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const loginUrl = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  };

  if (pathname.startsWith("/portal")) {
    if (session?.role !== "patient") return loginUrl("/portal/login");
  }

  if (pathname.startsWith("/admin")) {
    if (!session || !STAFF_ROLES.includes(session.role)) {
      return loginUrl("/admin/login");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
