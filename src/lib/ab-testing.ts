/**
 * A/B Testing framework for prompt variations
 * Allows testing different prompt strategies to optimize question quality
 */

import { adminDb } from './firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

const AB_TESTS_COLLECTION = 'ab_tests'
const AB_RESULTS_COLLECTION = 'ab_test_results'

export interface PromptVariant {
  id: string
  name: string
  promptTemplate: string
  description: string
}

export interface ABTest {
  id: string
  name: string
  description: string
  variants: PromptVariant[]
  isActive: boolean
  trafficSplit: number[] // e.g., [50, 50] for 50/50 split
  createdAt: Date
  startedAt?: Date
  endedAt?: Date
}

export interface ABTestResult {
  testId: string
  variantId: string
  questionId: string
  movieTitle: string
  difficulty: string
  wasAnsweredCorrectly?: boolean
  timeToAnswer?: number
  userFeedback?: 'good' | 'bad' | null
  timestamp: Date
}

/**
 * Create a new A/B test
 */
export async function createABTest(test: Omit<ABTest, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await adminDb.collection(AB_TESTS_COLLECTION).add({
    ...test,
    createdAt: Timestamp.now(),
  })

  return docRef.id
}

/**
 * Get active A/B test for question generation
 */
export async function getActiveABTest(): Promise<ABTest | null> {
  const snapshot = await adminDb
    .collection(AB_TESTS_COLLECTION)
    .where('isActive', '==', true)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  const data = doc.data()

  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    variants: data.variants,
    isActive: data.isActive,
    trafficSplit: data.trafficSplit,
    createdAt: data.createdAt.toDate(),
    startedAt: data.startedAt?.toDate(),
    endedAt: data.endedAt?.toDate(),
  }
}

/**
 * Assign a variant to a user based on traffic split
 * Uses consistent hashing to ensure same user gets same variant
 */
export async function assignVariant(userId: string): Promise<PromptVariant | null> {
  const activeTest = await getActiveABTest()

  if (!activeTest || !activeTest.variants || activeTest.variants.length === 0) {
    return null
  }

  // Simple hash function to assign variant
  const hash = userId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)

  const totalWeight = activeTest.trafficSplit.reduce((a, b) => a + b, 0)
  const normalizedHash = hash % totalWeight

  let currentWeight = 0
  for (let i = 0; i < activeTest.variants.length; i++) {
    currentWeight += activeTest.trafficSplit[i]
    if (normalizedHash < currentWeight) {
      return activeTest.variants[i]
    }
  }

  return activeTest.variants[0]
}

/**
 * Record A/B test result
 */
export async function recordABTestResult(result: Omit<ABTestResult, 'timestamp'>): Promise<void> {
  await adminDb.collection(AB_RESULTS_COLLECTION).add({
    ...result,
    timestamp: Timestamp.now(),
  })
}

/**
 * Get A/B test results summary
 */
export async function getABTestResults(testId: string): Promise<{
  [variantId: string]: {
    totalQuestions: number
    totalAnswered: number
    correctAnswers: number
    successRate: number
    averageTimeToAnswer: number
    goodFeedback: number
    badFeedback: number
  }
}> {
  const snapshot = await adminDb
    .collection(AB_RESULTS_COLLECTION)
    .where('testId', '==', testId)
    .get()

  const results: Record<string, any> = {}

  snapshot.docs.forEach(doc => {
    const data = doc.data()
    const variantId = data.variantId

    if (!results[variantId]) {
      results[variantId] = {
        totalQuestions: 0,
        totalAnswered: 0,
        correctAnswers: 0,
        totalTime: 0,
        timeCount: 0,
        goodFeedback: 0,
        badFeedback: 0,
      }
    }

    results[variantId].totalQuestions++

    if (typeof data.wasAnsweredCorrectly === 'boolean') {
      results[variantId].totalAnswered++
      if (data.wasAnsweredCorrectly) {
        results[variantId].correctAnswers++
      }
    }

    if (typeof data.timeToAnswer === 'number') {
      results[variantId].totalTime += data.timeToAnswer
      results[variantId].timeCount++
    }

    if (data.userFeedback === 'good') {
      results[variantId].goodFeedback++
    } else if (data.userFeedback === 'bad') {
      results[variantId].badFeedback++
    }
  })

  // Calculate final metrics
  Object.keys(results).forEach(variantId => {
    const variant = results[variantId]
    variant.successRate = variant.totalAnswered > 0
      ? (variant.correctAnswers / variant.totalAnswered) * 100
      : 0
    variant.averageTimeToAnswer = variant.timeCount > 0
      ? variant.totalTime / variant.timeCount
      : 0
    delete variant.totalTime
    delete variant.timeCount
  })

  return results
}

/**
 * End an A/B test
 */
export async function endABTest(testId: string): Promise<void> {
  await adminDb.collection(AB_TESTS_COLLECTION).doc(testId).update({
    isActive: false,
    endedAt: Timestamp.now(),
  })
}
