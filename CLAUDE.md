# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint checks
```

## Architecture Overview

This is a **Black Cultural Trivia** platform built with Next.js 15 (App Router) and TypeScript. Players answer trivia questions about Black-directed films (105+) and books by Black authors (300+ planned), earn points, and compete on a global leaderboard.

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Motion.dev
- **State**: Zustand (transient game session state only)
- **Auth**: Clerk (SignIn/SignedIn/UserButton components)
- **Database**: Convex (users, leaderboard, game_sessions, user_question_history)
- **APIs**: Perplexity Sonar (question generation), OMDB (movie posters), Google Books (planned)

### Key Directories

```
/src/app/api/           # API routes
  questions/generate/   # Claude + OMDB parallel calls for trivia questions

/src/components/        # React components
  /game/                # Game UI components (question-card, timer)
  /ui/                  # shadcn/ui components (button, etc.)
  navigation.tsx        # Header with Clerk auth
  theme-provider.tsx    # Dark/light mode

/src/store/game.ts      # Zustand store for game session state
/src/lib/               # Utils, constants (105 Black-directed films)
/convex/                # Convex backend
  schema.ts             # Database schema
  users.ts              # User management
  leaderboard.ts        # Scores and rankings
  questions.ts          # Question history tracking
```

### Game Flow
1. User starts game → fetches question via `/api/questions/generate`
2. Question generation: Claude API + OMDB API called in parallel
3. Next question preloaded during 3-second answer delay
4. After 10 questions, score saves to Convex → redirect to leaderboard
5. Asked questions tracked per user in Convex to avoid repeats

### State Management
Zustand store (`/src/store/game.ts`) manages transient session state:
- `currentQuestion`, `score`, `streak`, `questionsAnswered`, `isGameOver`
- No persistence—resets each session by design

### Environment Variables Required
- `PERPLEXITY_API_KEY` - Perplexity Sonar API for question generation
- `OMDB_API_KEY` - Movie poster/metadata lookup
- `GOOGLE_BOOKS_API_KEY` - Book cover/metadata (planned)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk frontend
- `CLERK_SECRET_KEY` - Clerk backend
- `NEXT_PUBLIC_CONVEX_URL` - Convex backend URL
- `CONVEX_DEPLOY_KEY` - Convex deployment

### Patterns to Follow
- Use `"use client"` directive for client-side components
- Use Convex `useQuery`/`useMutation` hooks for data operations
- Use Clerk `useUser`, `SignedIn`, `SignedOut` for auth
- Parallel API calls with `Promise.all()` where possible
- Tailwind utility classes + shadcn components for styling
- Path alias: `@/*` maps to `./src/*`

## Current Priorities (see PROJECT_STATUS.md for full details)

1. **Content expansion** - Add 300 books, expand film list
2. **Google Books API integration** - Book covers and metadata
3. **Difficulty system** - Easy/Medium/Hard with different scoring
4. **Theme categories** - Historical periods, genres, regions
