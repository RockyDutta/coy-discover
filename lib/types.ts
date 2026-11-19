export class BadRequestError extends Error {
  status = 400;
  constructor(message?: string) {
    super(message ?? 'Bad Request');
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends Error {
  status = 404;
  constructor(message?: string) {
    super(message ?? 'Not Found');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  status = 409;
  constructor(message?: string) {
    super(message ?? 'Conflict');
    this.name = 'ConflictError';
  }
}

export type FeedProfile = {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  bio: string;
  city: string;
  interests: string[];
};

export type SwipeResult = {
  isMatch: boolean;
};

export type MatchProfile = FeedProfile;

// Backward-compatibility aliases for existing UI components
export type SafeProfile = FeedProfile;
export type SwipeResponse = {
  isMatch: boolean;
  matchedProfile?: SafeProfile;
};

