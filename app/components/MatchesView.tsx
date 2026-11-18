"use client";

import { SafeProfile } from "@/lib/types";

interface MatchesViewProps {
  matches: SafeProfile[];
  isLoading: boolean;
  onBackToFeed: () => void;
}

export default function MatchesView({
  matches,
  isLoading,
  onBackToFeed,
}: MatchesViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-neutral-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
        <p className="mt-4 text-sm">Loading matches...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-2xl text-neutral-400">
          💬
        </div>
        <h3 className="mt-4 text-lg font-bold text-neutral-100">No matches yet</h3>
        <p className="mt-2 max-w-xs text-sm text-neutral-400">
          When you and another person both like each other, they will appear here.
        </p>
        <button
          onClick={onBackToFeed}
          className="mt-6 rounded-full bg-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-500/20 hover:bg-pink-600 transition"
        >
          Start Swiping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col w-full max-w-lg mx-auto px-4 py-4 overflow-y-auto">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Mutual Matches</h2>
          <p className="text-xs text-neutral-400">
            {matches.length} {matches.length === 1 ? "connection" : "connections"}
          </p>
        </div>
        <button
          onClick={onBackToFeed}
          className="rounded-full bg-neutral-800 border border-neutral-700 px-3.5 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition"
        >
          Back to Feed
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {matches.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-col overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md transition hover:border-neutral-700"
          >
            <div className="relative h-48 w-full bg-neutral-800">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <p className="text-base font-bold text-white drop-shadow">
                  {profile.name}, {profile.age}
                </p>
                <p className="text-xs text-neutral-300 drop-shadow flex items-center gap-1">
                  <span>📍</span>
                  <span className="truncate">{profile.city}</span>
                </p>
              </div>
            </div>

            <div className="p-3.5 flex flex-col flex-1 justify-between">
              <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-3">
                {profile.bio}
              </p>

              {profile.interests && profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {profile.interests.slice(0, 3).map((interest, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-400 border border-neutral-700/50"
                    >
                      {interest}
                    </span>
                  ))}
                  {profile.interests.length > 3 && (
                    <span className="text-[10px] text-neutral-500 self-center">
                      +{profile.interests.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
