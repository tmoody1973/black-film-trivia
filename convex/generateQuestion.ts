"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

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
  "options": ["A", "B", "C", "D"],
  "answer": "correct option exactly",
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

    // 4. Build response with metadata
    const result = {
      contentTitle: args.contentTitle,
      contentType: args.contentType,
      difficulty: args.difficulty,
      question: questionData.question,
      options: questionData.options,
      answer: questionData.answer,
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

// Fetch book metadata from Google Books
async function fetchBookMetadata(
  title: string
): Promise<{ creator?: string; year?: string; posterUrl?: string; coverUrl?: string }> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}&maxResults=1`
    );
    if (!response.ok) return {};

    const data = await response.json();
    const book = data.items?.[0]?.volumeInfo;
    if (!book) return {};

    const coverUrl =
      book.imageLinks?.thumbnail?.replace("http:", "https:") ||
      book.imageLinks?.smallThumbnail?.replace("http:", "https:");

    return {
      creator: book.authors?.[0],
      year: book.publishedDate?.split("-")[0],
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

        // Save to cache
        await ctx.runMutation(internal.questionCache.saveToCache, {
          contentTitle: content.title,
          contentType: content.type,
          difficulty: args.difficulty,
          question: questionData.question,
          options: questionData.options,
          answer: questionData.answer,
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
