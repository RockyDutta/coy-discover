import { prisma } from "./prisma";
import { CURRENT_USER_ID } from "./constants";
import { formatProfile } from "./formatProfile";
import { SafeProfile } from "./types";

export async function getFeed(): Promise<SafeProfile[]> {
  // Find all profile IDs that the logged-in user has already swiped on
  const swiped = await prisma.swipe.findMany({
    where: { fromId: CURRENT_USER_ID },
    select: { toId: true },
  });

  const swipedIds = swiped.map((s) => s.toId);
  const excludedIds = [CURRENT_USER_ID, ...swipedIds];

  // Fetch profiles not yet swiped on, excluding 'me', ordered strictly by id
  const profiles = await prisma.profile.findMany({
    where: {
      id: { notIn: excludedIds },
    },
    orderBy: {
      id: "asc",
    },
  });

  return profiles.map(formatProfile);
}
