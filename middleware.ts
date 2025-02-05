import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);
const adminRoutes = createRouteMatcher(["/admin(.*)"]);
const userRoutes = createRouteMatcher(["/user(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const client = await clerkClient();

  // Allow public routes
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const { publicMetadata } = await client.users.getUser(userId);
  const { role: userRole } = publicMetadata as { role: string };

  if (
    req.url.includes("/sign-in") ||
    req.url.includes("/sign-up") ||
    req.url.endsWith("/")
  ) {
    const redirectUrl = userRole === "admin" ? "/admin" : "/user";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }
  // Handle role-based route protection
  if (userRole === "admin" && userRoutes(req)) {
    return NextResponse.redirect(new URL("/admin", req.url));
  } else if (userRole === "user" && adminRoutes(req)) {
    return NextResponse.redirect(new URL("/user", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
