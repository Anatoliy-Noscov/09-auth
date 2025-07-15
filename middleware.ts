import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const currentPath = request.nextUrl.pathname;

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(
        "https://notehub-api.goit.study/api/auth/session",
        {
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const res = NextResponse.next();

        res.cookies.set({
          name: "accessToken",
          value: data.accessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });

        res.cookies.set({
          name: "refreshToken",
          value: data.refreshToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });

        return res;
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
      return NextResponse.redirect(new URL("/sign-in", request.url));
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
