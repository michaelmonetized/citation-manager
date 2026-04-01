import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/submit(.*)",
  "/submissions(.*)",
  "/locations(.*)",
  "/dashboard(.*)",
  "/directories(.*)",
  "/api/integrations(.*)",
]);

// PHASE 2B: Bypass Clerk entirely for testing
// Remove this wrapper before production
const bypassAuth = process.env.PHASE2B_BYPASS_AUTH === "true";

const middleware = bypassAuth
  ? (_req: NextRequest) => NextResponse.next()
  : clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    });

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
