/**
 * Question cache management utilities
 * Provides functions to manage the Firestore question cache
 */

import { adminDb } from './firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

const CACHE_COLLECTION = 'question_cache'

/**
 * Invalidate (delete) cached question for a specific movie
 */
export async function invalidateQuestionCache(movieTitle: string): Promise<void> {
  const cacheKey = getCacheKey(movieTitle)
  await adminDb.collection(CACHE_COLLECTION).doc(cacheKey).delete()
}

/**
 * Invalidate all cached questions
 */
export async function invalidateAllQuestions(): Promise<void> {
  const snapshot = await adminDb.collection(CACHE_COLLECTION).get()
  const batch = adminDb.batch()

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })

  await batch.commit()
}

/**
 * Clean up expired cache entries
 * This can be run periodically (e.g., via a cron job or Cloud Function)
 */
export async function cleanupExpiredCache(): Promise<number> {
  const now = Timestamp.now()
  const snapshot = await adminDb
    .collection(CACHE_COLLECTION)
    .where('expiresAt', '<=', now)
    .get()

  if (snapshot.empty) {
    return 0
  }

  const batch = adminDb.batch()
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })

  await batch.commit()
  return snapshot.size
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalCached: number
  expired: number
  active: number
}> {
  const now = Timestamp.now()
  const allSnapshot = await adminDb.collection(CACHE_COLLECTION).get()
  const expiredSnapshot = await adminDb
    .collection(CACHE_COLLECTION)
    .where('expiresAt', '<=', now)
    .get()

  return {
    totalCached: allSnapshot.size,
    expired: expiredSnapshot.size,
    active: allSnapshot.size - expiredSnapshot.size,
  }
}

/**
 * Generate a cache key from movie title (normalized)
 * This must match the function in the API route
 */
function getCacheKey(movieTitle: string): string {
  return movieTitle.toLowerCase().trim().replace(/[^a-z0-9]/g, '-')
}
