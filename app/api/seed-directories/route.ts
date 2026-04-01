import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

/**
 * POST /api/seed-directories
 * Populates the directories table from data/directories.json
 * Safe to call multiple times — skips duplicates
 */
export async function POST() {
  try {
    const client = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || ""
    );

    const result = await client.mutation(api.directories.seedFromFile, {
      clearExisting: false,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
