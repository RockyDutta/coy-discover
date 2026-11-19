# Coy Discover Tab

Coy Discover is a mobile-first swipe discovery feature built for the Coy SDE Intern Assignment. It allows users to browse profiles, swipe left to pass, or swipe right to like, with mutual matches revealed only when both users have liked each other. The core promise of privacy is enforced at every layer: incoming likes are never exposed until a mutual connection is made.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion
- **Backend**: Next.js Route Handlers
- **Database**: SQLite with Prisma ORM
- **Testing**: Vitest

---

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # On Windows CMD: copy .env.example .env
   # On PowerShell: Copy-Item .env.example .env
   ```

3. Initialize database and seed mock data:
   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) (visiting `/` redirects to `/discover`).

---

## API Endpoints

### 1. `GET /feed`
Returns candidate profiles that the logged-in user (`me`) has not yet swiped on, ordered strictly by profile `id` ascending. Excludes the current user.

* **Request**:
  ```http
  GET /feed
  ```
* **Response** (`200 OK`):
  ```json
  {
    "profiles": [
      {
        "id": "p01",
        "name": "Aarav",
        "age": 21,
        "photoUrl": "https://picsum.photos/seed/p01/600/800",
        "bio": "Hello! I am Aarav, a 21-year-old from Delhi.",
        "city": "IIT Bombay",
        "interests": ["travel", "art", "technology", "cooking", "photography"]
      }
    ]
  }
  ```

---

### 2. `POST /swipe`
Records a swipe action (`LIKE` or `PASS`) on the specified profile.

* **Request**:
  ```http
  POST /swipe
  Content-Type: application/json

  {
    "profileId": "p04",
    "action": "LIKE"
  }
  ```
* **Response – When not a mutual match** (`200 OK`):
  ```json
  {
    "success": true,
    "isMatch": false,
    "message": "Swipe recorded"
  }
  ```
* **Response – When a mutual match occurs** (`200 OK`):
  ```json
  {
    "success": true,
    "isMatch": true,
    "message": "It's a match!"
  }
  ```
* **Error Safeguards**:
  * `400 Bad Request`: Invalid action (must be exactly `LIKE` or `PASS`) or swiping on oneself.
  * `404 Not Found`: Target profile does not exist.
  * `409 Conflict`: Target profile was already swiped.

---

### 3. `GET /matches`
Returns the public profile details of all mutual matches involving the current user.

* **Request**:
  ```http
  GET /matches
  ```
* **Response** (`200 OK`):
  ```json
  {
    "matches": [
      {
        "id": "p04",
        "name": "Sneha",
        "age": 24,
        "photoUrl": "https://picsum.photos/seed/p04/600/800",
        "bio": "Hello! I am Sneha, a 24-year-old from Delhi.",
        "city": "Delhi",
        "interests": ["movies", "cooking", "travel", "photography"]
      }
    ]
  }
  ```

---

## Reviewer Notes (Seeded Likes)

The database is seeded with 32 mock profiles (`p01`–`p32`) and 6 profiles that have already liked `me`:

| Profile ID | Name | Seeded Action |
|:---:|:---:|:---:|
| `p04` | Sneha | `LIKE` |
| `p09` | Arjun | `LIKE` |
| `p15` | Dev | `LIKE` |
| `p21` | Jai | `LIKE` |
| `p26` | Samir | `LIKE` |
| `p30` | Kiran | `LIKE` |

*Note: This information is strictly for testing matches (e.g. liking `p04`). The application UI and APIs never expose incoming likes until a mutual match occurs.*

---

## Running Tests

Run the Vitest test suite:
```bash
npm test
```

To run linting:
```bash
npm run lint
```

---

## Database & Security
`.env` and SQLite database files (`*.db`, `*.db-journal`, `dev.db`, `test.db`) are excluded in `.gitignore` and are not committed.
