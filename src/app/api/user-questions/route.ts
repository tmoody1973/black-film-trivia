import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import { rateLimiter, RATE_LIMITS, getClientIdentifier } from '@/lib/rate-limit'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Rate limiting
    const identifier = getClientIdentifier(request, userId || undefined)
    const { allowed, retryAfter } = rateLimiter.check(
      identifier,
      RATE_LIMITS.USER_QUESTIONS.maxRequests,
      RATE_LIMITS.USER_QUESTIONS.windowMs
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

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid userId' }, { status: 400 })
    }

    if (userId.trim().length === 0 || userId.length > 128) {
      return NextResponse.json({ error: 'userId must be between 1 and 128 characters' }, { status: 400 })
    }

    const userQuestionsRef = adminDb.collection('game_data').doc(userId)
    const docSnap = await userQuestionsRef.get()

    if (docSnap.exists) {
      return NextResponse.json(docSnap.data())
    } else {
      return NextResponse.json({ askedQuestions: [] })
    }
  } catch (error) {
    // Log full error server-side for debugging
    console.error('Error fetching user questions:', error)

    // Return generic error to client
    return NextResponse.json(
      { error: 'Failed to fetch user questions. Please try again.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, askedQuestions } = body

    // Rate limiting
    const identifier = getClientIdentifier(request, userId)
    const { allowed, retryAfter } = rateLimiter.check(
      identifier,
      RATE_LIMITS.USER_QUESTIONS.maxRequests,
      RATE_LIMITS.USER_QUESTIONS.windowMs
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

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid userId' }, { status: 400 })
    }

    if (userId.trim().length === 0 || userId.length > 128) {
      return NextResponse.json({ error: 'userId must be between 1 and 128 characters' }, { status: 400 })
    }

    if (!Array.isArray(askedQuestions)) {
      return NextResponse.json({ error: 'Invalid askedQuestions - must be an array' }, { status: 400 })
    }

    if (askedQuestions.length > 1000) {
      return NextResponse.json({ error: 'Too many asked questions (max 1000)' }, { status: 400 })
    }

    // Validate each question in the array is a string
    const allStrings = askedQuestions.every(q => typeof q === 'string' && q.length <= 200)
    if (!allStrings) {
      return NextResponse.json({ error: 'Invalid askedQuestions format - all items must be strings (max 200 chars)' }, { status: 400 })
    }

    const userQuestionsRef = adminDb.collection('game_data').doc(userId)
    await userQuestionsRef.set({
      userId,
      askedQuestions,
      updatedAt: Timestamp.now()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // Log full error server-side for debugging
    console.error('Error saving user questions:', error)

    // Return generic error to client
    return NextResponse.json(
      { error: 'Failed to save user questions. Please try again.' },
      { status: 500 }
    )
  }
} 