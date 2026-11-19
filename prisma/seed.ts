import prisma from "../lib/db";

/**
 * Seed script for the Coy Discover app.
 *
 * - Clears existing Swipe, Match, and Profile tables.
 * - Inserts the logged‑in demo user (`me`).
 * - Inserts 32 mock profiles (`p01`‑`p32`).
 * - Inserts six incoming likes (Swipe rows) pointing to `me`.
 * - Prints a short summary.
 *
 * Run with: `npx tsx prisma/seed.ts`
 */

async function main() {
  // ---------------------------------------------------------------------
  // 1️⃣  Clean existing data (safe to run repeatedly)
  // ---------------------------------------------------------------------
  await prisma.swipe.deleteMany();
  await prisma.match.deleteMany();
  await prisma.profile.deleteMany();

  // ---------------------------------------------------------------------
  // 2️⃣  Create the logged‑in demo user
  // ---------------------------------------------------------------------
  await prisma.profile.create({
    data: {
      id: "me",
      name: "Rocky",
      age: 25,
      photoUrl: "https://picsum.photos/seed/me/600/800",
      bio: "A passionate intern learning the ropes of product discovery.",
      city: "Bengaluru",
      interests: JSON.stringify(["coding", "music", "travel"]),
      isDemoUser: true,
    },
  });

  // ---------------------------------------------------------------------
  // 3️⃣  Helper data for mock profiles
  // ---------------------------------------------------------------------
  const firstNames = [
    "Aarav", "Diya", "Rohan", "Sneha", "Vihaan", "Isha", "Kunal", "Meera",
    "Arjun", "Priya", "Sahil", "Tara", "Yash", "Ananya", "Dev", "Nisha",
    "Riya", "Kartik", "Maya", "Aditi", "Jai", "Lakshmi", "Neil", "Pooja",
    "Rhea", "Samir", "Zara", "Ishaan", "Shreya", "Kiran", "Vikram", "Lina",
  ];

  const citiesOrColleges = [
    "Delhi", "Mumbai", "Kolkata", "Hyderabad", "Chennai",
    "IIT Delhi", "IIT Bombay", "IIT Madras", "NIT Trichy", "BITS Pilani",
    "Ahmedabad", "Pune", "Bengaluru", "Jaipur",
  ];

  const interestsPool = [
    "music", "sports", "travel", "cooking", "photography",
    "reading", "gaming", "movies", "art", "technology",
  ];

  function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ---------------------------------------------------------------------
  // 4️⃣  Generate 32 mock profiles (p01‑p32)
  // ---------------------------------------------------------------------
  const profiles = [] as any[];
  for (let i = 1; i <= 32; i++) {
    const id = `p${i.toString().padStart(2, "0")}`;
    const name = firstNames[i - 1];
    const age = 19 + Math.floor(Math.random() * 10); // 19‑28
    const photoUrl = `https://picsum.photos/seed/${id}/600/800`;
    const bio = `Hello! I am ${name}, a ${age}‑year‑old from ${randomItem(citiesOrColleges)}.`;
    const city = randomItem(citiesOrColleges);
    const interestsCount = 3 + Math.floor(Math.random() * 3); // 3‑5 interests
    const interests = [];
    while (interests.length < interestsCount) {
      const int = randomItem(interestsPool);
      if (!interests.includes(int)) interests.push(int);
    }
    profiles.push({
      id,
      name,
      age,
      photoUrl,
      bio,
      city,
      interests: JSON.stringify(interests),
      isDemoUser: false,
    });
  }

  // Bulk insert profiles (Prisma 6 supports createMany)
  await prisma.profile.createMany({ data: profiles });

  // ---------------------------------------------------------------------
  // 5️⃣  Insert six incoming likes (Swipe rows) for the demo user
  // ---------------------------------------------------------------------
  const likedIds = ["p04", "p09", "p15", "p21", "p26", "p30"];
  const swipeCreates = likedIds.map((fromId) => ({
    fromId,
    toId: "me",
    action: "LIKE",
  }));
  await prisma.swipe.createMany({ data: swipeCreates });

  // ---------------------------------------------------------------------
  // 6️⃣  Summary output
  // ---------------------------------------------------------------------
  const totalProfiles = await prisma.profile.count();
  const likedProfiles = await prisma.profile.findMany({
    where: { id: { in: likedIds } },
    select: { name: true },
  });
  console.log("🗂️  Seed completed!");
  console.log(`Total profiles (including 'me'): ${totalProfiles}`);
  console.log(
    "Profiles that already liked you: " +
      likedProfiles.map((p) => p.name).join(", ")
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
