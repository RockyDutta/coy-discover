import { FeedProfile, MatchProfile, SwipeResponse } from "./types";

export async function getFeed(): Promise<FeedProfile[]> {
  const res = await fetch("/feed", { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Failed to fetch feed");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.profiles ?? [];
}

export async function postSwipe(profileId: string, action: "LIKE" | "PASS"): Promise<SwipeResponse> {
  const res = await fetch("/swipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId, action }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Failed to record swipe");
  }
  return res.json();
}

export async function getMatches(): Promise<MatchProfile[]> {
  const res = await fetch("/matches", { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Failed to fetch matches");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.matches ?? [];
}
