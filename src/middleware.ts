import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  const isLoggedIn = !!session?.user;
  const isAuthPage = request.nextUrl.pathname.startsWith("/signin");

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Define protected routes
export const config = {
  matcher: ["/signin", "/"],
};
