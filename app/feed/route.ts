import { NextResponse } from "next/server";
import { getFeed } from "@/lib/feedService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profiles = await getFeed();
    return NextResponse.json({ profiles });
  } catch (err: unknown) {
    console.error("GET /feed error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
