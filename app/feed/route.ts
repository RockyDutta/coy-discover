import { NextResponse } from "next/server";
import { getFeed } from "@/lib/feedService";

export async function GET() {
  try {
    const feed = await getFeed();
    return NextResponse.json(feed, { status: 200 });
  } catch (error) {
    console.error("GET /feed error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
