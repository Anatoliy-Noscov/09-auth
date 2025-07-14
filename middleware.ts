import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const authResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/session`,
        {
          method: "GET",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        }
      );

      if (authResponse.ok) {
        const setCookieHeader = authResponse.headers.get("set-cookie");
        if (setCookieHeader) {
          response.headers.set("set-cookie", setCookieHeader);
        }
        return response;
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
    }
  }

  const isAuthenticated = !!accessToken || !!refreshToken;
  const isAuthRoute = ["/sign-in", "/sign-up"].some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isPrivateRoute = ["/profile", "/notes"].some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
