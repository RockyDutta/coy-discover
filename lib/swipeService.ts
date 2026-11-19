import { prisma } from "./db";
import { CURRENT_USER_ID } from "./constants";
import { BadRequestError, NotFoundError, ConflictError, SwipeResponse } from "./types";
import { formatProfile } from "./formatProfile";

export async function recordSwipe(
  profileId: string,
  actionOrIsLike: "LIKE" | "PASS" | boolean | string
): Promise<SwipeResponse> {
  // accept both string and boolean for flexibility
  const action =
    typeof actionOrIsLike === "boolean"
      ? actionOrIsLike ? "LIKE" : "PASS"
      : actionOrIsLike;

  if (action !== "LIKE" && action !== "PASS") {
    throw new BadRequestError("Action must be exactly 'LIKE' or 'PASS'");
  }

  if (profileId === CURRENT_USER_ID) {
    throw new BadRequestError("Cannot swipe on yourself");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const target = await tx.profile.findUnique({
        where: { id: profileId },
        select: { id: true },
      });
      if (!target) throw new NotFoundError(`Profile '${profileId}' not found`);

      const existing = await tx.swipe.findUnique({
        where: { fromId_toId: { fromId: CURRENT_USER_ID, toId: profileId } },
      });
      if (existing) throw new ConflictError(`Already swiped on profile '${profileId}'`);

      await tx.swipe.create({
        data: { fromId: CURRENT_USER_ID, toId: profileId, action },
      });

      if (action === "PASS") return { isMatch: false };

      // check if the other person already liked us
      const incoming = await tx.swipe.findUnique({
        where: { fromId_toId: { fromId: profileId, toId: CURRENT_USER_ID } },
      });

      if (incoming?.action === "LIKE") {
        const userAId = CURRENT_USER_ID < profileId ? CURRENT_USER_ID : profileId;
        const userBId = CURRENT_USER_ID < profileId ? profileId : CURRENT_USER_ID;

        await tx.match.create({ data: { userAId, userBId } });

        const matchedProfile = await tx.profile.findUnique({ where: { id: profileId } });

        return {
          isMatch: true,
          matchedProfile: matchedProfile ? formatProfile(matchedProfile) : undefined,
        };
      }

      return { isMatch: false };
    });
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === "P2002") {
      throw new ConflictError(`Already swiped on profile '${profileId}'`);
    }
    throw error;
  }
}
