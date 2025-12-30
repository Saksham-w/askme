import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// Middleware to protect routes based on authentication status
export async function middleware(request: NextRequest) {
  // Get the token from the request
  const token = await getToken({ req: request });
  // Get the requested URL
  const url = request.nextUrl;

  // Redirect logic based on authentication status and requested path
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (
    !token &&
    (url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url)); // Redirect unauthenticated users to sign-in
  }
  // Allow the request to proceed if none of the above conditions match
  return NextResponse.next();
}

// Specify the paths to apply the middleware
export const config = {
  matcher: ["/sign-in", "/dashboard/:path*", "/verify/:path*", "/sign-up", "/"],
};
