import { prisma } from "./db";
import { CURRENT_USER_ID } from "./constants";
import { BadRequestError, NotFoundError, ConflictError, SwipeResponse } from "./types";
import { formatProfile } from "./formatProfile";

/**
 * Record a swipe for the demo user ('me') inside one atomic transaction:
 *   1. Validate action is strictly 'LIKE' or 'PASS'.
 *   2. Verify the target profile exists.
 *   3. Ensure 'me' hasn't already swiped this profile.
 *   4. Insert the swipe row.
 *   5. If the action is 'LIKE' and the target already liked 'me',
 *      create a Match with the smaller ID as `userAId` and return { isMatch: true }.
 *   6. Otherwise return { isMatch: false }.
 */
export async function recordSwipe(
  profileId: string,
  actionOrIsLike: "LIKE" | "PASS" | boolean | string
): Promise<SwipeResponse> {
  // Normalize action: accept boolean or string
  const action =
    typeof actionOrIsLike === "boolean"
      ? actionOrIsLike
        ? "LIKE"
        : "PASS"
      : actionOrIsLike;

  // Validate action is strictly 'LIKE' or 'PASS'
  if (action !== "LIKE" && action !== "PASS") {
    throw new BadRequestError("Action must be exactly 'LIKE' or 'PASS'");
  }

  // Prevent a user from swiping on themselves
  if (profileId === CURRENT_USER_ID) {
    throw new BadRequestError("Cannot swipe on yourself");
  }

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Verify the profile exists
    const targetProfile = await tx.profile.findUnique({
      where: { id: profileId },
      select: { id: true },
    });
    if (!targetProfile) {
      throw new NotFoundError(`Profile '${profileId}' not found`);
    }

    // 2️⃣ Ensure we haven't already swiped this profile
    const existingSwipe = await tx.swipe.findUnique({
      where: {
        fromId_toId: {
          fromId: CURRENT_USER_ID,
          toId: profileId,
        },
      },
    });
    if (existingSwipe) {
      throw new ConflictError(`Already swiped on profile '${profileId}'`);
    }

    // 3️⃣ Persist the swipe
    await tx.swipe.create({
      data: {
        fromId: CURRENT_USER_ID,
        toId: profileId,
        action,
      },
    });

    // PASS cannot create a match
    if (action === "PASS") {
      return { isMatch: false };
    }

    // 4️⃣ For LIKE, check if the opposite direction already has a LIKE
    const incoming = await tx.swipe.findUnique({
      where: {
        fromId_toId: {
          fromId: profileId,
          toId: CURRENT_USER_ID,
        },
      },
    });

    if (incoming && incoming.action === "LIKE") {
      // Order IDs so the lexicographically smaller one is userAId
      const userAId = CURRENT_USER_ID < profileId ? CURRENT_USER_ID : profileId;
      const userBId = CURRENT_USER_ID < profileId ? profileId : CURRENT_USER_ID;

      await tx.match.create({
        data: { userAId, userBId },
      });

      const matchedProfile = await tx.profile.findUnique({
        where: { id: profileId },
      });

      return {
        isMatch: true,
        matchedProfile: matchedProfile ? formatProfile(matchedProfile) : undefined,
      };
    }

    // No mutual like → no match
    return { isMatch: false };
  });
}
