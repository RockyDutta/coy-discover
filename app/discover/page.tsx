"use client";

import { useState } from "react";
import SwipeDeck from "@/components/SwipeDeck";
import MatchesList from "@/components/MatchesList";

type View = "swipe" | "matches";

const activeClass = "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20";
const inactiveClass = "text-neutral-400 hover:text-neutral-200";

export default function DiscoverPage() {
  const [view, setView] = useState<View>("swipe");

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="sticky top-0 z-20 flex w-full items-center justify-center border-b border-neutral-800 bg-neutral-950/80 px-4 py-2.5 backdrop-blur-md">
        <div className="inline-flex rounded-full border border-neutral-800 bg-neutral-900 p-1">
          <button
            onClick={() => setView("swipe")}
            className={`rounded-full px-6 py-1.5 text-xs font-semibold transition-all ${view === "swipe" ? activeClass : inactiveClass}`}
          >
            Swipe
          </button>
          <button
            onClick={() => setView("matches")}
            className={`rounded-full px-6 py-1.5 text-xs font-semibold transition-all ${view === "matches" ? activeClass : inactiveClass}`}
          >
            Matches
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        {view === "swipe" ? <SwipeDeck /> : <MatchesList />}
      </div>
    </div>
  );
}
