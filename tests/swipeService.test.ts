import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { prisma } from "../lib/db";
import { CURRENT_USER_ID } from "../lib/constants";
import { getFeed } from "../lib/feedService";
import { recordSwipe } from "../lib/swipeService";
import { getMatches } from "../lib/matchService";
import { BadRequestError, NotFoundError, ConflictError } from "../lib/types";

describe("SwipeService Business Rules & Concurrency Tests", () => {
  beforeAll(async () => {
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
    await prisma.match.deleteMany();
    await prisma.swipe.deleteMany();
    await prisma.profile.deleteMany();

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

    await prisma.profile.createMany({
      data: [
        { id: "p01", name: "Profile 01", age: 21, city: "NYC", interests: JSON.stringify(["Art", "Design"]) },
        { id: "p02", name: "Profile 02", age: 22, city: "SF", interests: JSON.stringify(["Music"]) },
        { id: "p03", name: "Profile 03", age: 23, city: "Austin", interests: JSON.stringify(["Running"]) },
        { id: "p04", name: "Profile 04", age: 24, city: "Seattle", interests: JSON.stringify(["Gaming"]) },
        { id: "p05", name: "Profile 05", age: 25, city: "Boston", interests: JSON.stringify(["Reading"]) },
        { id: "p06", name: "Profile 06", age: 26, city: "Chicago", interests: JSON.stringify(["Cooking"]) },
      ].map((p) => ({
        ...p,
        photoUrl: `https://picsum.photos/seed/${p.id}/600/800`,
        bio: `Bio of ${p.name}`,
        isDemoUser: false,
      })),
    });

    // p04 and p05 have already liked 'me'
    await prisma.swipe.createMany({
      data: [
        { fromId: "p04", toId: CURRENT_USER_ID, action: "LIKE" },
        { fromId: "p05", toId: CURRENT_USER_ID, action: "LIKE" },
      ],
    });
  });

  it("like a profile that has not liked me — no match", async () => {
    const result = await recordSwipe("p01", "LIKE");
    expect(result.isMatch).toBe(false);
    expect(result.matchedProfile).toBeUndefined();
    expect(await prisma.match.count()).toBe(0);

    const swipe = await prisma.swipe.findUnique({
      where: { fromId_toId: { fromId: CURRENT_USER_ID, toId: "p01" } },
    });
    expect(swipe?.action).toBe("LIKE");
  });

  it("like a profile that liked me — creates exactly one match", async () => {
    const result = await recordSwipe("p04", "LIKE");
    expect(result.isMatch).toBe(true);
    expect(result.matchedProfile?.id).toBe("p04");

    const matches = await prisma.match.findMany({
      where: { OR: [{ userAId: "p04" }, { userBId: "p04" }] },
    });
    expect(matches.length).toBe(1);

    const a = CURRENT_USER_ID < "p04" ? CURRENT_USER_ID : "p04";
    const b = CURRENT_USER_ID < "p04" ? "p04" : CURRENT_USER_ID;
    expect(matches[0].userAId).toBe(a);
    expect(matches[0].userBId).toBe(b);
  });

  it("pass a profile that liked me — no match", async () => {
    const result = await recordSwipe("p04", "PASS");
    expect(result.isMatch).toBe(false);
    expect(result.matchedProfile).toBeUndefined();
    expect(await prisma.match.count()).toBe(0);

    const swipe = await prisma.swipe.findUnique({
      where: { fromId_toId: { fromId: CURRENT_USER_ID, toId: "p04" } },
    });
    expect(swipe?.action).toBe("PASS");
  });

  it("duplicate swipe is rejected and leaves exactly one row", async () => {
    await recordSwipe("p01", "LIKE");
    await expect(recordSwipe("p01", "LIKE")).rejects.toThrow(ConflictError);
    await expect(recordSwipe("p01", "PASS")).rejects.toThrow(ConflictError);

    const count = await prisma.swipe.count({ where: { fromId: CURRENT_USER_ID, toId: "p01" } });
    expect(count).toBe(1);
  });

  it("swiped profiles are excluded from the feed", async () => {
    expect((await getFeed()).map((p) => p.id)).toEqual(["p01", "p02", "p03", "p04", "p05", "p06"]);

    await recordSwipe("p01", "PASS");
    await recordSwipe("p04", "LIKE");

    const ids = (await getFeed()).map((p) => p.id);
    expect(ids).toEqual(["p02", "p03", "p05", "p06"]);
    expect(ids.includes("p01")).toBe(false);
    expect(ids.includes("p04")).toBe(false);
  });

  it("feed order is unaffected by incoming likes", async () => {
    const ids = (await getFeed()).map((p) => p.id);
    expect(ids).toEqual(["p01", "p02", "p03", "p04", "p05", "p06"]);
  });

  it("matches list is empty when all likes are one-sided", async () => {
    await recordSwipe("p01", "LIKE");
    expect((await getMatches()).length).toBe(0);
  });

  it("rejects invalid action and unknown profile", async () => {
    await expect(recordSwipe("p01", "SUPERLIKE" as unknown as "LIKE")).rejects.toThrow(BadRequestError);
    await expect(recordSwipe("p01", "" as unknown as "LIKE")).rejects.toThrow(BadRequestError);
    await expect(recordSwipe("unknown_999", "LIKE")).rejects.toThrow(NotFoundError);
    await expect(recordSwipe(CURRENT_USER_ID, "LIKE")).rejects.toThrow(BadRequestError);
  });

  it("two simultaneous likes on a mutual profile create only one match row", async () => {
    const results = await Promise.allSettled([
      recordSwipe("p05", "LIKE"),
      recordSwipe("p05", "LIKE"),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);
    expect(rejected[0].status === "rejected" && rejected[0].reason instanceof ConflictError).toBe(true);

    expect(await prisma.match.count({ where: { OR: [{ userAId: "p05" }, { userBId: "p05" }] } })).toBe(1);
    expect(await prisma.swipe.count({ where: { fromId: CURRENT_USER_ID, toId: "p05" } })).toBe(1);
  });
});
