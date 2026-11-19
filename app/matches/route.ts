import { NextResponse } from "next/server";
import { getMatches } from "@/lib/matchService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const matches = await getMatches();
    return NextResponse.json({ matches });
  } catch (err: unknown) {
    console.error("GET /matches error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
