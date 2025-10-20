import { NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'
import { randomUUID } from 'crypto'
import { rateLimiter, RATE_LIMITS, getClientIdentifier } from '@/lib/rate-limit'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

// Cache configuration
const CACHE_TTL_HOURS = 24 // Cache questions for 24 hours
const CACHE_COLLECTION = 'question_cache'

/**
 * Generate a cache key from movie title (normalized)
 */
function getCacheKey(movieTitle: string): string {
  return movieTitle.toLowerCase().trim().replace(/[^a-z0-9]/g, '-')
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const { allowed, retryAfter } = rateLimiter.check(
      identifier,
      RATE_LIMITS.QUESTION_GENERATION.maxRequests,
      RATE_LIMITS.QUESTION_GENERATION.windowMs
    )

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter?.toString() || '60'
          }
        }
      )
    }

    const { movieTitle } = await request.json()

    // Input validation
    if (!movieTitle || typeof movieTitle !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid movieTitle' },
        { status: 400 }
      )
    }

    if (movieTitle.trim().length === 0) {
      return NextResponse.json(
        { error: 'movieTitle cannot be empty' },
        { status: 400 }
      )
    }

    if (movieTitle.length > 200) {
      return NextResponse.json(
        { error: 'movieTitle too long (max 200 characters)' },
        { status: 400 }
      )
    }

    // Check cache first
    const cacheKey = getCacheKey(movieTitle)
    const cacheRef = adminDb.collection(CACHE_COLLECTION).doc(cacheKey)
    const cacheDoc = await cacheRef.get()

    if (cacheDoc.exists) {
      const cachedData = cacheDoc.data()
      const expiresAt = cachedData?.expiresAt?.toDate()
      const now = new Date()

      // Return cached question if not expired
      if (expiresAt && expiresAt > now) {
        const cachedQuestion = {
          ...cachedData?.question,
          id: randomUUID(), // Generate new ID for each request to avoid duplicates
        }

        const response = NextResponse.json(cachedQuestion)
        response.headers.set('X-Cache-Status', 'HIT')
        response.headers.set('Cache-Control', 'public, max-age=3600')
        return response
      }
    }

    // Cache miss or expired - generate new question
    // Make both API calls in parallel
    const [omdbResponse, message] = await Promise.all([
      // OMDB API call
      fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${process.env.OMDB_API_KEY}`),
      
      // Claude API call
      anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 700,
        messages: [{
          role: 'user',
          content: `You are creating trivia questions for a game celebrating Black cinema and the incredible contributions of Black filmmakers, actors, and storytellers to the art of film.

For the film "${movieTitle}", create an engaging trivia question that:

CONTEXT & PURPOSE:
- Celebrates the cultural significance and artistic excellence of Black cinema
- Educates players about the film's impact, themes, and creative achievements
- Makes players excited to learn more about the film

QUESTION GUIDELINES:
1. Choose ONE focus area:
   - Plot & Characters: Key story moments, character motivations, memorable scenes
   - Creative Team: Director's vision, cinematography, music/score, screenplay
   - Cultural Impact: Awards won, box office success, critical acclaim, social influence
   - Behind the Scenes: Casting choices, filming locations, production challenges, fun facts
   - Themes & Meaning: Social commentary, cultural representation, artistic symbolism

2. Difficulty Level (MEDIUM):
   - Avoid overly obscure details (e.g., "What was the assistant director's middle name?")
   - Avoid too-easy questions (e.g., "Who is the main character?")
   - Perfect difficulty: Requires having watched the film OR knowing film history
   - Reward genuine film knowledge, not trivial minutiae

3. Question Quality:
   - Be specific and clear
   - Make the question interesting and engaging
   - Include context when helpful (e.g., "In the Oscar-winning film...")
   - Celebrate the achievement (e.g., "What groundbreaking technique did...")

DISTRACTOR (WRONG ANSWER) GUIDELINES:
- Make distractors plausible but clearly distinguishable for someone who knows the film
- Use real names/facts from the film industry (don't invent fake names)
- Ensure one answer is definitively correct
- Avoid trick questions or overly similar options

PLOT SUMMARY GUIDELINES:
- Write 2-3 engaging sentences
- Capture the essence and emotional core of the story
- Highlight what makes this film culturally significant
- Avoid spoilers of major plot twists

Format your response as valid JSON with these exact fields:
{
  "plot": "2-3 sentence engaging plot summary",
  "question": "The trivia question",
  "options": ["Correct answer", "Plausible distractor 1", "Plausible distractor 2", "Plausible distractor 3"],
  "answer": "The correct answer (must exactly match one option)",
  "movie_title": "${movieTitle}",
  "category": "one of: plot, creative_team, cultural_impact, behind_scenes, themes",
  "explanation": "1-2 sentences explaining why this answer is significant or interesting"
}

EXAMPLE (for reference style only):
{
  "plot": "A young African-American man visits his white girlfriend's family estate, only to discover a disturbing secret about their intentions. Jordan Peele's directorial debut masterfully blends social commentary with psychological horror.",
  "question": "What groundbreaking achievement did 'Get Out' accomplish at the 90th Academy Awards?",
  "options": [
    "Jordan Peele became the first African-American to win Best Original Screenplay",
    "It won Best Picture",
    "Daniel Kaluuya became the youngest Best Actor winner",
    "It won Best Director and Best Picture"
  ],
  "answer": "Jordan Peele became the first African-American to win Best Original Screenplay",
  "movie_title": "Get Out",
  "category": "cultural_impact",
  "explanation": "This historic win recognized Peele's sharp social commentary and innovative storytelling, opening doors for more Black voices in screenwriting."
}

Now create a unique, engaging question for "${movieTitle}".`
        }]
      })
    ])

    if (!omdbResponse.ok) {
      console.error('OMDB API Error:', await omdbResponse.text())
      throw new Error('Failed to fetch movie data')
    }

    const movieData = await omdbResponse.json()
    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    const questionData = JSON.parse(content.text)
    const fullQuestion = {
      ...questionData,
      posterUrl: movieData.Poster,
      director: movieData.Director,
      difficulty: 'medium'
    }

    // Store in cache (without ID - we'll generate fresh IDs on retrieval)
    const now = Timestamp.now()
    const expiresAt = Timestamp.fromDate(
      new Date(Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000)
    )

    await cacheRef.set({
      movieTitle,
      question: fullQuestion,
      createdAt: now,
      expiresAt: expiresAt,
    })

    // Return question with unique ID
    const response = NextResponse.json({
      ...fullQuestion,
      id: randomUUID(),
    })

    // Add caching headers
    response.headers.set('X-Cache-Status', 'MISS')
    response.headers.set('Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    return response

  } catch (error) {
    // Log full error server-side for debugging
    console.error('Error generating question:', error)

    // Return generic error to client (don't expose internal details)
    return NextResponse.json(
      { error: 'Failed to generate question. Please try again.' },
      { status: 500 }
    )
  }
} 