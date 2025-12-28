import { NextRequest, NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  return NextResponse.redirect;
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
