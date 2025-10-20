import { NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'
import { randomUUID } from 'crypto'
import { rateLimiter, RATE_LIMITS, getClientIdentifier } from '@/lib/rate-limit'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

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

    console.log('Generating question for movie:', movieTitle)

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
    const response = NextResponse.json({
      ...questionData,
      id: randomUUID(),
      posterUrl: movieData.Poster,
      director: movieData.Director,
      difficulty: 'medium'
    })

    // Add caching headers
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