import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

const CACHE_COLLECTION = 'question_cache'

/**
 * GET /api/cache/manage
 * List all cached questions with filtering options
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const movieTitle = searchParams.get('movieTitle')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = adminDb.collection(CACHE_COLLECTION).orderBy('createdAt', 'desc')

    if (movieTitle) {
      query = query.where('movieTitle', '==', movieTitle) as any
    }

    if (difficulty) {
      query = query.where('difficulty', '==', difficulty) as any
    }

    const snapshot = await query.limit(limit).get()

    const cachedQuestions = snapshot.docs.map(doc => ({
      cacheKey: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString(),
      expiresAt: doc.data().expiresAt?.toDate()?.toISOString(),
    }))

    return NextResponse.json(cachedQuestions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cached questions' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cache/manage?cacheKey=...
 * Delete a specific cached question
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cacheKey = searchParams.get('cacheKey')
    const deleteAll = searchParams.get('all') === 'true'

    if (deleteAll) {
      // Delete all cache entries
      const snapshot = await adminDb.collection(CACHE_COLLECTION).get()
      const batch = adminDb.batch()

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })

      await batch.commit()

      return NextResponse.json({
        success: true,
        message: `Deleted ${snapshot.size} cached questions`
      })
    }

    if (!cacheKey) {
      return NextResponse.json(
        { error: 'Missing cacheKey parameter' },
        { status: 400 }
      )
    }

    await adminDb.collection(CACHE_COLLECTION).doc(cacheKey).delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete cached question' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/cache/manage
 * Update a cached question
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { cacheKey, question } = body

    if (!cacheKey || !question) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const docRef = adminDb.collection(CACHE_COLLECTION).doc(cacheKey)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Cached question not found' },
        { status: 404 }
      )
    }

    // Update the question while preserving metadata
    await docRef.update({
      question: question,
      updatedAt: Timestamp.now(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update cached question' },
      { status: 500 }
    )
  }
}
