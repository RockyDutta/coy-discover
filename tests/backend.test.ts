import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { prisma } from "../lib/db";
import { CURRENT_USER_ID } from "../lib/constants";
import { getFeed } from "../lib/feedService";
import { recordSwipe } from "../lib/swipeService";
import { getMatches } from "../lib/matchesService";

describe("Coy Discover Backend Services & Business Rules", () => {
  beforeAll(async () => {
    // Ensure clean state before tests
    await prisma.match.deleteMany();
    await prisma.swipe.deleteMany();
    await prisma.profile.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Reset database tables
    await prisma.match.deleteMany();
    await prisma.swipe.deleteMany();
    await prisma.profile.deleteMany();

    // Create user 'me'
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

    // Create mock profiles p1, p2, p3
    await prisma.profile.createMany({
      data: [
        {
          id: "p1",
          name: "User One",
          age: 23,
          photoUrl: "https://example.com/p1.jpg",
          bio: "Bio 1",
          city: "NYC",
          interests: JSON.stringify(["Art", "Design"]),
          isDemoUser: false,
        },
        {
          id: "p2",
          name: "User Two",
          age: 24,
          photoUrl: "https://example.com/p2.jpg",
          bio: "Bio 2",
          city: "SF",
          interests: JSON.stringify(["Music"]),
          isDemoUser: false,
        },
        {
          id: "p3",
          name: "User Three",
          age: 25,
          photoUrl: "https://example.com/p3.jpg",
          bio: "Bio 3",
          city: "Austin",
          interests: JSON.stringify(["Running"]),
          isDemoUser: false,
        },
      ],
    });
  });

  it("Rule 1: Logged-in user is 'me'", () => {
    expect(CURRENT_USER_ID).toBe("me");
  });

  it("Rule 5 & 6: Feed excludes 'me', orders by id, and returns only the 7 allowed profile fields", async () => {
    // Seed an incoming like from p2 to 'me'
    await prisma.swipe.create({
      data: {
        fromId: "p2",
        toId: CURRENT_USER_ID,
        action: "LIKE",
      },
    });

    const feed = await getFeed();

    // Must exclude 'me'
    expect(feed.some((p) => p.id === CURRENT_USER_ID)).toBe(false);
    expect(feed.length).toBe(3);

    // Feed order must be strictly ordered by id (p1, p2, p3) regardless of incoming like
    expect(feed[0].id).toBe("p1");
    expect(feed[1].id).toBe("p2");
    expect(feed[2].id).toBe("p3");

    // Responses return ONLY these 7 fields: id, name, age, photoUrl, bio, city, interests
    const allowedKeys = ["id", "name", "age", "photoUrl", "bio", "city", "interests"].sort();
    for (const item of feed) {
      expect(Object.keys(item).sort()).toEqual(allowedKeys);
      expect(Array.isArray(item.interests)).toBe(true);
      // Must never return swipe rows or who liked the user
      expect((item as unknown as Record<string, unknown>).hasLikedMe).toBeUndefined();
      expect((item as unknown as Record<string, unknown>).action).toBeUndefined();
    }
  });

  it("Requirement 2: Swiped profiles never appear again in the feed", async () => {
    // Swipe left (pass) on p1
    await recordSwipe("p1", false);

    const feed = await getFeed();
    expect(feed.map((p) => p.id)).toEqual(["p2", "p3"]);
    expect(feed.some((p) => p.id === "p1")).toBe(false);
  });

  it("Rule 3 & 4: Records like, does not match if not mutual, matches atomically if mutual", async () => {
    // 1. One-sided like (me likes p1, but p1 hasn't liked me)
    const result1 = await recordSwipe("p1", true);
    expect(result1.isMatch).toBe(false);

    // Matches should be empty
    const matchesAfterOneSided = await getMatches();
    expect(matchesAfterOneSided.length).toBe(0);

    // 2. Mutual like (p2 previously liked 'me')
    await prisma.swipe.create({
      data: {
        fromId: "p2",
        toId: CURRENT_USER_ID,
        action: "LIKE",
      },
    });

    // Now 'me' likes p2
    const result2 = await recordSwipe("p2", true);
    expect(result2.isMatch).toBe(true);
    expect(result2.matchedProfile?.id).toBe("p2");
    expect(result2.matchedProfile?.name).toBe("User Two");

    // Check Match table in DB: smaller id first
    // 'me' vs 'p2': 'me' < 'p2' alphabetically
    const dbMatch = await prisma.match.findFirst();
    expect(dbMatch).not.toBeNull();
    const expectedA = "me" < "p2" ? "me" : "p2";
    const expectedB = "me" < "p2" ? "p2" : "me";
    expect(dbMatch?.userAId).toBe(expectedA);
    expect(dbMatch?.userBId).toBe(expectedB);

    // Check GET /matches returns the mutual match
    const matches = await getMatches();
    expect(matches.length).toBe(1);
    expect(matches[0].id).toBe("p2");
    expect(matches[0].name).toBe("User Two");
  });

  it("Passing does not create a match even if other user liked 'me'", async () => {
    // p3 likes 'me'
    await prisma.swipe.create({
      data: {
        fromId: "p3",
        toId: CURRENT_USER_ID,
        action: "LIKE",
      },
    });

    // 'me' passes on p3
    const result = await recordSwipe("p3", false);
    expect(result.isMatch).toBe(false);

    const matches = await getMatches();
    expect(matches.length).toBe(0);
  });
});
