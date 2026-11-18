import { PrismaClient } from "@prisma/client";
import { CURRENT_USER_ID } from "../lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data for reproducible seed
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.profile.deleteMany();

  // 1. Logged-in user profile ('me')
  await prisma.profile.create({
    data: {
      id: CURRENT_USER_ID,
      name: "Alex",
      age: 22,
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      bio: "Tech explorer, specialty coffee lover, and weekend hiker.",
      city: "Stanford University",
      interests: JSON.stringify(["Photography", "Coffee", "Design", "Tech", "Hiking"]),
    },
  });

  // 2. 32 mock profiles
  const profiles = [
    {
      id: "p01",
      name: "Sophia Martinez",
      age: 21,
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
      bio: "Architecture student. Obsessed with brutalist buildings and oat milk cortados.",
      city: "UC Berkeley",
      interests: ["Architecture", "Art", "Coffee", "Sketching"],
    },
    {
      id: "p02",
      name: "Rohan Mehta",
      age: 23,
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      bio: "Building distributed systems by day, indie film fanatic by night.",
      city: "San Francisco",
      interests: ["Coding", "Indie Cinema", "Running", "Vinyl"],
    },
    {
      id: "p03",
      name: "Emma Watson",
      age: 22,
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
      bio: "Literature major who probably has too many unread books on her nightstand.",
      city: "Columbia University",
      interests: ["Reading", "Poetry", "Museums", "Baking"],
    },
    {
      id: "p04",
      name: "Liam Chen",
      age: 24,
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
      bio: "Sound engineer & synthesizers. Always down for live concerts and street food.",
      city: "New York",
      interests: ["Electronic Music", "Street Food", "Cycling", "Travel"],
    },
    {
      id: "p05",
      name: "Aria Sharma",
      age: 21,
      photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
      bio: "Neuroscience researcher who loves matcha lattes and thrift store jackets.",
      city: "Harvard University",
      interests: ["Neuroscience", "Thrifting", "Matcha", "Yoga"],
    },
    {
      id: "p06",
      name: "Noah Taylor",
      age: 25,
      photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      bio: "Rock climbing on weekends, brewing sourdough during the week.",
      city: "Boulder, CO",
      interests: ["Bouldering", "Baking", "Nature", "Podcasts"],
    },
    {
      id: "p07",
      name: "Zoe Patel",
      age: 22,
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
      bio: "Digital illustrator and plant parent. Looking for someone to debate typography with.",
      city: "RISD",
      interests: ["Illustration", "Typography", "Anime", "Plants"],
    },
    {
      id: "p08",
      name: "Lucas Silva",
      age: 23,
      photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
      bio: "Guitarist and surfer. If I am not at the beach, I am probably writing a melody.",
      city: "San Diego State",
      interests: ["Surfing", "Acoustic Guitar", "Sunsets", "Tacos"],
    },
    {
      id: "p09",
      name: "Chloe Dubois",
      age: 22,
      photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
      bio: "Culinary arts graduate with a weakness for French pastries and jazz vinyls.",
      city: "Chicago",
      interests: ["Pastry", "Jazz", "Wine Tasting", "Photography"],
    },
    {
      id: "p10",
      name: "Ethan Wright",
      age: 24,
      photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
      bio: "Robotics engineer. Tell me your craziest sci-fi theory.",
      city: "MIT",
      interests: ["Robotics", "Sci-Fi", "Board Games", "Tennis"],
    },
    {
      id: "p11",
      name: "Maya Lin",
      age: 21,
      photoUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80",
      bio: "Film photography, vintage cameras, and documenting fleeting moments.",
      city: "NYU Tisch",
      interests: ["35mm Film", "Cinema", "Darkroom", "Thrifting"],
    },
    {
      id: "p12",
      name: "Daniel Kim",
      age: 23,
      photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
      bio: "Product strategist. Always curious about how things work under the hood.",
      city: "Seattle",
      interests: ["Product Design", "Coffee", "Chess", "Kayaking"],
    },
    {
      id: "p13",
      name: "Isabella Rossi",
      age: 20,
      photoUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&auto=format&fit=crop&q=80",
      bio: "Fashion design student. Big fan of thrifting, sustainability, and matcha.",
      city: "Parsons School of Design",
      interests: ["Fashion", "Sustainable Design", "Matcha", "Art"],
    },
    {
      id: "p14",
      name: "Marcus Aurelius",
      age: 25,
      photoUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80",
      bio: "Marathon runner and philosophy enthusiast. Stoicism meets endurance.",
      city: "Austin, TX",
      interests: ["Running", "Philosophy", "Health", "Reading"],
    },
    {
      id: "p15",
      name: "Elena Rostova",
      age: 22,
      photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80",
      bio: "Classical violinist playing contemporary lo-fi beats.",
      city: "Juilliard",
      interests: ["Violin", "Lo-Fi", "Concerts", "Tea"],
    },
    {
      id: "p16",
      name: "James Wilson",
      age: 24,
      photoUrl: "https://images.unsplash.com/photo-1492446845049-9c50ce313d00?w=600&auto=format&fit=crop&q=80",
      bio: "Astronomy enthusiast with a telescope that weighs more than my dog.",
      city: "Caltech",
      interests: ["Astrophysics", "Stargazing", "Campfires", "Podcasts"],
    },
    {
      id: "p17",
      name: "Ananya Iyer",
      age: 22,
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
      bio: "Biotech undergrad and amateur potter. My ceramics are crooked but full of love.",
      city: "Johns Hopkins",
      interests: ["Pottery", "Biotechnology", "Plants", "Boba"],
    },
    {
      id: "p18",
      name: "Oliver Smith",
      age: 23,
      photoUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&auto=format&fit=crop&q=80",
      bio: "Game developer crafting cozy indie titles. Tea drinker & cat whisperer.",
      city: "Vancouver",
      interests: ["Game Dev", "Pixel Art", "Cats", "Earl Grey"],
    },
    {
      id: "p19",
      name: "Grace Hopper Jr.",
      age: 21,
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      bio: "Math nerd and competitive swimmer. Life is just graph algorithms and laps.",
      city: "Princeton",
      interests: ["Swimming", "Graph Theory", "Puzzles", "Audiobooks"],
    },
    {
      id: "p20",
      name: "Mateo Gomez",
      age: 24,
      photoUrl: "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=600&auto=format&fit=crop&q=80",
      bio: "Environmental lawyer in training. Let us protect the ocean and eat tacos.",
      city: "UCLA Law",
      interests: ["Ocean Conservation", "Scuba Diving", "Tacos", "Guitar"],
    },
    {
      id: "p21",
      name: "Nina Simone",
      age: 23,
      photoUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80",
      bio: "Journalism fellow chasing untold stories across cities and cafes.",
      city: "Northwestern University",
      interests: ["Journalism", "Storytelling", "Coffee", "City Walks"],
    },
    {
      id: "p22",
      name: "Gabriel Santos",
      age: 22,
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80",
      bio: "DJ and graphic designer. Spinning house tracks and curating album art.",
      city: "Miami",
      interests: ["House Music", "Graphic Design", "Sneakers", "Rollerblading"],
    },
    {
      id: "p23",
      name: "Lily Zhao",
      age: 21,
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
      bio: "Data science student who loves ramen tasting and solving escape rooms.",
      city: "Carnegie Mellon",
      interests: ["Ramen", "Machine Learning", "Escape Rooms", "Board Games"],
    },
    {
      id: "p24",
      name: "Kevin Vance",
      age: 25,
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
      bio: "Wilderness guide and landscape photographer. Best views come after the hardest climb.",
      city: "Seattle, WA",
      interests: ["Backpacking", "Landscape Photography", "Climbing", "Campfire Cooking"],
    },
    {
      id: "p25",
      name: "Tanya Kapoor",
      age: 22,
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      bio: "Classical Bharatanatyam dancer exploring contemporary fusion choreography.",
      city: "Toronto",
      interests: ["Dance", "Theater", "Poetry", "Chai"],
    },
    {
      id: "p26",
      name: "Oscar Berg",
      age: 24,
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      bio: "Nordic furniture maker & coffee roaster. Minimalist aesthetics everywhere.",
      city: "Stockholm / Boston",
      interests: ["Woodworking", "Coffee Roasting", "Minimalism", "Nordic Design"],
    },
    {
      id: "p27",
      name: "Zara Al-Mansoor",
      age: 23,
      photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
      bio: "Public health advocate and avid reader. Believer in community gardens.",
      city: "Georgetown University",
      interests: ["Public Health", "Gardening", "Book Clubs", "Baking"],
    },
    {
      id: "p28",
      name: "Samir Patel",
      age: 22,
      photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      bio: "Standup comedy open-micer and economics student. I will make you laugh or groan.",
      city: "University of Chicago",
      interests: ["Comedy", "Economics", "Podcasts", "Pizza"],
    },
    {
      id: "p29",
      name: "Claire Vance",
      age: 20,
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
      bio: "Veterinary student who loves big dogs, morning runs, and botanical gardens.",
      city: "UC Davis",
      interests: ["Animals", "Running", "Botany", "Smoothies"],
    },
    {
      id: "p30",
      name: "Dante Alighieri",
      age: 24,
      photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
      bio: "Espresso perfectionist, vintage car enthusiast, amateur filmmaker.",
      city: "Rome / Austin",
      interests: ["Espresso", "Classic Cars", "Filmmaking", "Photography"],
    },
    {
      id: "p31",
      name: "Mira Nair",
      age: 22,
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
      bio: "Documentary photographer interested in climate and indigenous cultures.",
      city: "Yale University",
      interests: ["Photojournalism", "Climate Action", "Documentaries", "Hiking"],
    },
    {
      id: "p32",
      name: "Finn O'Connor",
      age: 23,
      photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
      bio: "Sailor and mechanical engineer. Building sustainable electric boat motors.",
      city: "Boston, MA",
      interests: ["Sailing", "Clean Tech", "Irish Folk", "Cycling"],
    },
  ];

  for (const p of profiles) {
    await prisma.profile.create({
      data: {
        id: p.id,
        name: p.name,
        age: p.age,
        photoUrl: p.photoUrl,
        bio: p.bio,
        city: p.city,
        interests: JSON.stringify(p.interests),
      },
    });
  }

  // 3. Seed likes from some profiles to 'me'
  const seededLikes = ["p02", "p05", "p09", "p14", "p19", "p24", "p28"];
  for (const fromId of seededLikes) {
    await prisma.swipe.create({
      data: {
        fromId,
        toId: CURRENT_USER_ID,
        isLike: true,
      },
    });
  }

  console.log(`Seeded 1 logged-in user ('me') and ${profiles.length} mock profiles.`);
  console.log(`Seeded ${seededLikes.length} incoming likes to '${CURRENT_USER_ID}' (${seededLikes.join(", ")}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
