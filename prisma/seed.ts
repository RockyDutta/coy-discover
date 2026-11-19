import prisma from "../lib/db";
import { Prisma } from "@prisma/client";

const names = [
  "Aarav", "Diya", "Rohan", "Sneha", "Vihaan", "Isha", "Kunal", "Meera",
  "Arjun", "Priya", "Sahil", "Tara", "Yash", "Ananya", "Dev", "Nisha",
  "Riya", "Kartik", "Maya", "Aditi", "Jai", "Lakshmi", "Neil", "Pooja",
  "Rhea", "Samir", "Zara", "Ishaan", "Shreya", "Kiran", "Vikram", "Lina",
];

const locations = [
  "Delhi", "Mumbai", "Kolkata", "Hyderabad", "Chennai",
  "IIT Delhi", "IIT Bombay", "IIT Madras", "NIT Trichy", "BITS Pilani",
  "Ahmedabad", "Pune", "Bengaluru", "Jaipur",
];

const allInterests = [
  "music", "sports", "travel", "cooking", "photography",
  "reading", "gaming", "movies", "art", "technology",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  // wipe existing data so the seed is idempotent
  await prisma.swipe.deleteMany();
  await prisma.match.deleteMany();
  await prisma.profile.deleteMany();

  // the demo logged-in user
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

  // 32 candidate profiles
  const profiles: Prisma.ProfileCreateManyInput[] = [];

  for (let i = 1; i <= 32; i++) {
    const id = `p${String(i).padStart(2, "0")}`;
    const name = names[i - 1];
    const age = 19 + Math.floor(Math.random() * 10);
    const city = pick(locations);

    const interests: string[] = [];
    const count = 3 + Math.floor(Math.random() * 3);
    while (interests.length < count) {
      const interest = pick(allInterests);
      if (!interests.includes(interest)) interests.push(interest);
    }

    profiles.push({
      id,
      name,
      age,
      photoUrl: `https://picsum.photos/seed/${id}/600/800`,
      bio: `Hey, I'm ${name}! ${age} years old, based in ${city}.`,
      city,
      interests: JSON.stringify(interests),
      isDemoUser: false,
    });
  }

  await prisma.profile.createMany({ data: profiles });

  // pre-seed likes so the reviewer can trigger a match immediately
  const likedBy = ["p04", "p09", "p15", "p21", "p26", "p30"];
  await prisma.swipe.createMany({
    data: likedBy.map((fromId) => ({ fromId, toId: "me", action: "LIKE" })),
  });

  const likerNames = await prisma.profile.findMany({
    where: { id: { in: likedBy } },
    select: { name: true },
  });

  console.log("Seed done!");
  console.log(`Total profiles: ${await prisma.profile.count()}`);
  console.log(`Profiles that already liked you: ${likerNames.map((p) => p.name).join(", ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
