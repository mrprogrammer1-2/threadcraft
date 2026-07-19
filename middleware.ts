import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const ADMIN_PERMISSION = "admin";

const hasAdminPermission = (token: any) => {
  if (!token) return false;
  const permissions =
    token.permissions ??
    token["x-hasura-permissions"] ??
    token.ksp?.permissions;
  if (Array.isArray(permissions)) return permissions.includes(ADMIN_PERMISSION);
  if (typeof permissions === "string")
    return (
      permissions === ADMIN_PERMISSION ||
      permissions.split(" ").includes(ADMIN_PERMISSION)
    );
  return false;
};

const intlMiddleware = createMiddleware(routing);

const adminAuthMiddleware = withAuth(async (request: Request) => {
  const kindeAuth = (request as any).kindeAuth;
  if (!kindeAuth || !hasAdminPermission(kindeAuth.token)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always run intl middleware first so locale headers/cookies stay in sync
  // with the URL, even on /admin routes.
  const intlResponse = intlMiddleware(request);

  if (/^\/[^/]+\/admin(\/|$)/.test(pathname)) {
    const authResponse = await (adminAuthMiddleware as any)(request);
    // Only step in if auth actually redirected (unauthenticated/unauthorized).
    // Otherwise defer to intlResponse so locale processing isn't discarded.
    if (
      authResponse &&
      authResponse.status >= 300 &&
      authResponse.status < 400
    ) {
      return authResponse;
    }
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
