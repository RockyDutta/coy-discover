import { prisma } from "./prisma";
import { CURRENT_USER_ID } from "./constants";
import { formatProfile } from "./formatProfile";
import { SafeProfile } from "./types";

export async function getMatches(): Promise<SafeProfile[]> {
  // Find all matches where 'me' is either userA or userB
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { userAId: CURRENT_USER_ID },
        { userBId: CURRENT_USER_ID },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const partnerIds = matches.map((m) =>
    m.userAId === CURRENT_USER_ID ? m.userBId : m.userAId
  );

  if (partnerIds.length === 0) {
    return [];
  }

  const profiles = await prisma.profile.findMany({
    where: {
      id: { in: partnerIds },
    },
  });

  // Preserve the order of matches
  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const orderedProfiles = partnerIds
    .map((id) => profileMap.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return orderedProfiles.map(formatProfile);
}
