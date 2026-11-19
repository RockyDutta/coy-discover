import { prisma } from "./db";
import { CURRENT_USER_ID } from "./constants";
import { formatProfile } from "./formatProfile";
import { FeedProfile } from "./types";

export async function getFeed(): Promise<FeedProfile[]> {
  // find everything 'me' has already swiped on
  const swiped = await prisma.swipe.findMany({
    where: { fromId: CURRENT_USER_ID },
    select: { toId: true },
  });

  const excludedIds = swiped.map((s) => s.toId);
  excludedIds.push(CURRENT_USER_ID);

  const profiles = await prisma.profile.findMany({
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

  return profiles.map((p) => formatProfile(p));
}
