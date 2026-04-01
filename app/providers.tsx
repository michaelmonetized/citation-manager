"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // PHASE 2B: For testing without Clerk keys, use ConvexProvider only
  // This is development/testing mode - auth is optional
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
