import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const currentPath = request.nextUrl.pathname;

  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession();

      if (session?.data) {
        const response = NextResponse.redirect(request.nextUrl);

        response.cookies.set({
          name: "accessToken",
          value: session.data.accessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });

        response.cookies.set({
          name: "refreshToken",
          value: session.data.refreshToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });

        return response;
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
