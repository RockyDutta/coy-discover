import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { prisma } from "../lib/db";
import { CURRENT_USER_ID } from "../lib/constants";
import { getFeed } from "../lib/feedService";
import { recordSwipe } from "../lib/swipeService";
import { getMatches } from "../lib/matchService";
import { BadRequestError, NotFoundError, ConflictError } from "../lib/types";

describe("Coy Discover Backend Services & Business Rules", () => {
  beforeAll(async () => {
    // make sure all tables exist in the test db before anything runs
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

    await prisma.match.deleteMany();
    await prisma.swipe.deleteMany();
    await prisma.profile.deleteMany();
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
        photoUrl: "https://example.com/me.jpg",
        bio: "Test bio for me",
        city: "Stanford",
        interests: JSON.stringify(["Tech", "Coffee"]),
        isDemoUser: true,
      },
    });

    await prisma.profile.createMany({
      data: [
        { id: "p1", name: "User One", age: 23, photoUrl: "https://example.com/p1.jpg", bio: "Bio 1", city: "NYC", interests: JSON.stringify(["Art", "Design"]), isDemoUser: false },
        { id: "p2", name: "User Two", age: 24, photoUrl: "https://example.com/p2.jpg", bio: "Bio 2", city: "SF", interests: JSON.stringify(["Music"]), isDemoUser: false },
        { id: "p3", name: "User Three", age: 25, photoUrl: "https://example.com/p3.jpg", bio: "Bio 3", city: "Austin", interests: JSON.stringify(["Running"]), isDemoUser: false },
      ],
    });
  });

  it("current user id is 'me'", () => {
    expect(CURRENT_USER_ID).toBe("me");
  });

  it("feed excludes 'me', is ordered by id, and returns only public fields", async () => {
    await prisma.swipe.create({ data: { fromId: "p2", toId: CURRENT_USER_ID, action: "LIKE" } });

    const feed = await getFeed();

    expect(feed.some((p) => p.id === CURRENT_USER_ID)).toBe(false);
    expect(feed.length).toBe(3);
    expect(feed[0].id).toBe("p1");
    expect(feed[1].id).toBe("p2");
    expect(feed[2].id).toBe("p3");

    const allowedKeys = ["id", "name", "age", "photoUrl", "bio", "city", "interests"].sort();
    for (const item of feed) {
      expect(Object.keys(item).sort()).toEqual(allowedKeys);
      expect(Array.isArray(item.interests)).toBe(true);
      expect((item as unknown as Record<string, unknown>).hasLikedMe).toBeUndefined();
      expect((item as unknown as Record<string, unknown>).action).toBeUndefined();
    }
  });

  it("swiped profiles never appear in the feed again", async () => {
    await recordSwipe("p1", false);
    const feed = await getFeed();
    expect(feed.map((p) => p.id)).toEqual(["p2", "p3"]);
    expect(feed.some((p) => p.id === "p1")).toBe(false);
  });

  it("records a one-sided like (no match), then creates a match on mutual like", async () => {
    const r1 = await recordSwipe("p1", true);
    expect(r1.isMatch).toBe(false);
    expect((await getMatches()).length).toBe(0);

    // p2 likes me first
    await prisma.swipe.create({ data: { fromId: "p2", toId: CURRENT_USER_ID, action: "LIKE" } });

    const r2 = await recordSwipe("p2", true);
    expect(r2.isMatch).toBe(true);
    expect(r2.matchedProfile?.id).toBe("p2");
    expect(r2.matchedProfile?.name).toBe("User Two");

    const dbMatch = await prisma.match.findFirst();
    expect(dbMatch).not.toBeNull();
    const a = "me" < "p2" ? "me" : "p2";
    const b = "me" < "p2" ? "p2" : "me";
    expect(dbMatch?.userAId).toBe(a);
    expect(dbMatch?.userBId).toBe(b);

    const matches = await getMatches();
    expect(matches.length).toBe(1);
    expect(matches[0].id).toBe("p2");
  });

  it("passing on someone who liked me does not create a match", async () => {
    await prisma.swipe.create({ data: { fromId: "p3", toId: CURRENT_USER_ID, action: "LIKE" } });
    const result = await recordSwipe("p3", false);
    expect(result.isMatch).toBe(false);
    expect((await getMatches()).length).toBe(0);
  });

  it("rejects invalid actions, non-existent profiles, and duplicate swipes", async () => {
    await expect(recordSwipe("p1", "SUPERLIKE" as unknown as "LIKE")).rejects.toThrow(BadRequestError);
    await expect(recordSwipe("non_existent_id", "LIKE")).rejects.toThrow(NotFoundError);
    await expect(recordSwipe(CURRENT_USER_ID, "LIKE")).rejects.toThrow(BadRequestError);

    await recordSwipe("p1", "LIKE");
    await expect(recordSwipe("p1", "PASS")).rejects.toThrow(ConflictError);
  });
});
