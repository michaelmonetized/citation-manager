"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Validate required environment variables at initialization
const missingVars = [];
if (!convexUrl) {
  missingVars.push("NEXT_PUBLIC_CONVEX_URL");
}
if (!clerkKey) {
  missingVars.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

if (missingVars.length > 0) {
  const message = `Missing required environment variables: ${missingVars.join(
    ", "
  )}. Please check your .env.local file.`;
  if (typeof window === "undefined") {
    console.error(message);
  }
  throw new Error(message);
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <ConvexProvider client={convex}>{children}</ConvexProvider>
    </ClerkProvider>
  );
}
