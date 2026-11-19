"use client";

import { useEffect, useState } from "react";
import { FeedProfile } from "@/lib/types";
import { getFeed, postSwipe } from "@/lib/api";
import ProfileCard from "./ProfileCard";
import EmptyState from "./EmptyState";
import MatchModal from "./MatchModal";

export default function SwipeDeck() {
  const [profiles, setProfiles] = useState<FeedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<FeedProfile | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    getFeed()
      .then((data) => {
        if (mounted) {
          setProfiles(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load feed:", err);
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

  const handleSwipe = async (action: "LIKE" | "PASS") => {
    // Ignore extra taps while a request is running or if no profiles left
    if (isSwiping || profiles.length === 0) return;

    const currentProfile = profiles[0];
    setIsSwiping(true);

    try {
      const res = await postSwipe(currentProfile.id, action);

      // Only after it succeeds removes that profile from the list and shows the next one
      setProfiles((prev) => prev.slice(1));

      // Show modal only when postSwipe returns isMatch true. Show nothing special when isMatch is false.
      if (res.isMatch) {
        setMatchedProfile(currentProfile);
      }
    } catch (error) {
      console.error("Swipe failed:", error);
    } finally {
      setIsSwiping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-neutral-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
          <p className="text-sm font-medium tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <>
        <EmptyState />
        {/* Match modal if last swipe was a match */}
        <MatchModal
          profile={matchedProfile}
          onClose={() => setMatchedProfile(null)}
        />
      </>
    );
  }

  const currentProfile = profiles[0];

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      {/* Exactly ONE profile card at a time */}
      <ProfileCard profile={currentProfile} />

      {/* Like and Pass buttons shown on desktop widths (md and above) */}
      <div className="hidden md:flex items-center justify-center gap-8 mt-5">
        {/* Pass Button */}
        <button
          onClick={() => handleSwipe("PASS")}
          disabled={isSwiping}
          aria-label="Pass"
          className="group flex h-14 w-14 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-rose-500 shadow-xl transition-all duration-150 hover:scale-110 hover:border-rose-500/50 hover:bg-rose-500/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            className="h-7 w-7 stroke-[2.5] transition-transform group-hover:rotate-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Like Button */}
        <button
          onClick={() => handleSwipe("LIKE")}
          disabled={isSwiping}
          aria-label="Like"
          className="group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 text-white shadow-xl shadow-pink-500/30 transition-all duration-150 hover:scale-110 hover:shadow-pink-500/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            className="h-8 w-8 fill-current transition-transform group-hover:scale-110"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      {/* Match Modal */}
      <MatchModal
        profile={matchedProfile}
        onClose={() => setMatchedProfile(null)}
      />
    </div>
  );
}
