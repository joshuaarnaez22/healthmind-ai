import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const publicRoutes = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/api/webhooks/clerk',
]);

const adminRoutes = createRouteMatcher(['/admin(.*)']);
const userRoutes = createRouteMatcher(['/user(.*)']);

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth();
    const client = await clerkClient();
    if (!userId && publicRoutes(req)) {
      return NextResponse.next(); // Allow unauthenticated users on public routes
    }

    if (!userId) {
      // Not authenticated and not a public route → redirect to homepage
      return NextResponse.redirect(new URL('/', req.url));
    }

    // ✅ Authenticated
    const { publicMetadata } = await client.users.getUser(userId);
    const userRole = (publicMetadata?.role as string) || 'user'; // Default to 'user' if missing

    // ✅ Redirect logged-in users away from public pages to appropriate dashboards
    if (publicRoutes(req)) {
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/user/dashboard', req.url));
    }

    // ✅ Block 'user' role from admin routes
    if (adminRoutes(req) && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // ✅ Block 'admin' role from user-only routes (optional, depends on your needs)
    if (userRoutes(req) && userRole !== 'user') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // ✅ Allow access
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/error', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
