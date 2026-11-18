export interface SafeProfile {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  bio: string;
  city: string;
  interests: string[];
}

export interface SwipeRequestBody {
  targetId: string;
  isLike: boolean;
}

export interface SwipeResponse {
  isMatch: boolean;
  matchedProfile?: SafeProfile;
}
