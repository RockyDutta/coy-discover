import { FeedProfile } from "@/lib/types";

interface ProfileCardProps {
  profile: FeedProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="relative flex h-[540px] w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl select-none">
      {/* Profile Photo */}
      <div className="relative h-full w-full bg-neutral-950">
        <img
          src={profile.photoUrl}
          alt={profile.name}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="h-full w-full object-cover select-none pointer-events-none"
        />

        {/* Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

        {/* Profile Info Overlay at bottom */}
        <div className="absolute bottom-0 inset-x-0 p-5 text-white pointer-events-none">
          {/* Name & Age */}
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
              {profile.name}
            </h2>
            <span className="text-xl font-light text-neutral-300 drop-shadow">
              {profile.age}
            </span>
          </div>

          {/* City or College */}
          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-neutral-300 drop-shadow">
            <svg
              className="h-3.5 w-3.5 text-pink-400 shrink-0"
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

          {/* Short Bio */}
          <p className="mt-2.5 text-xs leading-relaxed text-neutral-200 line-clamp-3 drop-shadow">
            {profile.bio}
          </p>

          {/* Interests Chips */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {profile.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-white/10 bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-neutral-100 backdrop-blur-md shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
