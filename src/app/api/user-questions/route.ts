import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const userQuestionsRef = adminDb.collection('game_data').doc(userId)
    const docSnap = await userQuestionsRef.get()

    if (docSnap.exists) {
      return NextResponse.json(docSnap.data())
    } else {
      return NextResponse.json({ askedQuestions: [] })
    }
  } catch (error) {
    console.error('Error fetching user questions:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user questions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, askedQuestions } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    if (!Array.isArray(askedQuestions)) {
      return NextResponse.json({ error: 'Invalid askedQuestions' }, { status: 400 })
    }

    const userQuestionsRef = adminDb.collection('game_data').doc(userId)
    await userQuestionsRef.set({
      userId,
      askedQuestions,
      updatedAt: Timestamp.now()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving user questions:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save user questions' },
      { status: 500 }
    )
  }
} 