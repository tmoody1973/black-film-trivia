# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Firebase
```bash
firebase deploy --only firestore:rules    # Deploy Firestore rules
firebase deploy --only firestore:indexes  # Deploy Firestore indexes
```

## Environment Setup

Required environment variables in `.env.local`:
- `NEXT_PUBLIC_FIREBASE_*` - Firebase client configuration (6 variables)
- `FIREBASE_CLIENT_EMAIL` - Firebase Admin SDK email
- `FIREBASE_PRIVATE_KEY` - Firebase Admin SDK private key
- `OMDB_API_KEY` - OMDB API for movie data
- `CLAUDE_API_KEY` - Anthropic Claude API for question generation

## Architecture Overview

### State Management
The app uses **Zustand** for global state management. The game store (`src/store/game.ts`) manages:
- Current question
- Score and streak
- Questions answered count
- Game over state

All game state is centralized here and accessed via `useGameStore()` hook.

### Data Flow: Question Generation
Questions are generated through a two-part API call architecture in `/api/questions/generate`:
1. **OMDB API** - Fetches movie metadata (poster, director)
2. **Claude API** - Generates plot summary and trivia question

Both calls are made in parallel using `Promise.all()` for performance. The Claude API is prompted to return JSON with specific fields (plot, question, options, answer, movie_title).

### Firebase Architecture
Two separate Firebase configurations exist:
- **Client-side** (`src/lib/firebase.ts`) - Used for auth and Firestore reads in browser
- **Admin SDK** (`src/lib/firebase-admin.ts`) - Used for server-side operations in API routes

The `/api/scores` route uses Admin SDK for writes, while `/api/leaderboard` uses client SDK for reads. This separation is intentional for security.

### User Question Tracking
For registered (non-anonymous) users, the app tracks which movies they've been asked about:
- Stored via `/api/user-questions` endpoints
- Prevents duplicate questions within a user's session history
- Local state (`askedQuestions`) is checked before generating each question
- If all movies have been asked, the list resets

### Game Flow
1. User starts game → `PlayPage` component loads
2. For registered users: Load previously asked questions from API
3. Generate question by selecting random movie from filtered list
4. Preload next question while user answers current one
5. After 10 questions, save score to Firestore leaderboard
6. Redirect to profile page

### Scoring System
- Base points: 10 per correct answer
- Streak tracking: Increments on correct answer, resets on wrong answer
- Total score and streak saved to leaderboard collection in Firestore

### Authentication
Uses Firebase Auth with Google Sign-In. Anonymous users can play but:
- Questions are not tracked (may see duplicates)
- Scores are saved with display name "Anonymous"

## Key Files

- `src/lib/constants.ts` - List of 100+ Black-directed films used for question generation
- `src/types/game.ts` - TypeScript interfaces for Question, GameState, LeaderboardEntry, etc.
- `src/app/play/page.tsx` - Main game logic and state orchestration
- `src/app/api/questions/generate/route.ts` - AI-powered question generation
- `src/app/api/scores/route.ts` - Leaderboard write operations (uses Admin SDK)
- `src/app/api/leaderboard/route.ts` - Leaderboard read operations (uses client SDK)

## Code Patterns

### API Routes
- Use `NextResponse.json()` for responses
- Always wrap in try-catch with proper error logging
- Return structured error objects with `{ error: string, details?: string }`
- Admin SDK routes use `adminDb` from `firebase-admin`, client routes use `db` from `firebase`

### Component Patterns
- Game components are client components (`"use client"`)
- Use Zustand store for cross-component state
- Async operations show loading states
- Clean up effects on unmount (see `PlayPage` return statement)

### Styling
- Tailwind CSS with custom Pan-African color scheme (red, black, green gradients)
- Dark/Light mode support via `next-themes`
- Responsive design patterns

## Testing Notes
There are no test scripts defined in package.json. When adding tests, consider:
- Testing question generation logic
- Testing scoring calculations
- Testing Firebase rules with emulator
- Mocking API calls to OMDB and Claude

## Firebase Security
Firestore rules allow:
- Read: Public (any user)
- Write: Authenticated users only

When modifying collections or adding new endpoints, ensure security rules are updated accordingly.

## Path Aliases
TypeScript is configured with `@/*` mapping to `./src/*` for cleaner imports.
