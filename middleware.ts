import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const currentPath = request.nextUrl.pathname;

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/session`,
        {
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        }
      );

      if (response.ok) {
        const setCookie = response.headers.get("set-cookie");
        if (setCookie) {
          const nextResponse = NextResponse.redirect(request.nextUrl);
          nextResponse.headers.set("Set-Cookie", setCookie);
          return nextResponse;
        }
      }
    } catch {
      console.error("Session refresh failed");
    }
  }

  const isAuthenticated = !!accessToken;
  const isAuthRoute = ["/sign-in", "/sign-up"].includes(currentPath);
  const isPrivateRoute = ["/profile", "/notes"].some((route) =>
    currentPath.startsWith(route)
  );

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
