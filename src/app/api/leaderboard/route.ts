import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query, limit, Timestamp } from 'firebase/firestore'
import { LeaderboardEntry } from '@/types/game'

export async function GET() {
  try {
    console.log('Starting leaderboard fetch...')
    const leaderboardRef = collection(db, 'leaderboard')
    
    // Create the query
    console.log('Creating query...')
    const q = query(
      leaderboardRef,
      orderBy('score', 'desc'),
      limit(100)
    )

    console.log('Executing Firestore query...')
    let querySnapshot
    try {
      querySnapshot = await getDocs(q)
    } catch (queryError) {
      console.error('Error executing query:', queryError)
      throw queryError
    }

    console.log('Processing query results...')
    const entries: LeaderboardEntry[] = []

    querySnapshot.forEach((doc) => {
      try {
        const data = doc.data()
        console.log('Processing document:', doc.id)
        
        // Safely handle the completedAt timestamp
        let completedAt: Date
        if (data.completedAt && data.completedAt instanceof Timestamp) {
          completedAt = data.completedAt.toDate()
        } else {
          completedAt = new Date()
        }

        const entry: LeaderboardEntry = {
          id: doc.id,
          userId: data.userId || '',
          username: data.username || 'Anonymous',
          score: typeof data.score === 'number' ? data.score : 0,
          streak: typeof data.streak === 'number' ? data.streak : 0,
          completedAt: completedAt,
        }
        
        console.log('Processed entry:', entry)
        entries.push(entry)
      } catch (docError) {
        console.error('Error processing document:', doc.id, docError)
      }
    })

    console.log(`Successfully fetched ${entries.length} leaderboard entries`)
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Detailed leaderboard error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
} 