"use client";

import { useEffect, useState, useCallback } from "react";
import TabBar from "./components/TabBar";
import HomePlaceholder from "./components/HomePlaceholder";
import SwipeCard from "./components/SwipeCard";
import EmptyFeedState from "./components/EmptyFeedState";
import MatchesView from "./components/MatchesView";
import MatchModal from "./components/MatchModal";
import { SafeProfile, SwipeResponse } from "@/lib/types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "discover">("discover");
  const [discoverView, setDiscoverView] = useState<"feed" | "matches">("feed");

  const [feed, setFeed] = useState<SafeProfile[]>([]);
  const [matches, setMatches] = useState<SafeProfile[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // Modal for "It's a Match!"
  const [currentMatch, setCurrentMatch] = useState<SafeProfile | null>(null);

  // Load feed on mount
  const loadFeed = useCallback(async () => {
    setIsLoadingFeed(true);
    try {
      const res = await fetch("/feed");
      if (res.ok) {
        const data = await res.json();
        setFeed(data);
      }
    } catch (err) {
      console.error("Failed to load feed", err);
    } finally {
      setIsLoadingFeed(false);
    }
  }, []);

  // Load matches
  const loadMatches = useCallback(async () => {
    setIsLoadingMatches(true);
    try {
      const res = await fetch("/matches");
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (err) {
      console.error("Failed to load matches", err);
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
    loadMatches();
  }, [loadFeed, loadMatches]);

  // Handle swipe action
  const handleSwipe = async (isLike: boolean) => {
    if (feed.length === 0) return;

    const currentProfile = feed[0];
    // Optimistically advance feed so UI transitions immediately
    setFeed((prev) => prev.slice(1));

    try {
      const res = await fetch("/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId: currentProfile.id,
          isLike,
        }),
      });

      if (res.ok) {
        const data: SwipeResponse = await res.json();
        if (data.isMatch) {
          // It's a match! Show celebration overlay
          setCurrentMatch(data.matchedProfile || currentProfile);
          loadMatches();
        }
      }
    } catch (err) {
      console.error("Failed to submit swipe", err);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 font-bold text-white shadow-md shadow-pink-500/20">
            C
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Coy <span className="text-pink-500">Discover</span>
          </span>
        </div>

        {activeTab === "discover" && (
          <div className="flex items-center gap-1 rounded-full bg-neutral-900 border border-neutral-800 p-1">
            <button
              onClick={() => setDiscoverView("feed")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                discoverView === "feed"
                  ? "bg-pink-500 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => {
                setDiscoverView("matches");
                loadMatches();
              }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                discoverView === "matches"
                  ? "bg-pink-500 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span>Matches</span>
              {matches.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                  {matches.length}
                </span>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden p-3">
        {activeTab === "home" ? (
          <HomePlaceholder />
        ) : discoverView === "matches" ? (
          <MatchesView
            matches={matches}
            isLoading={isLoadingMatches}
            onBackToFeed={() => setDiscoverView("feed")}
          />
        ) : isLoadingFeed ? (
          <div className="flex flex-col items-center justify-center gap-3 text-neutral-400">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
            <p className="text-xs font-medium">Finding nearby profiles...</p>
          </div>
        ) : feed.length === 0 ? (
          <EmptyFeedState
            matchesCount={matches.length}
            onViewMatches={() => {
              setDiscoverView("matches");
              loadMatches();
            }}
          />
        ) : (
          <SwipeCard
            key={feed[0].id}
            profile={feed[0]}
            onSwipe={handleSwipe}
          />
        )}
      </main>

      {/* "It's a Match!" Overlay Screen */}
      <MatchModal
        matchedProfile={currentMatch}
        onClose={() => setCurrentMatch(null)}
        onViewMatches={() => {
          setCurrentMatch(null);
          setActiveTab("discover");
          setDiscoverView("matches");
          loadMatches();
        }}
      />

      {/* Bottom Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        matchesCount={matches.length}
      />
    </div>
  );
}
