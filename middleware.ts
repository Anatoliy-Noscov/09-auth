import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./app/api/api";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const currentPath = request.nextUrl.pathname;

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(
        "https://notehub-api.goit.study/auth/session",
        {
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        }
      );

      if (response.ok) {
        const setCookie = response.headers.get("set-cookie");
        if (setCookie) {
          const nextResponse = NextResponse.next();
          nextResponse.headers.set("Set-Cookie", setCookie);
          return nextResponse;
        }
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
