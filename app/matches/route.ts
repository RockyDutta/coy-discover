import { NextResponse } from "next/server";
import { getMatches } from "@/lib/matchesService";

export async function GET() {
  try {
    const matches = await getMatches();
    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error("GET /matches error:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
