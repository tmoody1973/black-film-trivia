import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import { rateLimiter, RATE_LIMITS, getClientIdentifier } from '@/lib/rate-limit'

export async function GET(request: Request) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const { allowed, retryAfter } = rateLimiter.check(
      identifier,
      RATE_LIMITS.LEADERBOARD.maxRequests,
      RATE_LIMITS.LEADERBOARD.windowMs
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

    const leaderboardRef = adminDb.collection('leaderboard')
    const querySnapshot = await leaderboardRef
      .orderBy('score', 'desc')
      .limit(100)
      .get()

    const entries = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(entries)
  } catch (error) {
    // Log full error server-side for debugging
    console.error('Error fetching leaderboard:', error)

    // Return generic error to client
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard. Please try again.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, username, score, streak } = body

    // Rate limiting (use userId if available for more accurate limiting)
    const identifier = getClientIdentifier(request, userId)
    const { allowed, retryAfter } = rateLimiter.check(
      identifier,
      RATE_LIMITS.SCORE_SUBMISSION.maxRequests,
      RATE_LIMITS.SCORE_SUBMISSION.windowMs
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

    // Input validation
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid userId' }, { status: 400 })
    }

    if (userId.trim().length === 0 || userId.length > 128) {
      return NextResponse.json({ error: 'userId must be between 1 and 128 characters' }, { status: 400 })
    }

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid username' }, { status: 400 })
    }

    if (username.trim().length === 0 || username.length > 50) {
      return NextResponse.json({ error: 'username must be between 1 and 50 characters' }, { status: 400 })
    }

    if (typeof score !== 'number' || !Number.isInteger(score)) {
      return NextResponse.json({ error: 'Invalid score - must be an integer' }, { status: 400 })
    }

    if (score < 0 || score > 100) {
      return NextResponse.json({ error: 'Score must be between 0 and 100' }, { status: 400 })
    }

    if (typeof streak !== 'number' || !Number.isInteger(streak)) {
      return NextResponse.json({ error: 'Invalid streak - must be an integer' }, { status: 400 })
    }

    if (streak < 0 || streak > 10) {
      return NextResponse.json({ error: 'Streak must be between 0 and 10' }, { status: 400 })
    }

    const scoreData = {
      userId,
      username,
      score,
      streak,
      completedAt: Timestamp.now()
    }

    const leaderboardRef = adminDb.collection('leaderboard')
    const docRef = await leaderboardRef.add(scoreData)

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: 'Score saved successfully'
    })
  } catch (error) {
    // Log full error server-side for debugging
    console.error('Error saving score:', error)

    // Return generic error to client
    return NextResponse.json(
      { error: 'Failed to save score. Please try again.' },
      { status: 500 }
    )
  }
} 