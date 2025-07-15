import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const currentPath = request.nextUrl.pathname;

  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession();
      if (session) {
        const response = NextResponse.next();
        response.cookies.set("accessToken", session.accessToken);
        response.cookies.set("refreshToken", session.refreshToken);
        return response;
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
    }
  }

  const isAuthRoute = ["/sign-in", "/sign-up"].includes(currentPath);
  const isPrivateRoute =
    currentPath.startsWith("/profile") || currentPath.startsWith("/notes");

  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
