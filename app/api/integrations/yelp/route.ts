import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * POST /api/integrations/yelp
 * Submit a location to Yelp Business API
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
    const result = await convex.mutation(api.submitYelp.submitYelp, {
      locationId,
      directoryId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Yelp submission error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/integrations/yelp
 * Verify Yelp Business submission
 */
export async function PUT(request: NextRequest) {
  try {
    const { submissionId, yelpId } = await request.json();

    if (!submissionId || !yelpId) {
      return NextResponse.json(
        { error: "Missing submissionId or yelpId" },
        { status: 400 }
      );
    }

    // Call Convex mutation
    const result = await convex.mutation(api.submitYelp.verifyYelp, {
      submissionId,
      yelpId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Yelp verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
