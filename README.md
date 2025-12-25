# Black Film & Literature Trivia

A web-based trivia game celebrating Black cinema and literature. Test your knowledge of films by Black directors and books by Black authors. Built with Next.js 15, TypeScript, Tailwind CSS, Convex, and Clerk.

## Features

### Multi-Category Trivia
- **Films** - 300+ titles by Black directors spanning decades of groundbreaking cinema
- **Books** - 350+ titles by Black authors across all genres
- **Mixed Mode** - Combine films and books for the ultimate challenge

### Themed Categories
- **Historical Eras** - Harlem Renaissance, Civil Rights Era, Black Power Movement, Modern Era
- **Genres** - Horror, Romance, Comedy, Drama, Sci-Fi & Fantasy, Documentary
- **Regional** - African Cinema, Caribbean Stories, British Black Cinema
- **Special** - Action & Crime, Sports, Young Adult & Children

### Difficulty Levels
**Student Mode:**
- Middle School (Ages 11-14) - Basic plot and character questions
- High School (Ages 14-18) - Themes and cultural context

**General Mode:**
- Easy - More time, helpful hints
- Medium - Standard challenge
- Hard - Expert level trivia

### Game Features
- Real-time scoring with streak multipliers
- 10-question rounds with progress tracking
- Rich learning content after each question:
  - "Did You Know?" facts
  - Cultural context and significance
  - Creator spotlights (directors/authors)
  - Awards and legacy information
- Movie posters from OMDB API
- Book covers from Google Books API
- AI-powered question generation with intelligent caching
- Global leaderboard with score tracking

### Technical Features
- Server-side question caching for instant responses
- Background question generation (no timeouts)
- Category-specific session tracking (prevents repeat questions)
- User authentication required to play
- Dark/Light mode support
- Fully responsive design

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom animations
- **Database:** Convex (real-time backend)
- **Authentication:** Clerk
- **AI:** Perplexity API (question generation)
- **APIs:** OMDB (film metadata), Google Books (book metadata)
- **State Management:** Zustand
- **Animations:** Framer Motion

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Convex account
- Clerk account
- Perplexity API key
- OMDB API key (free tier available)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# APIs
PERPLEXITY_API_KEY=pplx-xxxxx
OMDB_API_KEY=xxxxx
GOOGLE_BOOKS_API_KEY=xxxxx (optional)
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tmoody1973/black-film-trivia.git
cd black-film-trivia
```

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Convex Setup

1. Create a Convex account at [https://convex.dev](https://convex.dev)
2. Run `npx convex dev` to initialize your project
3. Set environment variables in Convex dashboard:
   - `CLERK_JWT_ISSUER_DOMAIN` - Your Clerk JWT issuer domain
   - `PERPLEXITY_API_KEY` - For production question generation
   - `OMDB_API_KEY` - For film metadata

## Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables (use production Convex URL)
3. Deploy

### Convex Production
```bash
npx convex deploy
```

Make sure to set all environment variables in the Convex production dashboard.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── game-setup/        # Category/theme/difficulty selection
│   ├── play/              # Main game page
│   ├── leaderboard/       # Global leaderboard
│   └── profile/           # User profile
├── components/
│   ├── game/              # Game-specific components
│   └── ui/                # Reusable UI components
├── lib/
│   └── content/           # Content data (films, books, themes)
├── store/                 # Zustand state management
└── types/                 # TypeScript type definitions

convex/
├── generateQuestion.ts    # AI question generation action
├── questionCache.ts       # Question caching logic
├── leaderboard.ts         # Leaderboard mutations/queries
├── questions.ts           # Question history tracking
└── schema.ts              # Database schema
```

## Content Library

### Films (300+ titles)
Organized by genre: Drama, Horror & Thriller, Comedy, Action & Crime, Romance, Sci-Fi & Fantasy, Documentary, Musical, Sports, International (African, British, Caribbean, French), Independent & Arthouse, Family & Children's

### Books (350+ titles)
Organized by category: Classic Literature, Contemporary Fiction, Young Adult, Science Fiction & Fantasy (Afrofuturism), Horror & Gothic, Non-Fiction & Essays, Memoir & Autobiography, Poetry, Business & Self-Help, Children's Literature, LGBTQ+ Literature, African & Diaspora Literature, Romance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Adding Content
To add new films or books, edit the files in `src/lib/content/`:
- `films.ts` - Film titles by Black directors
- `books.ts` - Books by Black authors
- `themes.ts` - Theme definitions and content mappings

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the Black filmmakers and authors whose work inspires this project
- The open source community for the amazing tools and libraries
