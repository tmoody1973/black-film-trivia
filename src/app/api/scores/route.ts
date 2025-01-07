import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function POST(request: Request) {
  try {
    const { userId, username, score, streak } = await request.json()

    if (!userId || !username || typeof score !== 'number' || typeof streak !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const scoreRef = await addDoc(collection(db, 'leaderboard'), {
      userId,
      username,
      score,
      streak,
      completedAt: serverTimestamp(),
    })

    return NextResponse.json({ id: scoreRef.id })
  } catch (error) {
    console.error('Error saving score:', error)
    return NextResponse.json(
      { error: 'Failed to save score' },
      { status: 500 }
    )
  }
} 