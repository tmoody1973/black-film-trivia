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
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `For the film "${movieTitle}", please provide:
          1. A 2-3 sentence plot summary that captures the key elements of the story
          2. A moderately challenging trivia question about the film The question should focus on the film's plot, characters, director, awards, or interesting behind-the-scenes facts. For each new request, select a different movie from the list and create a unique question that is engaging but not excessively difficult to answer.
          
          Format your response in JSON with these fields:
          - plot: A 2-3 sentence summary of the film's plot
          - question: The trivia question
          - options: Array of 4 possible answers
          - answer: The correct answer
          - movie_title: The title of the film`
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