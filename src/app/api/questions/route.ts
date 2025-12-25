import { NextResponse } from 'next/server'
import type { ContentType, Difficulty } from '@/types/game'

interface QuestionRequest {
  contentTitle: string
  contentType: ContentType
  difficulty?: Difficulty
}

// Generate question for a film
async function generateFilmQuestion(movieTitle: string, difficulty: Difficulty) {
  const [omdbResponse, perplexityResponse] = await Promise.all([
    fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${process.env.OMDB_API_KEY}`),
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

Difficulty level: ${difficulty}
- Easy: Basic plot questions, famous quotes, main characters
- Medium: Supporting characters, specific scenes, production details
- Hard: Obscure facts, behind-the-scenes details, box office numbers, critical reception

Return this exact JSON structure:
{
  "plot": "A 2-3 sentence plot summary capturing the key elements of the story",
  "question": "A ${difficulty} difficulty trivia question about the film",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "The correct answer (must match one of the options exactly)",
  "learning": {
    "didYouKnow": "A fascinating fact about this film that most people don't know",
    "culturalContext": "The cultural significance and historical context of this film in Black cinema",
    "creatorSpotlight": "2-3 sentences about the director - their background and contribution to cinema",
    "awards": ["List of major awards won or nominations"],
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
    throw new Error('Failed to fetch movie data from OMDB')
  }

  if (!perplexityResponse.ok) {
    throw new Error('Failed to generate question from Perplexity')
  }

  const movieData = await omdbResponse.json()
  const perplexityData = await perplexityResponse.json()

  const content = perplexityData.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('No content in Perplexity response')
  }

  let questionData
  try {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim()
    questionData = JSON.parse(jsonStr)
  } catch {
    throw new Error('Invalid JSON response from Perplexity')
  }

  const learning = questionData.learning || {
    didYouKnow: `"${movieTitle}" is a notable film in Black cinema history.`,
    culturalContext: "This film represents an important contribution to Black storytelling.",
    creatorSpotlight: movieData.Director ? `Directed by ${movieData.Director}.` : "",
    awards: movieData.Awards ? [movieData.Awards] : [],
    legacy: "This film continues to influence and inspire audiences today."
  }

  return {
    ...questionData,
    id: Math.random().toString(36).substring(7),
    contentTitle: movieTitle,
    contentType: 'film' as ContentType,
    posterUrl: movieData.Poster !== 'N/A' ? movieData.Poster : null,
    creator: movieData.Director,
    year: movieData.Year,
    difficulty,
    // Legacy fields for backward compatibility
    movieTitle: movieTitle,
    director: movieData.Director,
    learning: {
      ...learning,
      awards: learning.awards?.length > 0 ? learning.awards : (movieData.Awards ? [movieData.Awards] : []),
    }
  }
}

// Generate question for a book
async function generateBookQuestion(bookTitle: string, difficulty: Difficulty) {
  // Fetch book data from Open Library (free, no API key required)
  const openLibraryUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(bookTitle)}&limit=1`

  const [booksResponse, perplexityResponse] = await Promise.all([
    fetch(openLibraryUrl),
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
          content: `For the book "${bookTitle}" by a Black author, provide comprehensive information for a trivia game with educational content.

IMPORTANT: Respond ONLY with valid JSON, no markdown or extra text.

CRITICAL: Do NOT ask questions about who wrote the book - that information is already shown to the player. Focus on plot details, characters, themes, literary techniques, historical context, or interesting trivia.

Difficulty level: ${difficulty}
- Easy: Basic plot questions, main characters, general themes
- Medium: Supporting characters, specific scenes, symbolism
- Hard: Obscure details, publication history, literary analysis, critical reception

Return this exact JSON structure:
{
  "plot": "A 2-3 sentence synopsis capturing the key elements of the story",
  "question": "A ${difficulty} difficulty trivia question about the book",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "The correct answer (must match one of the options exactly)",
  "learning": {
    "didYouKnow": "A fascinating fact about this book that most people don't know",
    "culturalContext": "The cultural significance and historical context of this book in Black literature",
    "creatorSpotlight": "2-3 sentences about the author - their background, other notable works, and contribution to literature",
    "awards": ["List of major awards won - Pulitzer, National Book Award, etc."],
    "legacy": "The lasting impact and legacy of this book on literature and culture"
  }
}`
        }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })
  ])

  let bookData = null
  if (booksResponse.ok) {
    const booksJson = await booksResponse.json()
    const book = booksJson.docs?.[0]
    if (book) {
      // Get cover URL from Open Library
      let coverUrl: string | null = null
      if (book.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      } else if (book.cover_edition_key) {
        coverUrl = `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg`
      }
      bookData = {
        authors: book.author_name,
        publishedDate: book.first_publish_year?.toString(),
        imageLinks: coverUrl ? { thumbnail: coverUrl } : null
      }
    }
  }

  if (!perplexityResponse.ok) {
    throw new Error('Failed to generate question from Perplexity')
  }

  const perplexityData = await perplexityResponse.json()

  const content = perplexityData.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('No content in Perplexity response')
  }

  let questionData
  try {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim()
    questionData = JSON.parse(jsonStr)
  } catch {
    throw new Error('Invalid JSON response from Perplexity')
  }

  // Extract author from Google Books or use Perplexity data
  const author = bookData?.authors?.[0] || null
  const publishedDate = bookData?.publishedDate || null
  const coverUrl = bookData?.imageLinks?.thumbnail?.replace('http:', 'https:') ||
                   bookData?.imageLinks?.smallThumbnail?.replace('http:', 'https:') || null

  const learning = questionData.learning || {
    didYouKnow: `"${bookTitle}" is a notable work in Black literature.`,
    culturalContext: "This book represents an important contribution to Black storytelling.",
    creatorSpotlight: author ? `Written by ${author}.` : "",
    awards: [],
    legacy: "This book continues to influence and inspire readers today."
  }

  return {
    ...questionData,
    id: Math.random().toString(36).substring(7),
    contentTitle: bookTitle,
    contentType: 'book' as ContentType,
    coverUrl,
    posterUrl: coverUrl, // For backward compatibility with existing components
    creator: author,
    year: publishedDate ? publishedDate.split('-')[0] : null,
    difficulty,
    learning
  }
}

export async function POST(request: Request) {
  try {
    const { contentTitle, contentType, difficulty = 'medium' }: QuestionRequest = await request.json()

    if (!contentTitle || !contentType) {
      return NextResponse.json(
        { error: 'Missing contentTitle or contentType' },
        { status: 400 }
      )
    }

    console.log(`Generating ${contentType} question for: ${contentTitle}`)

    let questionData
    if (contentType === 'book') {
      questionData = await generateBookQuestion(contentTitle, difficulty)
    } else {
      questionData = await generateFilmQuestion(contentTitle, difficulty)
    }

    const response = NextResponse.json(questionData)
    response.headers.set('Cache-Control', 'public, max-age=3600')
    return response

  } catch (error) {
    console.error('Error generating question:', error)
    return NextResponse.json(
      { error: 'Failed to generate question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
