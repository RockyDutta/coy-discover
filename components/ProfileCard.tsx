/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { FeedProfile } from "@/lib/types";

interface ProfileCardProps {
  profile: FeedProfile;
  onSwipe?: (action: "LIKE" | "PASS") => void;
  exitDirection?: "left" | "right" | null;
  disabled?: boolean;
}

export default function ProfileCard({
  profile,
  onSwipe,
  exitDirection,
  disabled = false,
}: ProfileCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-16, 16]);
  const likeOpacity = useTransform(x, [20, 90], [0, 1]);
  const passOpacity = useTransform(x, [-20, -90], [0, 1]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (disabled || exitDirection || !onSwipe) return;
    if (info.offset.x > 100 || info.velocity.x > 400) {
      onSwipe("LIKE");
    } else if (info.offset.x < -100 || info.velocity.x < -400) {
      onSwipe("PASS");
    }
  };

  return (
    <motion.div
      style={{
        x: exitDirection ? undefined : x,
        rotate: exitDirection ? undefined : rotate,
      }}
      drag={disabled || exitDirection ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={onDragEnd}
      animate={
        exitDirection === "right"
          ? { x: 500, opacity: 0, rotate: 25, transition: { duration: 0.25 } }
          : exitDirection === "left"
          ? { x: -500, opacity: 0, rotate: -25, transition: { duration: 0.25 } }
          : { x: 0, opacity: 1, rotate: 0 }
      }
      className="relative flex h-[520px] w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl select-none cursor-grab active:cursor-grabbing touch-pan-y"
    >
      <div className="relative h-full w-full bg-neutral-950 overflow-hidden">
        <img
          src={profile.photoUrl}
          alt={profile.name}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="h-full w-full object-cover select-none pointer-events-none"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

        <motion.div
          style={{ opacity: exitDirection === "right" ? 1 : likeOpacity }}
          className="absolute top-6 left-6 z-20 pointer-events-none rounded-xl border-4 border-emerald-400 px-4 py-1.5 font-black text-2xl uppercase tracking-wider text-emerald-400 -rotate-12 bg-emerald-950/60 backdrop-blur-sm shadow-lg"
        >
          LIKE
        </motion.div>

        <motion.div
          style={{ opacity: exitDirection === "left" ? 1 : passOpacity }}
          className="absolute top-6 right-6 z-20 pointer-events-none rounded-xl border-4 border-rose-500 px-4 py-1.5 font-black text-2xl uppercase tracking-wider text-rose-500 rotate-12 bg-rose-950/60 backdrop-blur-sm shadow-lg"
        >
          PASS
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 p-5 text-white pointer-events-none">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">{profile.name}</h2>
            <span className="text-xl font-light text-neutral-300 drop-shadow">{profile.age}</span>
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-neutral-300 drop-shadow">
            <svg className="h-3.5 w-3.5 text-pink-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{profile.city}</span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-neutral-200 line-clamp-3 drop-shadow">{profile.bio}</p>

          {profile.interests?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.interests.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full border border-white/10 bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-neutral-100 backdrop-blur-md shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
