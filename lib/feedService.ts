import { prisma } from "./db";
import { CURRENT_USER_ID } from "./constants";
import { formatProfile } from "./formatProfile";
import { FeedProfile } from "./types";

/**
 * Returns the feed for the demo user.
 *   - Excludes the demo user itself.
 *   - Excludes any profile the demo user has already swiped on (LIKE or PASS).
 *   - Ordered by `id` ascending.
 *   - Returns only the public fields, with `interests` parsed into an array.
 */
export async function getFeed(): Promise<FeedProfile[]> {
  // 1️⃣ Find IDs that the demo user has already swiped on
  const swiped = await prisma.swipe.findMany({
    where: { fromId: CURRENT_USER_ID },
    select: { toId: true },
  });
  const excludedIds = swiped.map((s) => s.toId);
  excludedIds.push(CURRENT_USER_ID);

  // 2️⃣ Fetch the remaining profiles
  const rawProfiles = await prisma.profile.findMany({
    where: { id: { notIn: excludedIds } },
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      age: true,
      photoUrl: true,
      bio: true,
      city: true,
      interests: true,
    },
  });

  // 3️⃣ Convert DB rows to the public shape
  return rawProfiles.map((p) => formatProfile(p));
}
