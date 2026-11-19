"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  const isHome = pathname === "/home";
  const isDiscover = pathname.startsWith("/discover");

  return (
    <nav className="sticky bottom-0 z-30 w-full border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-around">
        <Link
          href="/home"
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors ${
            isHome
              ? "text-pink-500 font-semibold"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg
            className="h-6 w-6 stroke-[2]"
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
        </Link>

        <Link
          href="/discover"
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors ${
            isDiscover
              ? "text-pink-500 font-semibold"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg
            className="h-6 w-6 stroke-[2]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9 9 0 100-18 9 9 0 000 18z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.5 9.5l-5 2 2 5 5-2-2-5z"
            />
          </svg>
          <span className="text-xs">Discover</span>
        </Link>
      </div>
    </nav>
  );
}
