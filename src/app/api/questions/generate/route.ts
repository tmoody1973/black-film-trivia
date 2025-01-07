import { NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { movieTitle } = await request.json()
    
    console.log('Generating question for movie:', movieTitle)
    console.log('OMDB API Key:', process.env.OMDB_API_KEY?.slice(0, 4) + '...')
    console.log('Claude API Key:', process.env.CLAUDE_API_KEY?.slice(0, 10) + '...')

    // Get movie poster from OMDB API
    const omdbUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${process.env.OMDB_API_KEY}`
    console.log('OMDB URL:', omdbUrl)
    
    const omdbResponse = await fetch(omdbUrl)
    if (!omdbResponse.ok) {
      console.error('OMDB API Error:', await omdbResponse.text())
      throw new Error('Failed to fetch movie data')
    }
    
    const movieData = await omdbResponse.json()
    console.log('Movie data:', movieData)
    
    const posterUrl = movieData.Poster

    // Generate question using Claude
    const prompt = `Generate a trivia question about Black cinema in JSON format with fields: question, options (array), answer, and movie_title. 
      Use the film "${movieTitle}" and craft a unique and challenging (but not impossibly difficult) question about its plot, characters, director, awards, or an interesting fact, along with four possible answer options including the correct one.`

    console.log('Sending prompt to Claude:', prompt)

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    console.log('Claude response:', content.text)

    const questionData = JSON.parse(content.text)

    return NextResponse.json({
      ...questionData,
      id: Math.random().toString(36).substring(7),
      posterUrl,
      difficulty: 'medium'
    })
  } catch (error) {
    console.error('Error generating question:', error)
    return NextResponse.json(
      { error: 'Failed to generate question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 