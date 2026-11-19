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
  let parsedInterests: string[] = [];
  try {
    const parsed = JSON.parse(profile.interests);
    if (Array.isArray(parsed)) {
      parsedInterests = parsed.map(String);
    } else {
      parsedInterests = [String(parsed)];
    }
  } catch {
    parsedInterests = profile.interests
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    photoUrl: profile.photoUrl,
    bio: profile.bio,
    city: profile.city,
    interests: parsedInterests,
  };
}
