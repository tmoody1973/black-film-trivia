import { NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { movieTitle } = await request.json()
    
    console.log('Generating question for movie:', movieTitle)

    // Make both API calls in parallel
    const [omdbResponse, message] = await Promise.all([
      // OMDB API call
      fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${process.env.OMDB_API_KEY}`),
      
      // Claude API call
      anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `For the film "${movieTitle}", please provide:
          1. A 2-3 sentence plot summary that captures the key elements of the story
          2. A moderately challenging trivia question about the film The question should focus on the film's plot, characters, director, awards, or interesting behind-the-scenes facts. For each new request, select a different movie from the list and create a unique question that is engaging but not excessively difficult to answer.
          
          Format your response in JSON with these fields:
          - plot: A 2-3 sentence summary of the film's plot
          - question: The trivia question
          - options: Array of 4 possible answers
          - answer: The correct answer
          - movie_title: The title of the film`
        }]
      })
    ])

    if (!omdbResponse.ok) {
      console.error('OMDB API Error:', await omdbResponse.text())
      throw new Error('Failed to fetch movie data')
    }

    const movieData = await omdbResponse.json()
    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    const questionData = JSON.parse(content.text)
    const response = NextResponse.json({
      ...questionData,
      id: Math.random().toString(36).substring(7),
      posterUrl: movieData.Poster,
      director: movieData.Director,
      difficulty: 'medium'
    })

    // Add caching headers
    response.headers.set('Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    return response

  } catch (error) {
    console.error('Error generating question:', error)
    return NextResponse.json(
      { error: 'Failed to generate question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 