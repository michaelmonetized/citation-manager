import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * POST /api/integrations/facebook
 * Submit a location to Facebook Graph API
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
    const result = await convex.mutation(api.submitFacebook.submitFacebook, {
      locationId,
      directoryId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Facebook submission error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/integrations/facebook
 * Verify Facebook submission
 */
export async function PUT(request: NextRequest) {
  try {
    const { submissionId, facebookPageId } = await request.json();

    if (!submissionId || !facebookPageId) {
      return NextResponse.json(
        { error: "Missing submissionId or facebookPageId" },
        { status: 400 }
      );
    }

    // Call Convex mutation
    const result = await convex.mutation(api.submitFacebook.verifyFacebook, {
      submissionId,
      facebookPageId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Facebook verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
