import { NextResponse } from "next/server";
import { recordSwipe } from "@/lib/swipeService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetId, isLike } = body;

    if (!targetId || typeof isLike !== "boolean") {
      return NextResponse.json(
        { error: "targetId and isLike (boolean) are required" },
        { status: 400 }
      );
    }

    const result = await recordSwipe(targetId, isLike);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("POST /swipe error:", error);
    return NextResponse.json(
      { error: "Failed to process swipe" },
      { status: 500 }
    );
  }
}
