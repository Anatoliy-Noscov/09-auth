import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const session = await checkSession();

  if (!session && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
