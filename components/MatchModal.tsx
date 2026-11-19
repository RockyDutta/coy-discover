/* eslint-disable @next/next/no-img-element */
"use client";

import { FeedProfile } from "@/lib/types";

interface MatchModalProps {
  profile: FeedProfile | null;
  onClose: () => void;
}

export default function MatchModal({ profile, onClose }: MatchModalProps) {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex w-full max-w-sm flex-col items-center rounded-3xl border border-neutral-800 bg-neutral-900 p-6 text-center text-white shadow-2xl">
        {/* Sparkle Tag */}
        <div className="mb-2 inline-flex items-center justify-center rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pink-400">
          Mutual Match
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">
          It&apos;s a match!
        </h2>

        <p className="mt-2 text-sm text-neutral-300">
          You and <span className="font-semibold text-white">{profile.name}</span> liked each other.
        </p>

        {/* Matched Person's Photo & Name */}
        <div className="relative my-6 h-56 w-56 overflow-hidden rounded-2xl border-4 border-pink-500 shadow-xl shadow-pink-500/20 bg-neutral-950">
          <img
            src={profile.photoUrl}
            alt={profile.name}
            draggable={false}
            className="h-full w-full object-cover select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 inset-x-3 text-left pointer-events-none">
            <p className="text-lg font-bold text-white drop-shadow">
              {profile.name}, {profile.age}
            </p>
            <p className="text-xs text-neutral-300 drop-shadow truncate">
              {profile.city}
            </p>
          </div>
        </div>

        {/* Button to Continue */}
        <button
          onClick={onClose}
          className="w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
