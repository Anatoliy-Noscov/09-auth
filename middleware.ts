import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { api } from "./app/api/api";

export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && refreshToken) {
    try {
      const response = await api.get("auth/session", {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      if (response.headers["set-cookie"]) {
        const responseCookies = response.headers["set-cookie"];
        const nextResponse = NextResponse.next();

        responseCookies.forEach((cookie) => {
          nextResponse.headers.append("set-cookie", cookie);
        });

        return nextResponse;
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
