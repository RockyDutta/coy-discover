import { prisma } from "./db";
import { CURRENT_USER_ID } from "./constants";
import { formatProfile } from "./formatProfile";
import { MatchProfile } from "./types";

export async function getMatches(): Promise<MatchProfile[]> {
  const matches = await prisma.match.findMany({
    where: {
      OR: [{ userAId: CURRENT_USER_ID }, { userBId: CURRENT_USER_ID }],
    },
    include: {
      userA: {
        select: { id: true, name: true, age: true, photoUrl: true, bio: true, city: true, interests: true },
      },
      userB: {
        select: { id: true, name: true, age: true, photoUrl: true, bio: true, city: true, interests: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return matches.map((m) => {
    const other = m.userAId === CURRENT_USER_ID ? m.userB : m.userA;
    return formatProfile(other);
  });
}
