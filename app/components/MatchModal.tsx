/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SafeProfile } from "@/lib/types";

interface MatchModalProps {
  matchedProfile: SafeProfile | null;
  onClose: () => void;
  onViewMatches: () => void;
}

export default function MatchModal({
  matchedProfile,
  onClose,
  onViewMatches,
}: MatchModalProps) {
  if (!matchedProfile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-6 text-center text-white shadow-2xl"
        >
          {/* Decorative Sparkle Header */}
          <div className="mb-2 inline-flex items-center justify-center rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pink-400">
            Mutual Connection
          </div>

          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 bg-clip-text text-transparent"
          >
            It&apos;s a Match!
          </motion.h2>

          <p className="mt-2 text-sm text-neutral-400">
            You and <span className="font-semibold text-white">{matchedProfile.name}</span> liked each other.
          </p>

          {/* Photo */}
          <div className="relative mx-auto my-6 h-48 w-48 overflow-hidden rounded-2xl border-4 border-pink-500 shadow-xl shadow-pink-500/20">
            <img
              src={matchedProfile.photoUrl}
              alt={matchedProfile.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-left">
              <p className="text-sm font-bold text-white drop-shadow">
                {matchedProfile.name}, {matchedProfile.age}
              </p>
              <p className="text-xs text-neutral-200 drop-shadow truncate">
                {matchedProfile.city}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={onViewMatches}
              className="w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              View Matches
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-full border border-neutral-700 bg-neutral-800 py-3 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700 active:scale-[0.98]"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
