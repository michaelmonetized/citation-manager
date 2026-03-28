import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { hash } from "argon2";

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");
  }
  return new ConvexHttpClient(url);
}

export async function POST(request: NextRequest) {
  try {
    const convex = getConvexClient();
    const { email, password, mode } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (mode === "signup") {
      try {
        // Hash password on server side using Argon2id
        const hashedPassword = await hash(password);

        const result = await convex.mutation(api.users.signupUser, {
          email,
          hashedPassword,
        });
        // Create a simple token (in production, use JWT)
        const token = Buffer.from(JSON.stringify({ userId: result.userId, email, timestamp: Date.now() })).toString('base64');
        return NextResponse.json(
          { success: true, message: "Signup successful", userId: result.userId, token },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            error:
              error instanceof Error ? error.message : "Signup failed",
          },
          { status: 400 }
        );
      }
    } else if (mode === "login") {
      try {
        // Hash the password attempt on server side for comparison
        const hashedPasswordAttempt = await hash(password);

        const result = await convex.query(api.users.loginUser, {
          email,
          hashedPasswordAttempt,
        });
        // Create a simple token (in production, use JWT)
        const token = Buffer.from(JSON.stringify({ userId: result.userId, email, timestamp: Date.now() })).toString('base64');
        return NextResponse.json(
          { success: true, message: "Login successful", userId: result.userId, token },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            error:
              error instanceof Error ? error.message : "Login failed",
          },
          { status: 401 }
        );
      }
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
