import { NextResponse } from "next/server";
import { getFeed } from "@/lib/feedService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profiles = await getFeed();
    return NextResponse.json({ profiles });
  } catch (error: unknown) {
    console.error("GET /feed error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
