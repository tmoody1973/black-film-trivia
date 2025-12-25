"use client"

import { useEffect, useState, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation, useAction } from 'convex/react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../../convex/_generated/api'
import { useGameStore } from '@/store/game'
import { QuestionCard } from '@/components/game/question-card'
import { KnowledgeReveal } from '@/components/game/knowledge-reveal'
import { Confetti } from '@/components/game/confetti'
import {
  BLACK_DIRECTED_MOVIES,
  BLACK_AUTHORED_BOOKS,
  THEME_CONTENT_MAP,
  type ContentCategory,
  type Difficulty as DifficultyType,
} from '@/lib/constants'
import { Question, LearningContent, ContentItem, ContentType } from '@/types/game'
import { Trophy, Flame, Star, RotateCcw, Medal } from 'lucide-react'

// Session storage key for tracking asked questions
const SESSION_ASKED_KEY = 'trivia_session_asked'

// Get content pool based on category and theme
function getContentPool(category: ContentCategory, theme: string): ContentItem[] {
  let films: string[] = []
  let books: string[] = []

  if (theme === 'all') {
    films = [...BLACK_DIRECTED_MOVIES]
    books = [...BLACK_AUTHORED_BOOKS]
  } else {
    const themeContent = THEME_CONTENT_MAP[theme]
    if (themeContent) {
      films = themeContent.films || []
      books = themeContent.books || []
    }
  }

  if (category === 'films') {
    return films.map(title => ({ title, type: 'film' as ContentType }))
  }
  if (category === 'books') {
    return books.map(title => ({ title, type: 'book' as ContentType }))
  }
  // mixed
  return [
    ...films.map(title => ({ title, type: 'film' as ContentType })),
    ...books.map(title => ({ title, type: 'book' as ContentType })),
  ]
}

// Inner component that uses useSearchParams
function PlayPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read game config from URL params
  const category = (searchParams.get('category') as ContentCategory) || 'films'
  const theme = searchParams.get('theme') || 'all'
  const difficulty = (searchParams.get('difficulty') as DifficultyType) || 'medium'

  const { user, isLoaded: isUserLoaded } = useUser()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionAskedQuestions, setSessionAskedQuestions] = useState<string[]>([])
  const [nextQuestion, setNextQuestion] = useState<Question | null>(null)
  const [showKnowledgeReveal, setShowKnowledgeReveal] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false)
  const [maxStreak, setMaxStreak] = useState(0)
  const [showGameOverCelebration, setShowGameOverCelebration] = useState(false)
  const [isDataReady, setIsDataReady] = useState(false)
  const hasInitialized = useRef(false)

  // Get the content pool for this game configuration
  const contentPool = getContentPool(category, theme)

  // Convex queries, mutations, and actions
  const askedQuestionsData = useQuery(api.questions.getAskedQuestions)
  const addAskedQuestion = useMutation(api.questions.addAskedQuestion)
  const addScore = useMutation(api.leaderboard.addScore)
  const generateQuestionAction = useAction(api.generateQuestion.generateQuestion)

  const {
    currentQuestion,
    score,
    streak,
    questionsAnswered,
    isGameOver,
    setCurrentQuestion,
    incrementScore,
    incrementStreak,
    resetStreak,
    incrementQuestionsAnswered,
    setGameOver,
    resetGame,
  } = useGameStore()

  // Load session-asked questions from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(SESSION_ASKED_KEY)
      if (stored) {
        try {
          setSessionAskedQuestions(JSON.parse(stored))
        } catch {
          sessionStorage.removeItem(SESSION_ASKED_KEY)
        }
      }
    }
  }, [])

  // Save session-asked questions to sessionStorage
  const addToSessionAsked = useCallback((movieTitle: string) => {
    setSessionAskedQuestions(prev => {
      const updated = [...prev, movieTitle]
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SESSION_ASKED_KEY, JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  // Combine server-side asked questions with session state for comprehensive filtering
  const getAllAskedQuestions = useCallback(() => {
    const serverAsked = askedQuestionsData?.askedQuestions || []
    const combined = [...serverAsked, ...sessionAskedQuestions]
    // Remove duplicates
    return combined.filter((item, index) => combined.indexOf(item) === index)
  }, [askedQuestionsData, sessionAskedQuestions])

  // Track max streak
  useEffect(() => {
    if (streak > maxStreak) {
      setMaxStreak(streak)
    }
  }, [streak, maxStreak])

  useEffect(() => {
    if (isGameOver) {
      setShowGameOverCelebration(true)
      saveScore()
    }
  }, [isGameOver])

  // Mark data as ready once Convex query resolves
  useEffect(() => {
    if (askedQuestionsData !== undefined && isUserLoaded) {
      setIsDataReady(true)
    }
  }, [askedQuestionsData, isUserLoaded])

  // Initialize game once data is ready
  useEffect(() => {
    if (!isDataReady || hasInitialized.current) return

    hasInitialized.current = true
    resetGame()
    setMaxStreak(0)
    generateQuestionWithFilter(getAllAskedQuestions())

    return () => {
      hasInitialized.current = false
    }
  }, [isDataReady])

  const generateQuestionWithFilter = async (excludeList: string[]) => {
    setError(null)
    setIsLoading(true)

    try {
      // Filter out content that has already been asked about
      const availableContent = contentPool.filter(
        item => !excludeList.includes(item.title)
      )

      // If we've asked about all content, clear session and use full pool
      const contentToUse = availableContent.length > 0 ? availableContent : contentPool

      if (availableContent.length === 0) {
        // Clear session storage if we've exhausted all content
        sessionStorage.removeItem(SESSION_ASKED_KEY)
        setSessionAskedQuestions([])
      }

      const selectedContent = contentToUse[Math.floor(Math.random() * contentToUse.length)]

      // Use Convex action instead of API route (no timeout, with caching!)
      const data = await generateQuestionAction({
        contentTitle: selectedContent.title,
        contentType: selectedContent.type,
        difficulty,
      })

      // Log if from cache (for debugging)
      if (data.fromCache) {
        console.log('Question served from cache - instant!')
      }

      // Track asked question in session storage immediately
      addToSessionAsked(selectedContent.title)

      if (!currentQuestion) {
        setCurrentQuestion(data as Question)
      } else {
        setNextQuestion(data as Question)
      }
    } catch (error) {
      console.error('Error generating question:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate question')
    } finally {
      setIsLoading(false)
    }
  }

  // Wrapper function that gets current exclude list
  const generateQuestion = useCallback(() => {
    generateQuestionWithFilter(getAllAskedQuestions())
  }, [getAllAskedQuestions])

  const handleAnswer = async (isCorrect: boolean) => {
    setLastAnswerCorrect(isCorrect)

    if (isCorrect) {
      incrementScore(10)
      incrementStreak()
    } else {
      resetStreak()
    }

    incrementQuestionsAnswered()

    // Track this question in Convex (non-blocking) for logged-in users
    if (user && currentQuestion) {
      const contentId = currentQuestion.contentTitle || currentQuestion.movieTitle || 'unknown'
      const contentType = currentQuestion.contentType || 'film'
      addAskedQuestion({
        contentId,
        contentType,
        difficulty,
        answeredCorrectly: isCorrect,
      }).catch(console.error)
    }

    // Show Knowledge Reveal after a brief delay for answer animation
    setTimeout(() => {
      setShowKnowledgeReveal(true)
    }, 1500)
  }

  const handleContinue = useCallback(() => {
    setShowKnowledgeReveal(false)

    if (questionsAnswered >= 10) {
      setGameOver(true)
      return
    }

    // If we have a preloaded question, use it and generate the next one
    if (nextQuestion) {
      setTimeout(() => {
        setCurrentQuestion(nextQuestion)
        setNextQuestion(null)
        generateQuestionWithFilter(getAllAskedQuestions())
      }, 300)
    } else {
      setTimeout(() => {
        generateQuestionWithFilter(getAllAskedQuestions())
      }, 300)
    }
  }, [questionsAnswered, nextQuestion, setCurrentQuestion, setGameOver, getAllAskedQuestions])

  const saveScore = async () => {
    if (!user) {
      console.log('No user found, redirecting to home')
      return
    }

    try {
      await addScore({
        score,
        streak: maxStreak,
        difficulty,
        category,
      })
      console.log('Score saved successfully')
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const handlePlayAgain = () => {
    resetGame()
    setMaxStreak(0)
    // Clear session asked questions for a fresh start
    setSessionAskedQuestions([])
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_ASKED_KEY)
    }
    setShowGameOverCelebration(false)
    hasInitialized.current = false
    generateQuestionWithFilter([]) // Start fresh with no exclusions
  }

  // Get the content title (supports both new and legacy field names)
  const getContentTitle = () => currentQuestion?.contentTitle || currentQuestion?.movieTitle || ''
  const getCreator = () => currentQuestion?.creator || currentQuestion?.director || ''
  const getContentType = () => currentQuestion?.contentType || 'film'

  // Default learning content if not provided
  const defaultLearning: LearningContent = {
    didYouKnow: `"${getContentTitle()}" is a notable ${getContentType() === 'book' ? 'work in Black literature' : 'film in Black cinema history'}.`,
    culturalContext: `This ${getContentType()} represents an important contribution to Black storytelling.`,
    creatorSpotlight: getCreator()
      ? `${getContentType() === 'book' ? 'Written' : 'Directed'} by ${getCreator()}.`
      : `A talented ${getContentType() === 'book' ? 'author' : 'filmmaker'} brought this vision to life.`,
    awards: [],
    legacy: `This ${getContentType()} continues to influence and inspire audiences today.`
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-geometric max-w-md p-8 text-center space-y-4"
        >
          <div className="size-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
            <span className="text-3xl">😔</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-destructive">Oops!</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => {
              setError(null)
              generateQuestion()
            }}
            className="btn-geometric px-6 py-3"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  if (!isUserLoaded || !currentQuestion || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="size-20 rounded-full border-4 border-primary/30 border-t-primary"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground font-display"
        >
          Loading your trivia adventure...
        </motion.p>
      </div>
    )
  }

  if (isGameOver) {
    return (
      <>
        <Confetti isActive={showGameOverCelebration} type="streak-10" />
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="card-geometric max-w-lg w-full p-8 text-center space-y-6"
          >
            {/* Celebration header */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto"
            >
              <div className="size-24 mx-auto rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg glow-gold">
                <Trophy className="size-12 text-primary-foreground" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-display font-bold text-gradient-gold"
            >
              Game Complete!
            </motion.h1>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="size-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Final Score</span>
                </div>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="text-4xl font-display font-bold text-primary"
                >
                  {score}
                </motion.p>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="size-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Best Streak</span>
                </div>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="text-4xl font-display font-bold text-accent"
                >
                  {maxStreak}x
                </motion.p>
              </div>
            </motion.div>

            {/* Achievement message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="py-4"
            >
              {score === 100 ? (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Medal className="size-6" />
                  <span className="font-display font-semibold">Perfect Score! You are a true connoisseur!</span>
                </div>
              ) : score >= 70 ? (
                <p className="text-muted-foreground">Great job! You really know your Black cinema!</p>
              ) : score >= 50 ? (
                <p className="text-muted-foreground">Good effort! Keep learning and come back stronger!</p>
              ) : (
                <p className="text-muted-foreground">Every question is a chance to learn something new!</p>
              )}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={handlePlayAgain}
                className="flex-1 btn-geometric flex items-center justify-center gap-2 py-4"
              >
                <RotateCcw className="size-5" />
                Play Again
              </button>
              <button
                onClick={() => router.push('/leaderboard')}
                className="flex-1 px-6 py-4 rounded-lg border-2 border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <Trophy className="size-5" />
                Leaderboard
              </button>
            </motion.div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-6 py-8 px-4">
      {/* Score header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full max-w-4xl items-center justify-between"
      >
        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-card border border-border">
            <span className="font-display font-semibold">
              <span className="text-primary">{questionsAnswered + 1}</span>
              <span className="text-muted-foreground">/10</span>
            </span>
          </div>
          {/* Progress bar */}
          <div className="hidden sm:block w-32 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((questionsAnswered) / 10) * 100}%` }}
              className="h-full bg-gradient-to-r from-primary to-accent"
              transition={{ type: 'spring', damping: 20 }}
            />
          </div>
        </div>

        {/* Score and streak */}
        <div className="flex items-center gap-4">
          <motion.div
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
          >
            <span className="font-display font-semibold text-primary">
              {score} pts
            </span>
          </motion.div>

          {streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-accent/10 border border-accent/30"
            >
              <Flame className={`size-4 ${streak >= 5 ? 'text-primary animate-streak-fire' : 'text-accent'}`} />
              <span className="font-display font-semibold text-accent">
                {streak}x
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Question card with AnimatePresence for transitions */}
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentPoints={10}
          questionNumber={questionsAnswered + 1}
        />
      </AnimatePresence>

      {/* Knowledge Reveal */}
      <KnowledgeReveal
        isVisible={showKnowledgeReveal}
        contentTitle={getContentTitle()}
        contentType={getContentType()}
        posterUrl={currentQuestion.posterUrl || currentQuestion.coverUrl}
        creator={getCreator()}
        year={currentQuestion.year}
        learning={currentQuestion.learning || defaultLearning}
        wasCorrect={lastAnswerCorrect}
        onContinue={handleContinue}
      />
    </div>
  )
}

// Main export with Suspense for useSearchParams
export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="size-20 rounded-full border-4 border-primary/30 border-t-primary"
        />
        <p className="text-muted-foreground font-display">
          Loading your trivia adventure...
        </p>
      </div>
    }>
      <PlayPageContent />
    </Suspense>
  )
}
