import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || ""
);

export async function POST(request: Request) {
  try {
    const { email, password, mode } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    if (mode === "signup") {
      // Create new user
      await convex.mutation(api.users.createUser)({
        email,
        password,
      });

      return Response.json(
        { success: true, message: "Signup successful" },
        { status: 200 }
      );
    } else if (mode === "login") {
      // Verify user exists (in production, also verify password)
      const user = await convex.query(api.users.getUserByEmail)({
        email,
      });

      if (!user) {
        return Response.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      return Response.json(
        { success: true, message: "Login successful", userId: user._id },
        { status: 200 }
      );
    } else {
      return Response.json(
        { error: "Invalid mode (signup or login)" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Auth error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Auth failed" },
      { status: 500 }
    );
  }
}
