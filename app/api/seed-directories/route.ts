import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import fs from "fs";
import path from "path";

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");
  }
  return new ConvexHttpClient(url);
}

/**
 * POST /api/seed-directories
 * 
 * Loads directories.json into the Convex database
 * This endpoint should only be called once during initialization
 * 
 * Optional query params:
 * - clearExisting=true: Clear existing directories before seeding
 * 
 * Example:
 * curl -X POST http://localhost:3000/api/seed-directories?clearExisting=true
 */
export async function POST(request: Request) {
  try {
    const convex = getConvexClient();
    
    // Read directories.json
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "directories.json");

    if (!fs.existsSync(filePath)) {
      return Response.json(
        { error: "directories.json not found in data/ directory" },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const directories = JSON.parse(fileContent);

    if (!Array.isArray(directories)) {
      return Response.json(
        { error: "directories.json must contain an array" },
        { status: 400 }
      );
    }

    // Get query params
    const url = new URL(request.url);
    const clearExisting = url.searchParams.get("clearExisting") === "true";

    // Call Convex mutation
    const result = await convex.mutation(api.directories.seedDirectories, {
      directories,
      clearExisting,
    });

    return Response.json({
      success: true,
      message: `Seeded ${result.inserted} directories`,
      ...result,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to seed directories",
      },
      { status: 500 }
    );
  }
}
