/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { SafeProfile } from "@/lib/types";

interface SwipeCardProps {
  profile: SafeProfile;
  onSwipe: (isLike: boolean) => void;
}

export default function SwipeCard({ profile, onSwipe }: SwipeCardProps) {
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-16, 16]);
  const likeOpacity = useTransform(x, [20, 90], [0, 1]);
  const passOpacity = useTransform(x, [-20, -90], [0, 1]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      setExitDirection("right");
      onSwipe(true);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      setExitDirection("left");
      onSwipe(false);
    }
  };

  const triggerSwipe = (isLike: boolean) => {
    if (exitDirection) return;
    setExitDirection(isLike ? "right" : "left");
    setTimeout(() => {
      onSwipe(isLike);
    }, 180);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-sm h-full select-none">
      {/* Profile Card */}
      <motion.div
        style={{
          x: exitDirection ? undefined : x,
          rotate: exitDirection ? undefined : rotate,
        }}
        drag={exitDirection ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        animate={
          exitDirection === "right"
            ? { x: 500, opacity: 0, rotate: 25, transition: { duration: 0.25 } }
            : exitDirection === "left"
            ? { x: -500, opacity: 0, rotate: -25, transition: { duration: 0.25 } }
            : { x: 0, opacity: 1, rotate: 0 }
        }
        className="relative flex flex-col w-full h-[520px] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {/* Profile Image */}
        <div className="relative flex-1 w-full bg-neutral-950 overflow-hidden">
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />

          {/* Gradient Overlay for Readable Text */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

          {/* Like Stamp Indicator */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 z-20 pointer-events-none rounded-xl border-4 border-emerald-400 px-4 py-1.5 font-black text-2xl uppercase tracking-wider text-emerald-400 -rotate-12 bg-emerald-950/50 backdrop-blur-sm shadow-lg"
          >
            LIKE
          </motion.div>

          {/* Pass Stamp Indicator */}
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-6 right-6 z-20 pointer-events-none rounded-xl border-4 border-rose-500 px-4 py-1.5 font-black text-2xl uppercase tracking-wider text-rose-500 rotate-12 bg-rose-950/50 backdrop-blur-sm shadow-lg"
          >
            PASS
          </motion.div>

          {/* Profile Details at the bottom of the card */}
          <div className="absolute bottom-0 inset-x-0 p-5 text-white pointer-events-none">
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
                {profile.name}
              </h1>
              <span className="text-xl font-light text-neutral-300 drop-shadow">
                {profile.age}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-neutral-300 drop-shadow">
              <svg
                className="w-3.5 h-3.5 text-rose-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{profile.city}</span>
            </div>

            <p className="mt-2 text-xs text-neutral-200 line-clamp-2 leading-relaxed drop-shadow">
              {profile.bio}
            </p>

            {profile.interests && profile.interests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-white/15 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-medium text-neutral-100 border border-white/10"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons for Desktop and Quick Taps */}
      <div className="flex items-center justify-center gap-8 mt-5">
        {/* Pass Button */}
        <button
          onClick={() => triggerSwipe(false)}
          aria-label="Pass"
          disabled={Boolean(exitDirection)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-rose-500 shadow-xl transition-all duration-150 hover:scale-110 hover:border-rose-500/50 hover:bg-rose-500/10 active:scale-95 disabled:opacity-50"
        >
          <svg
            className="w-7 h-7 stroke-[2.5] transition-transform group-hover:rotate-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Like Button */}
        <button
          onClick={() => triggerSwipe(true)}
          aria-label="Like"
          disabled={Boolean(exitDirection)}
          className="group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 text-white shadow-xl shadow-pink-500/30 transition-all duration-150 hover:scale-110 hover:shadow-pink-500/50 active:scale-95 disabled:opacity-50"
        >
          <svg
            className="w-8 h-8 fill-current transition-transform group-hover:scale-110"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
