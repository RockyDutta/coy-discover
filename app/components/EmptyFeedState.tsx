"use client";

interface EmptyFeedStateProps {
  onViewMatches: () => void;
  matchesCount: number;
}

export default function EmptyFeedState({
  onViewMatches,
  matchesCount,
}: EmptyFeedStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-900 border border-neutral-800 text-3xl shadow-inner">
        ✨
      </div>
      <h2 className="mt-5 text-xl font-bold text-white">You&apos;re All Caught Up!</h2>
      <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
        You have swiped through all available profiles in your area. Check back later for new connections!
      </p>

      <button
        onClick={onViewMatches}
        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:opacity-95 active:scale-95"
      >
        <span>View Your Matches</span>
        {matchesCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
            {matchesCount}
          </span>
        )}
      </button>
    </div>
  );
}
