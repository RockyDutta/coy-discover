import { prisma } from "./prisma";
import { CURRENT_USER_ID } from "./constants";
import { formatProfile } from "./formatProfile";
import { SwipeResponse } from "./types";

export async function recordSwipe(
  targetId: string,
  isLike: boolean
): Promise<SwipeResponse> {
  if (!targetId || typeof targetId !== "string" || targetId === CURRENT_USER_ID) {
    throw new Error("Invalid target profile");
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Record the swipe from logged-in user ('me') to target profile
    await tx.swipe.upsert({
      where: {
        fromId_toId: {
          fromId: CURRENT_USER_ID,
          toId: targetId,
        },
      },
      update: {
        isLike,
      },
      create: {
        fromId: CURRENT_USER_ID,
        toId: targetId,
        isLike,
      },
    });

    // If it's a pass, no match can be created
    if (!isLike) {
      return { isMatch: false };
    }

    // 2. Check if the target profile has liked 'me'
    const targetSwipe = await tx.swipe.findUnique({
      where: {
        fromId_toId: {
          fromId: targetId,
          toId: CURRENT_USER_ID,
        },
      },
    });

    if (targetSwipe && targetSwipe.isLike) {
      // Rule 3: Match is unique on (userAId, userBId) with the smaller id first
      const userAId = CURRENT_USER_ID < targetId ? CURRENT_USER_ID : targetId;
      const userBId = CURRENT_USER_ID < targetId ? targetId : CURRENT_USER_ID;

      await tx.match.upsert({
        where: {
          userAId_userBId: {
            userAId,
            userBId,
          },
        },
        update: {},
        create: {
          userAId,
          userBId,
        },
      });

      const matchedProfile = await tx.profile.findUnique({
        where: { id: targetId },
      });

      return {
        isMatch: true,
        matchedProfile: matchedProfile ? formatProfile(matchedProfile) : undefined,
      };
    }

    return { isMatch: false };
  });
}
