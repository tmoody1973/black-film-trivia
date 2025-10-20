import { NextResponse } from 'next/server'
import { getAnalyticsByCategory, getAnalyticsByDifficulty, getTopPerformingQuestions } from '@/lib/analytics'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'category') {
      const data = await getAnalyticsByCategory()
      return NextResponse.json(data)
    }

    if (type === 'difficulty') {
      const data = await getAnalyticsByDifficulty()
      return NextResponse.json(data)
    }

    if (type === 'top') {
      const limit = parseInt(searchParams.get('limit') || '10')
      const data = await getTopPerformingQuestions(limit)
      return NextResponse.json(data)
    }

    // Return all stats by default
    const [categoryStats, difficultyStats, topQuestions] = await Promise.all([
      getAnalyticsByCategory(),
      getAnalyticsByDifficulty(),
      getTopPerformingQuestions(10),
    ])

    return NextResponse.json({
      byCategory: categoryStats,
      byDifficulty: difficultyStats,
      topPerforming: topQuestions,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics stats' },
      { status: 500 }
    )
  }
}
