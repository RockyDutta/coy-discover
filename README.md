# Coy Discover Tab

Coy Discover is a mobile-first swipe discovery feature built for the Coy SDE Intern Assignment. It allows users to browse profiles, swipe left to pass, or swipe right to like, with mutual matches revealed only when both users have liked each other. The core promise of privacy is enforced at every layer: incoming likes are never exposed until a mutual connection is made.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & ORM**: SQLite with Prisma ORM
- **Testing**: Vitest

---

## 🚀 Setup for a Clean Clone

Clone the repository and run the following commands:

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment variables
cp .env.example .env
# Windows PowerShell: Copy-Item .env.example .env
# Windows CMD: copy .env.example .env

# 3. Apply database migrations
npx prisma migrate dev

# 4. Seed database with mock profiles and demo likes
npm run db:seed

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Navigating to `/` automatically redirects to `/discover`.

---

## 📡 API Endpoints

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

## 🎯 Demo Notes for Reviewer

The database is seeded with 32 mock profiles (`p01`–`p32`) and 6 pre-existing incoming likes directed to the logged-in demo user (`me`):

| Profile ID | Name | Seeded Action to 'me' |
|:---:|:---:|:---:|
| `p04` | Sneha | `LIKE` |
| `p09` | Arjun | `LIKE` |
| `p15` | Dev | `LIKE` |
| `p21` | Jai | `LIKE` |
| `p26` | Samir | `LIKE` |
| `p30` | Kiran | `LIKE` |

> **Important**: This information is provided strictly for reviewer testing so you can trigger a match (e.g. liking `p04`). The application UI and backend responses never reveal incoming likes to the user until a mutual match occurs.

---

## 🧪 Running Tests

The test suite covers backend logic, service boundaries, atomic transactions, and concurrency safeguards:

```bash
npm test
```

To run TypeScript verification:
```bash
npx tsc --noEmit
```

To run lint checks:
```bash
npm run lint
```

---

## 🔒 Git Security Check
Both `.env` and SQLite database files (`*.db`, `*.db-journal`, `dev.db`, `test.db`) are ignored in `.gitignore` and are not committed to the repository.
