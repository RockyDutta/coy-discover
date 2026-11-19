"use client";

import { useState } from "react";
import SwipeDeck from "@/components/SwipeDeck";
import MatchesList from "@/components/MatchesList";

export default function DiscoverPage() {
  const [activeView, setActiveView] = useState<"swipe" | "matches">("swipe");

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      {/* Two-option switch at the top: 'Swipe' and 'Matches' */}
      <div className="sticky top-0 z-20 flex w-full items-center justify-center border-b border-neutral-800 bg-neutral-950/80 px-4 py-2.5 backdrop-blur-md">
        <div className="inline-flex rounded-full border border-neutral-800 bg-neutral-900 p-1">
          <button
            onClick={() => setActiveView("swipe")}
            className={`rounded-full px-6 py-1.5 text-xs font-semibold transition-all ${
              activeView === "swipe"
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Swipe
          </button>
          <button
            onClick={() => setActiveView("matches")}
            className={`rounded-full px-6 py-1.5 text-xs font-semibold transition-all ${
              activeView === "matches"
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Matches
          </button>
        </div>
      </div>

      {/* View Content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {activeView === "swipe" ? <SwipeDeck /> : <MatchesList />}
      </div>
    </div>
  );
}
