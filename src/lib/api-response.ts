import { NextResponse } from "next/server";

/**
 * One API response shape everywhere. Route handlers return via these helpers
 * only — never build ad-hoc JSON bodies.
 */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiFailure {
  ok: false;
  error: { message: string; code?: string; details?: unknown };
}

export function apiResponse<T>(
  data: T,
  init?: { status?: number; meta?: Record<string, unknown> },
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    { ok: true, data, ...(init?.meta ? { meta: init.meta } : {}) },
    { status: init?.status ?? 200 },
  );
}

export function apiError(
  message: string,
  init?: { status?: number; code?: string; details?: unknown },
): NextResponse<ApiFailure> {
  return NextResponse.json(
    {
      ok: false,
      error: {
        message,
        ...(init?.code ? { code: init.code } : {}),
        ...(init?.details ? { details: init.details } : {}),
      },
    },
    { status: init?.status ?? 400 },
  );
}
