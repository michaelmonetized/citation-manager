import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, mode } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // For MVP: just validate email exists in form
    // In production: call Convex mutations via HTTP
    if (mode === "signup") {
      // Create new user (would call Convex mutation)
      return NextResponse.json(
        { success: true, message: "Signup successful" },
        { status: 200 }
      );
    } else if (mode === "login") {
      // Verify user (would call Convex query)
      return NextResponse.json(
        { success: true, message: "Login successful" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid mode (signup or login)" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Auth failed" },
      { status: 500 }
    );
  }
}
