import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { prisma } from "../lib/db";
import { CURRENT_USER_ID } from "../lib/constants";
import { getFeed } from "../lib/feedService";
import { recordSwipe } from "../lib/swipeService";
import { getMatches } from "../lib/matchService";
import { BadRequestError, NotFoundError, ConflictError } from "../lib/types";

describe("SwipeService Business Rules & Concurrency Tests", () => {
  beforeAll(async () => {
    // Ensure SQLite tables and constraints exist in the test database
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Profile" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "age" INTEGER NOT NULL,
        "photoUrl" TEXT NOT NULL,
        "bio" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "interests" TEXT NOT NULL,
        "isDemoUser" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Swipe" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "fromId" TEXT NOT NULL,
        "toId" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Swipe_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Swipe_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Match" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "userAId" TEXT NOT NULL,
        "userBId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Match_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Match_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Swipe_fromId_toId_key" ON "Swipe"("fromId", "toId");`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Match_userAId_userBId_key" ON "Match"("userAId", "userBId");`);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean all tables fresh before each test
    await prisma.match.deleteMany();
    await prisma.swipe.deleteMany();
    await prisma.profile.deleteMany();

    // 1. Seed demo user 'me'
    await prisma.profile.create({
      data: {
        id: CURRENT_USER_ID,
        name: "Alex",
        age: 22,
        photoUrl: "https://picsum.photos/seed/me/600/800",
        bio: "Test bio for me",
        city: "Stanford",
        interests: JSON.stringify(["Tech", "Coffee"]),
        isDemoUser: true,
      },
    });

    // 2. Seed mock candidate profiles p01..p06
    const mockProfiles = [
      { id: "p01", name: "Profile 01", age: 21, city: "NYC", interests: JSON.stringify(["Art", "Design"]) },
      { id: "p02", name: "Profile 02", age: 22, city: "SF", interests: JSON.stringify(["Music"]) },
      { id: "p03", name: "Profile 03", age: 23, city: "Austin", interests: JSON.stringify(["Running"]) },
      { id: "p04", name: "Profile 04", age: 24, city: "Seattle", interests: JSON.stringify(["Gaming"]) },
      { id: "p05", name: "Profile 05", age: 25, city: "Boston", interests: JSON.stringify(["Reading"]) },
      { id: "p06", name: "Profile 06", age: 26, city: "Chicago", interests: JSON.stringify(["Cooking"]) },
    ];

    await prisma.profile.createMany({
      data: mockProfiles.map((p) => ({
        ...p,
        photoUrl: `https://picsum.photos/seed/${p.id}/600/800`,
        bio: `Bio of ${p.name}`,
        isDemoUser: false,
      })),
    });

    // 3. Pre-seed incoming likes to 'me' from p04 and p05
    await prisma.swipe.createMany({
      data: [
        { fromId: "p04", toId: CURRENT_USER_ID, action: "LIKE" },
        { fromId: "p05", toId: CURRENT_USER_ID, action: "LIKE" },
      ],
    });
  });

  it("1. like a profile that has not liked me (no match)", async () => {
    // p01 has not liked me
    const result = await recordSwipe("p01", "LIKE");

    expect(result.isMatch).toBe(false);
    expect(result.matchedProfile).toBeUndefined();

    // Verify 0 matches created in database
    const matchCount = await prisma.match.count();
    expect(matchCount).toBe(0);

    // Verify swipe is recorded
    const swipe = await prisma.swipe.findUnique({
      where: { fromId_toId: { fromId: CURRENT_USER_ID, toId: "p01" } },
    });
    expect(swipe?.action).toBe("LIKE");
  });

  it("2. like a profile that liked me (match, exactly one Match row)", async () => {
    // p04 already liked 'me'
    const result = await recordSwipe("p04", "LIKE");

    expect(result.isMatch).toBe(true);
    expect(result.matchedProfile?.id).toBe("p04");

    // Exactly one Match row in DB
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ userAId: "p04" }, { userBId: "p04" }],
      },
    });
    expect(matches.length).toBe(1);

    // Lexicographically smaller id in userAId
    const expectedA = CURRENT_USER_ID < "p04" ? CURRENT_USER_ID : "p04";
    const expectedB = CURRENT_USER_ID < "p04" ? "p04" : CURRENT_USER_ID;
    expect(matches[0].userAId).toBe(expectedA);
    expect(matches[0].userBId).toBe(expectedB);
  });

  it("3. pass a profile that liked me (no match)", async () => {
    // p04 liked 'me', but 'me' passes
    const result = await recordSwipe("p04", "PASS");

    expect(result.isMatch).toBe(false);
    expect(result.matchedProfile).toBeUndefined();

    // No Match created
    const matchCount = await prisma.match.count();
    expect(matchCount).toBe(0);

    // Swipe is recorded as PASS
    const swipe = await prisma.swipe.findUnique({
      where: { fromId_toId: { fromId: CURRENT_USER_ID, toId: "p04" } },
    });
    expect(swipe?.action).toBe("PASS");
  });

  it("4. a repeated swipe is rejected and leaves one row", async () => {
    // First swipe succeeds
    await recordSwipe("p01", "LIKE");

    // Second swipe on p01 must be rejected with ConflictError
    await expect(recordSwipe("p01", "LIKE")).rejects.toThrow(ConflictError);
    await expect(recordSwipe("p01", "PASS")).rejects.toThrow(ConflictError);

    // Exactly one row exists in DB
    const count = await prisma.swipe.count({
      where: { fromId: CURRENT_USER_ID, toId: "p01" },
    });
    expect(count).toBe(1);
  });

  it("5. the feed excludes swiped profiles", async () => {
    // Initially, feed has all 6 profiles (p01..p06)
    const initialFeed = await getFeed();
    expect(initialFeed.map((p) => p.id)).toEqual(["p01", "p02", "p03", "p04", "p05", "p06"]);

    // Swipe on p01 (PASS) and p04 (LIKE)
    await recordSwipe("p01", "PASS");
    await recordSwipe("p04", "LIKE");

    // Swiped profiles must never appear in feed again
    const updatedFeed = await getFeed();
    const updatedIds = updatedFeed.map((p) => p.id);

    expect(updatedIds).toEqual(["p02", "p03", "p05", "p06"]);
    expect(updatedIds.includes("p01")).toBe(false);
    expect(updatedIds.includes("p04")).toBe(false);
  });

  it("6. the feed order is the same whether or not profiles have liked me", async () => {
    // p04 and p05 have liked 'me', while p01, p02, p03, p06 have not
    const feed = await getFeed();

    // Order must strictly be id ascending (p01, p02, p03, p04, p05, p06)
    const feedIds = feed.map((p) => p.id);
    expect(feedIds).toEqual(["p01", "p02", "p03", "p04", "p05", "p06"]);
  });

  it("7. matches are empty when there are only one-sided likes", async () => {
    // p04 liked 'me', but 'me' has not liked p04 yet
    // 'me' likes p01, who hasn't liked 'me'
    await recordSwipe("p01", "LIKE");

    const matches = await getMatches();
    expect(matches.length).toBe(0);
  });

  it("8. an invalid action or unknown profile is rejected", async () => {
    // Invalid action rejected with BadRequestError (400)
    await expect(recordSwipe("p01", "SUPERLIKE" as unknown as "LIKE")).rejects.toThrow(BadRequestError);
    await expect(recordSwipe("p01", "" as unknown as "LIKE")).rejects.toThrow(BadRequestError);

    // Unknown profile rejected with NotFoundError (404)
    await expect(recordSwipe("unknown_999", "LIKE")).rejects.toThrow(NotFoundError);

    // Swiping on self rejected with BadRequestError (400)
    await expect(recordSwipe(CURRENT_USER_ID, "LIKE")).rejects.toThrow(BadRequestError);
  });

  it("9. two simultaneous likes on a profile that liked me create only one match", async () => {
    // p05 liked 'me'
    // Fire two simultaneous likes on p05
    const results = await Promise.allSettled([
      recordSwipe("p05", "LIKE"),
      recordSwipe("p05", "LIKE"),
    ]);

    // One must succeed
    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);
    expect(rejected[0].status === "rejected" && rejected[0].reason instanceof ConflictError).toBe(true);

    // Exactly one Match row created in database
    const matchCount = await prisma.match.count({
      where: {
        OR: [{ userAId: "p05" }, { userBId: "p05" }],
      },
    });
    expect(matchCount).toBe(1);

    // Exactly one Swipe row created in database
    const swipeCount = await prisma.swipe.count({
      where: { fromId: CURRENT_USER_ID, toId: "p05" },
    });
    expect(swipeCount).toBe(1);
  });
});
