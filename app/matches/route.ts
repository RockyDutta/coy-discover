import { NextResponse } from "next/server";
import { getMatches } from "@/lib/matchService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const matches = await getMatches();
    return NextResponse.json({ matches });
  } catch (error: unknown) {
    console.error("GET /matches error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
