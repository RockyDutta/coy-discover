"use client";

import { useEffect, useState } from "react";
import { MatchProfile } from "@/lib/types";
import { getMatches } from "@/lib/api";

export default function MatchesList() {
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load fresh data every time this view opens
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    getMatches()
      .then((data) => {
        if (mounted) {
          setMatches(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch matches:", err);
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-neutral-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
        <p className="mt-3 text-sm font-medium">Loading matches...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-neutral-400">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-2xl text-pink-500">
          <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">No matches yet</h3>
        <p className="mt-1.5 max-w-xs text-xs text-neutral-400 leading-relaxed">
          When you and someone else both like each other, they will appear here. Keep swiping!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col w-full px-4 py-3 overflow-y-auto">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Your Matches ({matches.length})
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        {matches.map((profile) => (
          <div
            key={profile.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-md transition-all hover:border-pink-500/50"
          >
            {/* Photo */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              {/* Name, Age, City */}
              <div className="absolute bottom-2.5 inset-x-2.5 text-left pointer-events-none">
                <p className="text-sm font-bold text-white drop-shadow truncate">
                  {profile.name}, {profile.age}
                </p>
                <p className="text-[11px] text-neutral-300 drop-shadow truncate flex items-center gap-1 mt-0.5">
                  <span className="text-pink-400">📍</span>
                  <span>{profile.city}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
