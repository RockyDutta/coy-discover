import { FeedProfile } from "./types";

interface DbProfile {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  bio: string;
  city: string;
  interests: string;
  [key: string]: unknown;
}

export function formatProfile(profile: DbProfile): FeedProfile {
  let interests: string[] = [];

  try {
    const parsed = JSON.parse(profile.interests);
    interests = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
  } catch {
    // fall back to comma-separated string
    interests = profile.interests.split(",").map((s) => s.trim()).filter(Boolean);
  }

  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    photoUrl: profile.photoUrl,
    bio: profile.bio,
    city: profile.city,
    interests,
  };
}
