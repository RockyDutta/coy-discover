import { NextRequest, NextResponse } from "next/server";
import { recordSwipe } from "@/lib/swipeService";
import { BadRequestError, NotFoundError, ConflictError } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const profileId = body.profileId ?? body.targetId;
    if (!profileId || typeof profileId !== "string") {
      return NextResponse.json({ error: "profileId is required" }, { status: 400 });
    }

    const action =
      body.action ??
      (typeof body.isLike === "boolean"
        ? body.isLike
          ? "LIKE"
          : "PASS"
        : undefined);

    if (action !== "LIKE" && action !== "PASS") {
      return NextResponse.json(
        { error: "Action must be exactly 'LIKE' or 'PASS'" },
        { status: 400 }
      );
    }

    const result = await recordSwipe(profileId, action);

    return NextResponse.json({
      success: true,
      isMatch: result.isMatch,
      message: result.isMatch ? "It's a match!" : "Swipe recorded",
      ...(result.matchedProfile ? { matchedProfile: result.matchedProfile } : {}),
    });
  } catch (error: unknown) {
    if (error instanceof BadRequestError || (error as { status?: number })?.status === 400) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Bad Request" },
        { status: 400 }
      );
    }
    if (error instanceof NotFoundError || (error as { status?: number })?.status === 404) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Not Found" },
        { status: 404 }
      );
    }
    if (error instanceof ConflictError || (error as { status?: number })?.status === 409) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Conflict" },
        { status: 409 }
      );
    }
    console.error("POST /swipe error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
