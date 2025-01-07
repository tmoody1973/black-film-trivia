import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore'
import { LeaderboardEntry } from '@/types/game'

export async function GET() {
  try {
    const leaderboardRef = collection(db, 'leaderboard')
    const q = query(
      leaderboardRef,
      orderBy('score', 'desc'),
      limit(100)
    )

    const querySnapshot = await getDocs(q)
    const entries: LeaderboardEntry[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      entries.push({
        id: doc.id,
        userId: data.userId,
        username: data.username,
        score: data.score,
        streak: data.streak,
        completedAt: data.completedAt.toDate(),
      })
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
} 