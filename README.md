# Coy Discover Tab (Part B - SDE Intern Assignment)

A standalone swipe-based Discover feature built for the Coy SDE Intern Assignment. Designed mobile-first with smooth gestures, privacy-first mutual matching, and persistent SQLite storage.

---

## 🚀 Features

- **Profile Data**: 32 diverse seeded mock profiles with photo, name, age, city/college, bio, and interest tags.
- **Swipe Experience**:
  - Drag gestures on mobile and touch screens with dynamic `LIKE` (green) and `PASS` (red) visual stamps.
  - Dedicated desktop action buttons (Pass ✕ and Like ♥).
  - Smooth card animations and exit transitions using **Framer Motion**.
  - Swiped profiles never appear again.
  - Informative empty state when all profiles have been swiped.
- **Matching & Privacy Rules**:
  - Mutual matching: A match happens **only** when both users have liked each other.
  - Never reveals who has liked the user unless it is mutual.
  - "It's a Match!" celebration modal appears immediately on mutual like.
  - Dedicated **Matches View** listing all mutual connections.
- **Tab Bar**:
  - Bottom navigation bar with placeholder **Home** tab and functional **Discover** tab.
- **Backend APIs**:
  - `GET /feed`: Returns profiles not yet swiped on by the user, ordered by `id`. Excludes `'me'`.
  - `POST /swipe`: Records a like or pass and returns whether it created a match (`{ isMatch: boolean, matchedProfile?: ... }`). Atomic transaction.
  - `GET /matches`: Returns all mutual matches for the user.
  - All swipes and matches persist across page reloads.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript & React 19
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database & ORM**: SQLite via Prisma ORM
- **Testing**: Vitest for backend service integration tests

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
DATABASE_URL="file:./dev.db"
```

### 3. Initialize Database Schema
```bash
npx prisma db push
```

### 4. Seed Mock Profiles & Demo Likes
```bash
npx prisma db seed
```
> *Seeded incoming likes to `'me'` from `p02`, `p05`, `p09`, `p14`, `p19`, `p24`, and `p28` to demonstrate live mutual matches during testing.*

### 5. Run Backend Tests
```bash
npm test
```

### 6. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Guidelines

1. **Feed Order & Fields**: Run `npm test` to verify that the feed excludes `'me'`, is ordered strictly by `id`, and returns only the 7 allowed profile fields (`id, name, age, photoUrl, bio, city, interests`).
2. **Mutual Match Demo**: In the web UI, swiping right (Like) on **Rohan Mehta** (`p02`) or **Aria Sharma** (`p05`) triggers the **"It's a Match!"** screen. Swiping right on profiles who have not liked you records the like quietly without triggering a match.
3. **Matches View**: Toggle the **Matches** view in the top header or click **View Matches** in the match modal to see mutual connections.
4. **Persistence**: Refresh the page to verify that swipes and matches remain persisted in SQLite.
