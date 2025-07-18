import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const path = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  const isPrivateRoute =
    path.startsWith("/profile") || path.startsWith("/notes");
  const isAuthRoute = ["/sign-in", "/sign-up"].includes(path);

  if (isPrivateRoute && !accessToken) {
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${origin}/api/auth/session`, {
          headers: { Cookie: `refreshToken=${refreshToken}` },
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          response.cookies.set("accessToken", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          return response;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
