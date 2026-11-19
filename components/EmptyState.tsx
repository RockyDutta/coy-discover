export default function EmptyState() {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 shadow-inner">
        <svg
          className="h-8 w-8 text-neutral-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold tracking-tight text-white">
        No more profiles right now
      </h2>
      <p className="mt-2 max-w-xs text-xs leading-relaxed text-neutral-400">
        You&apos;ve gone through all available profiles. Check back later to see new people!
      </p>
    </div>
  );
}
