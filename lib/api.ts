import { FeedProfile, MatchProfile, SwipeResponse } from "./types";

/**
 * Fetch the profile feed for 'me'
 */
export async function getFeed(): Promise<FeedProfile[]> {
  const res = await fetch("/feed", { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to fetch feed");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.profiles ?? [];
}

/**
 * Post a swipe action ('LIKE' or 'PASS') on target profileId
 */
export async function postSwipe(
  profileId: string,
  action: "LIKE" | "PASS"
): Promise<SwipeResponse> {
  const res = await fetch("/swipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId, action }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to record swipe");
  }

  return await res.json();
}

/**
 * Fetch the matches for 'me'
 */
export async function getMatches(): Promise<MatchProfile[]> {
  const res = await fetch("/matches", { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to fetch matches");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.matches ?? [];
}
