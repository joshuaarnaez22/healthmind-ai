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

  if (!userId && publicRoutes(req)) {
    return NextResponse.next();
  }
  if (!userId) {
    const signInUrl = new URL("/", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const { publicMetadata } = await client.users.getUser(userId);
  const { role: userRole } = publicMetadata as { role: string };

  if (userRole === "admin" && publicRoutes(req)) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  if (userRole !== "admin" && adminRoutes(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (userRole === "user" && publicRoutes(req)) {
    return NextResponse.redirect(new URL("/user", req.url));
  }
  if (userRole !== "user" && userRoutes(req)) {
    return NextResponse.redirect(new URL("/", req.url));
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
