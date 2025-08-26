import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/favicon.ico",
    "/logo.svg",
    "/script.js",
  ];
  const isPublic =
    publicPaths.includes(pathname) ||
    pathname.startsWith("/articles") ||
    pathname.startsWith("/_next");

  if (isPublic) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token");
  if (!token) {
    const newUrl = new URL("/login", request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/((?!articles/*|login|register|_next|favicon.ico|logo.svg).*)"],
// };

export const config = {
  matcher: ["/:path*"],
};
