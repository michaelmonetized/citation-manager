import { ConvexClient } from "convex/browser";
import * as functions from "./convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

export const convex = new ConvexClient(convexUrl);

// Export mutation/query helpers
export const api = functions;
