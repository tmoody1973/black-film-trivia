"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal, api } from "./_generated/api";

// Priority content for overnight pre-generation
const PRIORITY_FILMS = [
  // Tier 1: Most popular
  "Black Panther", "Get Out", "Friday", "Coming to America", "Love & Basketball",
  "The Color Purple", "Moonlight", "12 Years a Slave", "Selma", "Malcolm X",
  "Do the Right Thing", "Boyz n the Hood", "Girls Trip", "Bad Boys", "Creed",
  "Hidden Figures", "Us", "The Hate U Give", "Queen & Slim", "Barbershop",
  // Tier 2: Very popular
  "House Party", "Boomerang", "Set It Off", "Waiting to Exhale", "Soul Food",
  "The Best Man", "Think Like a Man", "Juice", "Menace II Society", "Poetic Justice",
  "Love Jones", "Brown Sugar", "The Wood", "Shaft", "Beverly Hills Cop",
  "Trading Places", "Harlem Nights", "Life", "Nutty Professor", "How High",
  // Tier 3: Modern hits
  "Fences", "Ma Rainey's Black Bottom", "One Night in Miami", "The Woman King",
  "Nope", "American Fiction", "If Beale Street Could Talk", "Harriet", "Just Mercy",
  "Candyman", "White Chicks", "Next Friday", "Bad Boys II", "Ride Along",
];

const PRIORITY_BOOKS = [
  "Beloved", "The Color Purple", "Their Eyes Were Watching God", "Invisible Man",
  "Native Son", "I Know Why the Caged Bird Sings", "The Autobiography of Malcolm X",
  "Between the World and Me", "The Bluest Eye", "Song of Solomon",
  "Americanah", "The Vanishing Half", "Such a Fun Age", "An American Marriage",
  "Homegoing", "The Water Dancer", "The Nickel Boys", "The Hate U Give",
  "Kindred", "Parable of the Sower", "Children of Blood and Bone",
];

// Helper to normalize answer - converts letter answers (A, B, C, D) to full option text
function normalizeAnswer(answer: string, options: string[]): string {
  const trimmedAnswer = answer.trim();

  // Check if it's already a valid option
  if (options.includes(trimmedAnswer)) {
    return trimmedAnswer;
  }

  // Check if it's a letter (A, B, C, D) or "Option A" format
  const letterMatch = trimmedAnswer.match(/^(?:Option\s+)?([A-Da-d])\.?$/i);
  if (letterMatch) {
    const letterIndex = letterMatch[1].toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    if (letterIndex >= 0 && letterIndex < options.length) {
      return options[letterIndex];
    }
  }

  // Try case-insensitive match
  const lowerAnswer = trimmedAnswer.toLowerCase();
  const matchingOption = options.find(
    (opt) => opt.toLowerCase() === lowerAnswer
  );
  if (matchingOption) {
    return matchingOption;
  }

  // Default to first option if nothing matches (shouldn't happen)
  console.warn(
    `Answer "${answer}" doesn't match any option, defaulting to first option`
  );
  return options[0];
}

// Optimized prompt - shorter and more focused for faster response
function getOptimizedPrompt(
  title: string,
  contentType: "film" | "book",
  difficulty: string
): string {
  const isBook = contentType === "book";

  // Different guides for student vs general difficulty
  const difficultyGuide: Record<string, string> = {
    middle_school: "simple questions about main characters, basic plot points, and easy-to-understand themes. Use age-appropriate language for 11-14 year olds",
    high_school: "questions about themes, character motivations, historical context, and cultural significance. Appropriate for 14-18 year olds",
    easy: "basic plot, main characters, famous quotes",
    medium: "supporting characters, specific scenes, themes",
    hard: "obscure details, production facts, critical reception",
  };

  const guide = difficultyGuide[difficulty] || difficultyGuide.medium;
  const isStudent = difficulty === "middle_school" || difficulty === "high_school";

  return `For "${title}" (${isBook ? "book" : "film"}), generate trivia. Respond ONLY with JSON, no markdown.

RULES:
- ${difficulty.toUpperCase().replace("_", " ")} level: ${guide}
- Do NOT ask about ${isBook ? "author" : "director"} or release year
- Focus on plot, characters, themes, cultural impact
${isStudent ? "- Keep language educational and age-appropriate\n- Include learning opportunities in the question" : ""}

JSON format:
{
  "plot": "2 sentence synopsis${isStudent ? " (age-appropriate)" : ""}",
  "question": "trivia question",
  "options": ["Full answer A text", "Full answer B text", "Full answer C text", "Full answer D text"],
  "answer": "The FULL TEXT of the correct option (NOT just a letter A/B/C/D - must be the complete answer text)",
  "learning": {
    "didYouKnow": "interesting fact${isStudent ? " students would find engaging" : ""}",
    "culturalContext": "cultural significance${isStudent ? " explained for young learners" : ""}",
    "creatorSpotlight": "${isBook ? "author" : "director"} bio",
    "awards": ["awards if any"],
    "legacy": "lasting impact"
  }
}`;
}

// Main action to generate question
export const generateQuestion = action({
  args: {
    contentTitle: v.string(),
    contentType: v.union(v.literal("film"), v.literal("book")),
    difficulty: v.union(
      v.literal("middle_school"),
      v.literal("high_school"),
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard")
    ),
  },
  handler: async (ctx, args): Promise<{
    id: string;
    question: string;
    options: string[];
    answer: string;
    contentTitle: string;
    contentType: "film" | "book";
    difficulty: string;
    plot?: string;
    creator?: string;
    year?: string;
    posterUrl?: string;
    coverUrl?: string;
    learning?: {
      didYouKnow: string;
      culturalContext: string;
      creatorSpotlight: string;
      awards?: string[];
      legacy: string;
    };
    fromCache: boolean;
  }> => {
    // 1. Check cache first (instant response!)
    const cached = await ctx.runQuery(internal.questionCache.getCachedQuestion, {
      contentTitle: args.contentTitle,
      contentType: args.contentType,
      difficulty: args.difficulty,
    });

    if (cached) {
      // Increment usage count in background
      await ctx.runMutation(internal.questionCache.incrementUsage, {
        id: cached._id,
      });

      return {
        id: cached._id,
        question: cached.question,
        options: cached.options,
        answer: cached.answer,
        contentTitle: cached.contentTitle,
        contentType: cached.contentType as "film" | "book",
        difficulty: cached.difficulty,
        plot: cached.plot,
        creator: cached.creator,
        year: cached.year,
        posterUrl: cached.posterUrl,
        coverUrl: cached.coverUrl,
        learning: cached.learning,
        fromCache: true,
      };
    }

    // 2. Not cached - generate new question
    const isBook = args.contentType === "book";
    const perplexityKey = process.env.PERPLEXITY_API_KEY;
    const omdbKey = process.env.OMDB_API_KEY;

    if (!perplexityKey) {
      throw new Error("PERPLEXITY_API_KEY not configured");
    }

    // 3. Fetch metadata and generate question in parallel
    const metadataPromise = isBook
      ? fetchBookMetadata(args.contentTitle)
      : fetchFilmMetadata(args.contentTitle, omdbKey);

    const questionPromise = fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${perplexityKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar", // Fast model
        messages: [
          {
            role: "user",
            content: getOptimizedPrompt(args.contentTitle, args.contentType, args.difficulty),
          },
        ],
        max_tokens: 800, // Reduced for speed
        temperature: 0.7,
      }),
    });

    const [metadata, perplexityResponse] = await Promise.all([
      metadataPromise,
      questionPromise,
    ]);

    if (!perplexityResponse.ok) {
      throw new Error("Failed to generate question from Perplexity");
    }

    const perplexityData = await perplexityResponse.json();
    const content = perplexityData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in Perplexity response");
    }

    // Parse JSON response
    let questionData;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      questionData = JSON.parse(jsonStr);
    } catch {
      throw new Error("Invalid JSON response from Perplexity");
    }

    // 4. Normalize the answer to ensure it's the full option text, not just a letter
    const normalizedAnswer = normalizeAnswer(
      questionData.answer,
      questionData.options
    );

    // 5. Build response with metadata
    const result = {
      contentTitle: args.contentTitle,
      contentType: args.contentType,
      difficulty: args.difficulty,
      question: questionData.question,
      options: questionData.options,
      answer: normalizedAnswer,
      plot: questionData.plot,
      creator: metadata.creator,
      year: metadata.year,
      posterUrl: metadata.posterUrl,
      coverUrl: metadata.coverUrl,
      learning: questionData.learning || {
        didYouKnow: `"${args.contentTitle}" is a notable work in Black ${isBook ? "literature" : "cinema"}.`,
        culturalContext: "This work represents an important contribution to Black storytelling.",
        creatorSpotlight: metadata.creator ? `Created by ${metadata.creator}.` : "",
        awards: [],
        legacy: "This work continues to influence and inspire audiences today.",
      },
    };

    // 5. Save to cache for future use
    const cacheId = await ctx.runMutation(internal.questionCache.saveToCache, result);

    return {
      id: cacheId,
      ...result,
      fromCache: false,
    };
  },
});

// Fetch film metadata from OMDB
async function fetchFilmMetadata(
  title: string,
  apiKey?: string
): Promise<{ creator?: string; year?: string; posterUrl?: string; coverUrl?: string }> {
  if (!apiKey) {
    return {};
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`
    );
    if (!response.ok) return {};

    const data = await response.json();
    return {
      creator: data.Director,
      year: data.Year,
      posterUrl: data.Poster !== "N/A" ? data.Poster : undefined,
    };
  } catch {
    return {};
  }
}

// Fetch book metadata from Open Library (free, no API key required)
async function fetchBookMetadata(
  title: string
): Promise<{ creator?: string; year?: string; posterUrl?: string; coverUrl?: string }> {
  try {
    // Search Open Library for the book
    const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`;
    const response = await fetch(searchUrl);
    if (!response.ok) return {};

    const data = await response.json();
    const book = data.docs?.[0];
    if (!book) return {};

    // Get cover URL using the cover ID (L = large, M = medium, S = small)
    let coverUrl: string | undefined;
    if (book.cover_i) {
      coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
    } else if (book.cover_edition_key) {
      coverUrl = `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg`;
    }

    return {
      creator: book.author_name?.[0],
      year: book.first_publish_year?.toString(),
      coverUrl,
      posterUrl: coverUrl, // For compatibility
    };
  } catch {
    return {};
  }
}

// Pre-generate questions for popular content (can be called via cron or manually)
export const preGenerateQuestions = action({
  args: {
    contentList: v.array(
      v.object({
        title: v.string(),
        type: v.union(v.literal("film"), v.literal("book")),
      })
    ),
    difficulty: v.union(
      v.literal("middle_school"),
      v.literal("high_school"),
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard")
    ),
  },
  handler: async (ctx, args) => {
    const results: { title: string; status: "cached" | "generated" | "error" }[] = [];

    for (const content of args.contentList) {
      try {
        // Check if already cached
        const cached = await ctx.runQuery(internal.questionCache.getCachedQuestion, {
          contentTitle: content.title,
          contentType: content.type,
          difficulty: args.difficulty,
        });

        if (cached) {
          results.push({ title: content.title, status: "cached" });
          continue;
        }

        // Generate and cache
        const perplexityKey = process.env.PERPLEXITY_API_KEY;
        const omdbKey = process.env.OMDB_API_KEY;

        if (!perplexityKey) {
          results.push({ title: content.title, status: "error" });
          continue;
        }

        const isBook = content.type === "book";

        // Fetch metadata and generate question
        const [metadata, perplexityResponse] = await Promise.all([
          isBook
            ? fetchBookMetadata(content.title)
            : fetchFilmMetadata(content.title, omdbKey),
          fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${perplexityKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "sonar",
              messages: [
                {
                  role: "user",
                  content: getOptimizedPrompt(content.title, content.type, args.difficulty),
                },
              ],
              max_tokens: 800,
              temperature: 0.7,
            }),
          }),
        ]);

        if (!perplexityResponse.ok) {
          results.push({ title: content.title, status: "error" });
          continue;
        }

        const perplexityData = await perplexityResponse.json();
        const responseContent = perplexityData.choices?.[0]?.message?.content;

        if (!responseContent) {
          results.push({ title: content.title, status: "error" });
          continue;
        }

        let questionData;
        try {
          const jsonMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)```/);
          const jsonStr = jsonMatch ? jsonMatch[1].trim() : responseContent.trim();
          questionData = JSON.parse(jsonStr);
        } catch {
          results.push({ title: content.title, status: "error" });
          continue;
        }

        // Normalize the answer
        const normalizedAnswer = normalizeAnswer(
          questionData.answer,
          questionData.options
        );

        // Save to cache
        await ctx.runMutation(internal.questionCache.saveToCache, {
          contentTitle: content.title,
          contentType: content.type,
          difficulty: args.difficulty,
          question: questionData.question,
          options: questionData.options,
          answer: normalizedAnswer,
          plot: questionData.plot,
          creator: metadata.creator,
          year: metadata.year,
          posterUrl: metadata.posterUrl,
          coverUrl: metadata.coverUrl,
          learning: questionData.learning,
        });

        results.push({ title: content.title, status: "generated" });

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch {
        results.push({ title: content.title, status: "error" });
      }
    }

    return results;
  },
});

// Overnight pre-generation - runs via cron at 3 AM UTC
// Generates questions for priority content across all difficulty levels
export const overnightPregenerate = internalAction({
  args: {},
  handler: async (ctx): Promise<{
    date: string;
    generated: { films: number; books: number };
    cached: { films: number; books: number };
    errors: number;
  }> => {
    const today = new Date();
    const dayOfWeek = today.getUTCDay();
    const difficulties = ["easy", "medium", "hard"] as const;

    const results = {
      date: today.toISOString().split("T")[0],
      generated: { films: 0, books: 0 },
      cached: { films: 0, books: 0 },
      errors: 0,
    };

    // Rotate through content based on day of week
    // Each day generates different subset to spread the load
    const filmStartIndex = (dayOfWeek * 7) % PRIORITY_FILMS.length;
    const bookStartIndex = (dayOfWeek * 3) % PRIORITY_BOOKS.length;

    // Get 7 films and 3 books per day (rotates through full list over time)
    const todaysFilms = [
      ...PRIORITY_FILMS.slice(filmStartIndex, filmStartIndex + 7),
      ...PRIORITY_FILMS.slice(0, Math.max(0, 7 - (PRIORITY_FILMS.length - filmStartIndex))),
    ].slice(0, 7);

    const todaysBooks = [
      ...PRIORITY_BOOKS.slice(bookStartIndex, bookStartIndex + 3),
      ...PRIORITY_BOOKS.slice(0, Math.max(0, 3 - (PRIORITY_BOOKS.length - bookStartIndex))),
    ].slice(0, 3);

    // Generate for each difficulty
    for (const difficulty of difficulties) {
      // Films
      for (const title of todaysFilms) {
        try {
          const cached = await ctx.runQuery(
            internal.questionCache.getCachedQuestion,
            { contentTitle: title, contentType: "film", difficulty }
          );

          if (cached) {
            results.cached.films++;
            continue;
          }

          // Generate using the main action
          await ctx.runAction(api.generateQuestion.generateQuestion, {
            contentTitle: title,
            contentType: "film",
            difficulty,
          });
          results.generated.films++;

          // Delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error generating film "${title}":`, error);
          results.errors++;
        }
      }

      // Books
      for (const title of todaysBooks) {
        try {
          const cached = await ctx.runQuery(
            internal.questionCache.getCachedQuestion,
            { contentTitle: title, contentType: "book", difficulty }
          );

          if (cached) {
            results.cached.books++;
            continue;
          }

          await ctx.runAction(api.generateQuestion.generateQuestion, {
            contentTitle: title,
            contentType: "book",
            difficulty,
          });
          results.generated.books++;

          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error generating book "${title}":`, error);
          results.errors++;
        }
      }
    }

    console.log("Overnight pre-generation complete:", results);
    return results;
  },
});
