import prisma from "../lib/db";
import { Prisma } from "@prisma/client";

const names = [
  "Aarav", "Diya", "Rohan", "Sneha", "Vihaan", "Isha", "Kunal", "Meera",
  "Arjun", "Priya", "Sahil", "Tara", "Yash", "Ananya", "Dev", "Nisha",
  "Riya", "Kartik", "Maya", "Aditi", "Jai", "Lakshmi", "Neil", "Pooja",
  "Rhea", "Samir", "Zara", "Ishaan", "Shreya", "Kiran", "Vikram", "Lina",
];

const portraits = [
  "photo-1539571696357-5a69c17a67c6",
  "photo-1494790108377-be9c29b29330",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1534528741775-53994a69daeb",
  "photo-1500648767791-00dcc994a43e",
  "photo-1517841905240-472988babdf9",
  "photo-1506794778202-cad84cf45f1d",
  "photo-1524504388940-b1c1722653e1",
  "photo-1519085360753-af0119f7cbe7",
  "photo-1544005313-94ddf0286df2",
  "photo-1522075469751-3a6694fb2f61",
  "photo-1529626455594-4ff0802cfb7e",
  "photo-1492562080023-ab3db95bfbce",
  "photo-1488426862026-3ee34a7d66df",
  "photo-1480429370139-e0132c086e2a",
  "photo-1573496359142-b8d87734a5a2",
  "photo-1508214751196-bcfd4ca60f91",
  "photo-1501196354995-cbb51c65aaea",
  "photo-1534751516642-a1714f5a5223",
  "photo-1517841905240-472988babdf9",
  "photo-1513956589380-bad6acb9b9d4",
  "photo-1502823403499-6ccfcf4fb453",
  "photo-1463453091185-61582044d556",
  "photo-1531746020798-e6953c6e8e04",
  "photo-1492106087820-71aa130ba25e",
  "photo-1539571696357-5a69c17a67c6",
  "photo-1524504388940-b1c1722653e1",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1494790108377-be9c29b29330",
  "photo-1500648767791-00dcc994a43e",
  "photo-1506794778202-cad84cf45f1d",
  "photo-1534528741775-53994a69daeb",
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
  await prisma.swipe.deleteMany();
  await prisma.match.deleteMany();
  await prisma.profile.deleteMany();

  // the demo logged-in user
  await prisma.profile.create({
    data: {
      id: "me",
      name: "Rocky",
      age: 25,
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&auto=format&fit=crop&q=80",
      bio: "A passionate intern learning the ropes of product discovery.",
      city: "Bengaluru",
      interests: JSON.stringify(["coding", "music", "travel"]),
      isDemoUser: true,
    },
  });

  const profiles: Prisma.ProfileCreateManyInput[] = [];

  for (let i = 1; i <= 32; i++) {
    const id = `p${String(i).padStart(2, "0")}`;
    const name = names[i - 1];
    const age = 19 + Math.floor(Math.random() * 10);
    const city = pick(locations);
    const photoId = portraits[i - 1];
    const photoUrl = `https://images.unsplash.com/${photoId}?w=600&h=800&auto=format&fit=crop&q=80`;

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
      photoUrl,
      bio: `Hey, I'm ${name}! ${age} years old, based in ${city}.`,
      city,
      interests: JSON.stringify(interests),
      isDemoUser: false,
    });
  }

  await prisma.profile.createMany({ data: profiles });

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
