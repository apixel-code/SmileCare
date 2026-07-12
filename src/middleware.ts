import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/server/auth/session";
import { canAccessAdminPath, canAccessAdminApi } from "@/lib/permissions";

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

  const unauthorized = () =>
    NextResponse.json(
      { ok: false, error: { message: "Please log in." } },
      { status: 401 },
    );
  const loginUrl = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  };

  // APIs get 401 JSON; pages get a login redirect.
  if (pathname.startsWith("/api/portal")) {
    if (session?.role !== "patient") return unauthorized();
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/admin")) {
    if (!session || !STAFF_ROLES.includes(session.role)) return unauthorized();
    if (!canAccessAdminApi(session.role, pathname)) {
      return NextResponse.json(
        { ok: false, error: { message: "Your role doesn't have access to this." } },
        { status: 403 },
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/portal")) {
    if (session?.role !== "patient") return loginUrl("/portal/login");
  }

  if (pathname.startsWith("/admin")) {
    if (!session || !STAFF_ROLES.includes(session.role)) {
      return loginUrl("/admin/login");
    }
    // Role-restricted screens (matrix in lib/permissions.ts) → back to queue.
    if (!canAccessAdminPath(session.role, pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/portal/:path*",
    "/admin/:path*",
    "/api/portal/:path*",
    "/api/admin/:path*",
  ],
};
