"use client";

export default function HomePlaceholder() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-neutral-500">
      <div className="rounded-full bg-neutral-900 border border-neutral-800 p-4 mb-3">
        <svg
          className="w-8 h-8 text-neutral-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-neutral-400">Home Tab</p>
      <p className="text-xs text-neutral-600 mt-1 max-w-xs">
        Placeholder as specified in the assignment. Head over to the Discover tab to explore and swipe!
      </p>
    </div>
  );
}
