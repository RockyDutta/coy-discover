import { prisma } from "./db";
import { CURRENT_USER_ID } from "./constants";
import { formatProfile } from "./formatProfile";
import { MatchProfile } from "./types";

/**
 * Returns the matches involving 'me' as a list of the other person's public profile fields.
 */
export async function getMatches(): Promise<MatchProfile[]> {
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { userAId: CURRENT_USER_ID },
        { userBId: CURRENT_USER_ID },
      ],
    },
    include: {
      userA: {
        select: {
          id: true,
          name: true,
          age: true,
          photoUrl: true,
          bio: true,
          city: true,
          interests: true,
        },
      },
      userB: {
        select: {
          id: true,
          name: true,
          age: true,
          photoUrl: true,
          bio: true,
          city: true,
          interests: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return matches.map((m) => {
    const otherUser = m.userAId === CURRENT_USER_ID ? m.userB : m.userA;
    return formatProfile(otherUser);
  });
}
