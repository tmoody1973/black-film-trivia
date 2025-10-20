/**
 * Analytics tracking for questions and user behavior
 */

import { adminDb } from './firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

const ANALYTICS_COLLECTION = 'question_analytics'

export interface QuestionAnalytics {
  questionId: string
  movieTitle: string
  category: string
  difficulty: string
  timesAsked: number
  timesAnsweredCorrectly: number
  timesAnsweredIncorrectly: number
  averageTimeToAnswer?: number // in seconds
  createdAt: Date
  lastAsked: Date
}

export interface AnswerEvent {
  userId: string
  questionId: string
  movieTitle: string
  category: string
  difficulty: string
  wasCorrect: boolean
  timeToAnswer: number // in seconds
  timestamp: Date
}

/**
 * Track a question being asked
 */
export async function trackQuestionAsked(
  questionId: string,
  movieTitle: string,
  category: string,
  difficulty: string
): Promise<void> {
  const analyticsRef = adminDb.collection(ANALYTICS_COLLECTION).doc(questionId)
  const doc = await analyticsRef.get()

  if (doc.exists) {
    // Update existing analytics
    await analyticsRef.update({
      timesAsked: (doc.data()?.timesAsked || 0) + 1,
      lastAsked: Timestamp.now(),
    })
  } else {
    // Create new analytics entry
    await analyticsRef.set({
      questionId,
      movieTitle,
      category,
      difficulty,
      timesAsked: 1,
      timesAnsweredCorrectly: 0,
      timesAnsweredIncorrectly: 0,
      createdAt: Timestamp.now(),
      lastAsked: Timestamp.now(),
    })
  }
}

/**
 * Track a question being answered
 */
export async function trackQuestionAnswered(event: AnswerEvent): Promise<void> {
  const analyticsRef = adminDb.collection(ANALYTICS_COLLECTION).doc(event.questionId)
  const doc = await analyticsRef.get()

  if (doc.exists) {
    const data = doc.data()
    const totalAnswers = (data?.timesAnsweredCorrectly || 0) + (data?.timesAnsweredIncorrectly || 0)
    const currentAverage = data?.averageTimeToAnswer || 0

    // Calculate new average time to answer
    const newAverage = (currentAverage * totalAnswers + event.timeToAnswer) / (totalAnswers + 1)

    await analyticsRef.update({
      timesAnsweredCorrectly: data?.timesAnsweredCorrectly || 0 + (event.wasCorrect ? 1 : 0),
      timesAnsweredIncorrectly: data?.timesAnsweredIncorrectly || 0 + (event.wasCorrect ? 0 : 1),
      averageTimeToAnswer: newAverage,
    })
  }

  // Also store individual answer event for detailed analytics
  await adminDb.collection('answer_events').add({
    ...event,
    timestamp: Timestamp.now(),
  })
}

/**
 * Get analytics for a specific question
 */
export async function getQuestionAnalytics(questionId: string): Promise<QuestionAnalytics | null> {
  const doc = await adminDb.collection(ANALYTICS_COLLECTION).doc(questionId).get()

  if (!doc.exists) {
    return null
  }

  const data = doc.data()
  return {
    questionId: data?.questionId,
    movieTitle: data?.movieTitle,
    category: data?.category,
    difficulty: data?.difficulty,
    timesAsked: data?.timesAsked || 0,
    timesAnsweredCorrectly: data?.timesAnsweredCorrectly || 0,
    timesAnsweredIncorrectly: data?.timesAnsweredIncorrectly || 0,
    averageTimeToAnswer: data?.averageTimeToAnswer,
    createdAt: data?.createdAt?.toDate(),
    lastAsked: data?.lastAsked?.toDate(),
  }
}

/**
 * Get top performing questions (highest correct answer rate)
 */
export async function getTopPerformingQuestions(limit: number = 10): Promise<QuestionAnalytics[]> {
  const snapshot = await adminDb
    .collection(ANALYTICS_COLLECTION)
    .orderBy('timesAnsweredCorrectly', 'desc')
    .limit(limit)
    .get()

  return snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      questionId: data.questionId,
      movieTitle: data.movieTitle,
      category: data.category,
      difficulty: data.difficulty,
      timesAsked: data.timesAsked || 0,
      timesAnsweredCorrectly: data.timesAnsweredCorrectly || 0,
      timesAnsweredIncorrectly: data.timesAnsweredIncorrectly || 0,
      averageTimeToAnswer: data.averageTimeToAnswer,
      createdAt: data.createdAt?.toDate(),
      lastAsked: data.lastAsked?.toDate(),
    }
  })
}

/**
 * Get questions by category (for analyzing category performance)
 */
export async function getAnalyticsByCategory(): Promise<Record<string, {
  totalAsked: number
  totalCorrect: number
  totalIncorrect: number
  averageTimeToAnswer: number
}>> {
  const snapshot = await adminDb.collection(ANALYTICS_COLLECTION).get()

  const categories: Record<string, any> = {}

  snapshot.docs.forEach(doc => {
    const data = doc.data()
    const category = data.category || 'unknown'

    if (!categories[category]) {
      categories[category] = {
        totalAsked: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        totalTimeToAnswer: 0,
        count: 0,
      }
    }

    categories[category].totalAsked += data.timesAsked || 0
    categories[category].totalCorrect += data.timesAnsweredCorrectly || 0
    categories[category].totalIncorrect += data.timesAnsweredIncorrectly || 0

    if (data.averageTimeToAnswer) {
      categories[category].totalTimeToAnswer += data.averageTimeToAnswer
      categories[category].count += 1
    }
  })

  // Calculate averages
  Object.keys(categories).forEach(category => {
    const cat = categories[category]
    cat.averageTimeToAnswer = cat.count > 0 ? cat.totalTimeToAnswer / cat.count : 0
    delete cat.totalTimeToAnswer
    delete cat.count
  })

  return categories
}

/**
 * Get analytics by difficulty level
 */
export async function getAnalyticsByDifficulty(): Promise<Record<string, {
  totalAsked: number
  totalCorrect: number
  totalIncorrect: number
  successRate: number
}>> {
  const snapshot = await adminDb.collection(ANALYTICS_COLLECTION).get()

  const difficulties: Record<string, any> = {
    easy: { totalAsked: 0, totalCorrect: 0, totalIncorrect: 0 },
    medium: { totalAsked: 0, totalCorrect: 0, totalIncorrect: 0 },
    hard: { totalAsked: 0, totalCorrect: 0, totalIncorrect: 0 },
  }

  snapshot.docs.forEach(doc => {
    const data = doc.data()
    const difficulty = data.difficulty || 'medium'

    if (difficulties[difficulty]) {
      difficulties[difficulty].totalAsked += data.timesAsked || 0
      difficulties[difficulty].totalCorrect += data.timesAnsweredCorrectly || 0
      difficulties[difficulty].totalIncorrect += data.timesAnsweredIncorrectly || 0
    }
  })

  // Calculate success rates
  Object.keys(difficulties).forEach(difficulty => {
    const diff = difficulties[difficulty]
    const total = diff.totalCorrect + diff.totalIncorrect
    diff.successRate = total > 0 ? (diff.totalCorrect / total) * 100 : 0
  })

  return difficulties
}
