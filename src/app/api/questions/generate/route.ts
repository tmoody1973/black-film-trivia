import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { movieTitle } = await request.json()

    console.log('Generating question for movie:', movieTitle)

    // Make both API calls in parallel
    const [omdbResponse, perplexityResponse] = await Promise.all([
      // OMDB API call
      fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${process.env.OMDB_API_KEY}`),

      // Perplexity API call (OpenAI-compatible)
      fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{
            role: 'user',
            content: `For the film "${movieTitle}", provide comprehensive information for a trivia game with educational content.

IMPORTANT: Respond ONLY with valid JSON, no markdown or extra text.

CRITICAL: Do NOT ask questions about who directed the film or what year it was released - that information is already shown to the player. Focus on plot details, characters, cast members, behind-the-scenes facts, filming locations, awards, cultural impact, or interesting trivia.

Return this exact JSON structure:
{
  "plot": "A 2-3 sentence plot summary capturing the key elements of the story",
  "question": "A moderately challenging trivia question about the film - focus on plot, characters, cast, filming locations, awards, behind-the-scenes facts, or cultural impact. Do NOT ask about the director or release year.",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "The correct answer (must match one of the options exactly)",
  "movie_title": "${movieTitle}",
  "learning": {
    "didYouKnow": "A fascinating fact about this film that most people don't know - something surprising or interesting about its production, impact, or history",
    "culturalContext": "The cultural significance and historical context of this film - why it matters in Black cinema and culture",
    "creatorSpotlight": "2-3 sentences about the director - their background, other notable works, and contribution to cinema",
    "awards": ["List of major awards won or nominations received"],
    "legacy": "The lasting impact and legacy of this film on cinema and culture"
  }
}`
          }],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      })
    ])

    if (!omdbResponse.ok) {
      console.error('OMDB API Error:', await omdbResponse.text())
      throw new Error('Failed to fetch movie data')
    }

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text()
      console.error('Perplexity API Error:', errorText)
      throw new Error('Failed to generate question from Perplexity')
    }

    const movieData = await omdbResponse.json()
    const perplexityData = await perplexityResponse.json()

    // Extract the content from Perplexity response
    const content = perplexityData.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('No content in Perplexity response')
    }

    // Parse the JSON response, handling potential markdown code blocks
    let questionData
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim()
      questionData = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('Failed to parse Perplexity response:', content)
      throw new Error('Invalid JSON response from Perplexity')
    }

    // Ensure learning content exists with defaults
    const learning = questionData.learning || {
      didYouKnow: `"${movieTitle}" is a notable film in Black cinema history.`,
      culturalContext: "This film represents an important contribution to Black storytelling in cinema.",
      creatorSpotlight: movieData.Director ? `Directed by ${movieData.Director}.` : "Information about the director.",
      awards: movieData.Awards ? [movieData.Awards] : [],
      legacy: "This film continues to influence and inspire audiences today."
    }

    const response = NextResponse.json({
      ...questionData,
      id: Math.random().toString(36).substring(7),
      posterUrl: movieData.Poster !== 'N/A' ? movieData.Poster : null,
      director: movieData.Director,
      year: movieData.Year,
      rated: movieData.Rated,
      runtime: movieData.Runtime,
      genre: movieData.Genre,
      imdbRating: movieData.imdbRating,
      difficulty: 'medium',
      movieTitle: movieTitle,
      learning: {
        ...learning,
        // Supplement with OMDB data if available
        awards: learning.awards?.length > 0 ? learning.awards : (movieData.Awards ? [movieData.Awards] : []),
      }
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
