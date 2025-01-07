import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export async function GET() {
  try {
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
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, username, score, streak } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }
    if (!username) {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 })
    }
    if (typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
    }
    if (typeof streak !== 'number') {
      return NextResponse.json({ error: 'Invalid streak' }, { status: 400 })
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
    console.error('Error saving score:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save score' },
      { status: 500 }
    )
  }
} 