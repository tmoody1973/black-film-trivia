import { NextResponse } from 'next/server'
import { trackQuestionAsked, trackQuestionAnswered } from '@/lib/analytics'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    if (type === 'question_asked') {
      const { questionId, movieTitle, category, difficulty } = data

      if (!questionId || !movieTitle || !category || !difficulty) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      await trackQuestionAsked(questionId, movieTitle, category, difficulty)
      return NextResponse.json({ success: true })
    }

    if (type === 'question_answered') {
      const { userId, questionId, movieTitle, category, difficulty, wasCorrect, timeToAnswer } = data

      if (!userId || !questionId || !movieTitle || !category || !difficulty ||
          typeof wasCorrect !== 'boolean' || typeof timeToAnswer !== 'number') {
        return NextResponse.json(
          { error: 'Missing or invalid required fields' },
          { status: 400 }
        )
      }

      await trackQuestionAnswered({
        userId,
        questionId,
        movieTitle,
        category,
        difficulty,
        wasCorrect,
        timeToAnswer,
        timestamp: new Date(),
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid type. Must be "question_asked" or "question_answered"' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}
