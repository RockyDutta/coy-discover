"use client";

interface TabBarProps {
  activeTab: "home" | "discover";
  onChangeTab: (tab: "home" | "discover") => void;
  matchesCount?: number;
}

export default function TabBar({
  activeTab,
  onChangeTab,
}: TabBarProps) {
  return (
    <nav className="sticky bottom-0 z-30 w-full border-t border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around py-3">
        {/* Home Tab (Placeholder) */}
        <button
          onClick={() => onChangeTab("home")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === "home"
              ? "text-pink-500 font-semibold"
              : "text-neutral-500 hover:text-neutral-400"
          }`}
        >
          <svg
            className="w-6 h-6 stroke-[2]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs">Home</span>
        </button>

        {/* Discover Tab */}
        <button
          onClick={() => onChangeTab("discover")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === "discover"
              ? "text-pink-500 font-semibold"
              : "text-neutral-500 hover:text-neutral-400"
          }`}
        >
          <svg
            className="w-6 h-6 stroke-[2]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-xs">Discover</span>
        </button>
      </div>
    </nav>
  );
}
