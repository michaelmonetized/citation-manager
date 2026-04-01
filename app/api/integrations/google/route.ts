import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * POST /api/integrations/google
 * Submit a location to Google Business Profile
 */
export async function POST(request: NextRequest) {
  try {
    const { locationId, directoryId } = await request.json();

    if (!locationId || !directoryId) {
      return NextResponse.json(
        { error: "Missing locationId or directoryId" },
        { status: 400 }
      );
    }

    // Call Convex mutation
    const result = await convex.mutation(api.submitGoogle.submitGoogle, {
      locationId,
      directoryId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Google submission error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/integrations/google
 * Verify Google Business Profile submission
 */
export async function PUT(request: NextRequest) {
  try {
    const { submissionId, googleAccountId, googleLocationId } =
      await request.json();

    if (!submissionId || !googleAccountId || !googleLocationId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Call Convex mutation
    const result = await convex.mutation(api.submitGoogle.verifyGoogle, {
      submissionId,
      googleAccountId,
      googleLocationId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Google verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
