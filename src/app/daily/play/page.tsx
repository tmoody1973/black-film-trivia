"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useQuery, useMutation, useAction } from "convex/react"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "../../../../convex/_generated/api"
import { QuestionCard } from "@/components/game/question-card"
import { KnowledgeReveal } from "@/components/game/knowledge-reveal"
import { Confetti } from "@/components/game/confetti"
import { Question, LearningContent } from "@/types/game"
import {
  Trophy,
  Flame,
  Star,
  Calendar,
  LogIn,
  ArrowLeft,
  Share2,
  Medal,
  Home
} from "lucide-react"
import { Id } from "../../../../convex/_generated/dataModel"

export default function DailyPlayPage() {
  const router = useRouter()
  const { user, isLoaded: isUserLoaded } = useUser()

  // Convex queries and mutations
  const todaysChallenge = useQuery(api.dailyChallenge.getTodaysChallenge)
  const hasPlayedToday = useQuery(api.dailyChallenge.hasPlayedToday)
  const startChallenge = useMutation(api.dailyChallenge.startDailyChallenge)
  const submitAnswer = useMutation(api.dailyChallenge.submitDailyAnswer)
  const completeChallenge = useMutation(api.dailyChallenge.completeDailyChallenge)
  const generateQuestionAction = useAction(api.generateQuestion.generateQuestion)

  // Game state
  const [attemptId, setAttemptId] = useState<Id<"daily_attempts"> | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [questionResults, setQuestionResults] = useState<boolean[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showKnowledgeReveal, setShowKnowledgeReveal] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const hasInitialized = useRef(false)

  // Initialize game
  useEffect(() => {
    if (!user || !todaysChallenge || hasPlayedToday || hasInitialized.current) return

    hasInitialized.current = true

    const initGame = async () => {
      try {
        setIsLoading(true)
        const newAttemptId = await startChallenge({})
        setAttemptId(newAttemptId)

        // Generate first question
        if (todaysChallenge.questions.length > 0) {
          const firstQ = todaysChallenge.questions[0]
          await generateQuestion(firstQ.contentTitle, firstQ.contentType)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to start challenge")
      } finally {
        setIsLoading(false)
      }
    }

    initGame()
  }, [user, todaysChallenge, hasPlayedToday])

  const generateQuestion = async (contentTitle: string, contentType: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await generateQuestionAction({
        contentTitle,
        contentType: contentType as "film" | "book",
        difficulty: "medium",
      })

      setCurrentQuestion(data as Question)
    } catch (err) {
      console.error("Error generating question:", err)
      setError(err instanceof Error ? err.message : "Failed to generate question")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = async (isCorrect: boolean) => {
    if (!attemptId || !currentQuestion) return

    setLastAnswerCorrect(isCorrect)
    setQuestionResults((prev) => [...prev, isCorrect])

    // Update local state
    if (isCorrect) {
      setScore((prev) => prev + 10)
      setStreak((prev) => prev + 1)
      setCorrectAnswers((prev) => prev + 1)
      if (streak + 1 > maxStreak) {
        setMaxStreak(streak + 1)
      }
    } else {
      setStreak(0)
    }

    // Submit to Convex
    try {
      await submitAnswer({
        attemptId,
        questionIndex: currentQuestionIndex,
        correct: isCorrect,
      })
    } catch (err) {
      console.error("Error submitting answer:", err)
    }

    // Show knowledge reveal
    setTimeout(() => {
      setShowKnowledgeReveal(true)
    }, 1500)
  }

  const handleContinue = useCallback(async () => {
    setShowKnowledgeReveal(false)

    const nextIndex = currentQuestionIndex + 1

    // Check if game is over (10 questions)
    if (!todaysChallenge || nextIndex >= todaysChallenge.questions.length) {
      // Complete challenge
      try {
        if (attemptId) {
          await completeChallenge({ attemptId })
        }
      } catch (err) {
        console.error("Error completing challenge:", err)
      }

      setIsGameOver(true)
      setShowCelebration(true)
      return
    }

    // Move to next question
    setCurrentQuestionIndex(nextIndex)
    const nextQ = todaysChallenge.questions[nextIndex]
    setTimeout(() => {
      generateQuestion(nextQ.contentTitle, nextQ.contentType)
    }, 300)
  }, [currentQuestionIndex, todaysChallenge, attemptId, completeChallenge])

  // Generate share text
  const getShareText = () => {
    const filmResults = questionResults.slice(0, 5).map((r) => (r ? "✅" : "❌")).join("")
    const bookResults = questionResults.slice(5, 10).map((r) => (r ? "✅" : "❌")).join("")

    return `Black Cultural Trivia Daily #${todaysChallenge?.challengeNumber || "?"}
Score: ${score}/100

Films: ${filmResults}
Books: ${bookResults}

Play at: ${typeof window !== "undefined" ? window.location.origin : ""}/daily`
  }

  const handleShare = async () => {
    const text = getShareText()

    if (navigator.share) {
      try {
        await navigator.share({ text })
      } catch {
        // Fallback to clipboard
        await navigator.clipboard.writeText(text)
        alert("Results copied to clipboard!")
      }
    } else {
      await navigator.clipboard.writeText(text)
      alert("Results copied to clipboard!")
    }
  }

  // Get content helpers
  const getContentTitle = () => currentQuestion?.contentTitle || currentQuestion?.movieTitle || ""
  const getCreator = () => currentQuestion?.creator || currentQuestion?.director || ""
  const getContentType = () => currentQuestion?.contentType || "film"

  const defaultLearning: LearningContent = {
    didYouKnow: `"${getContentTitle()}" is a notable ${getContentType() === "book" ? "work in Black literature" : "film in Black cinema history"}.`,
    culturalContext: `This ${getContentType()} represents an important contribution to Black storytelling.`,
    creatorSpotlight: getCreator()
      ? `${getContentType() === "book" ? "Written" : "Directed"} by ${getCreator()}.`
      : `A talented ${getContentType() === "book" ? "author" : "filmmaker"} brought this vision to life.`,
    awards: [],
    legacy: `This ${getContentType()} continues to influence and inspire audiences today.`,
  }

  // Loading state
  if (!isUserLoaded) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="size-20 rounded-full border-4 border-primary/30 border-t-primary"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground font-display"
        >
          Loading Daily Challenge...
        </motion.p>
      </div>
    )
  }

  // Auth required
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-geometric max-w-md p-8 text-center space-y-6"
        >
          <div className="size-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <LogIn className="size-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient-gold">Sign In Required</h1>
          <p className="text-muted-foreground">
            Sign in to play the Daily Challenge and compete on the leaderboard.
          </p>
          <SignInButton mode="modal">
            <button className="btn-geometric px-8 py-4 text-lg flex items-center justify-center gap-2 w-full">
              <LogIn className="size-5" />
              Sign In to Play
            </button>
          </SignInButton>
        </motion.div>
      </div>
    )
  }

  // Already played today
  if (hasPlayedToday) {
    router.push("/daily")
    return null
  }

  // Loading challenge data
  if (todaysChallenge === undefined) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="size-20 rounded-full border-4 border-primary/30 border-t-primary"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground font-display"
        >
          Loading Daily Challenge...
        </motion.p>
      </div>
    )
  }

  // No challenge available
  if (todaysChallenge === null) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-geometric max-w-md p-8 text-center space-y-6"
        >
          <div className="size-20 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Calendar className="size-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold">No Challenge Available</h1>
          <p className="text-muted-foreground">
            Today&apos;s challenge hasn&apos;t been generated yet. Please check back soon!
          </p>
          <button
            onClick={() => router.push("/daily")}
            className="btn-geometric px-6 py-3"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    )
  }

  // Error state
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
              if (todaysChallenge?.questions[currentQuestionIndex]) {
                const q = todaysChallenge.questions[currentQuestionIndex]
                generateQuestion(q.contentTitle, q.contentType)
              }
            }}
            className="btn-geometric px-6 py-3"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  // Game Over
  if (isGameOver) {
    return (
      <>
        <Confetti isActive={showCelebration} type="streak-10" />
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="card-geometric max-w-lg w-full p-8 text-center space-y-6"
          >
            {/* Challenge badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                <Calendar className="size-4 text-primary" />
                <span className="font-display font-semibold">
                  Daily #{todaysChallenge?.challengeNumber}
                </span>
              </div>
            </motion.div>

            {/* Trophy */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mx-auto"
            >
              <div className="size-24 mx-auto rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg glow-gold">
                <Trophy className="size-12 text-primary-foreground" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-display font-bold text-gradient-gold"
            >
              Challenge Complete!
            </motion.h1>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="size-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Score</span>
                </div>
                <p className="text-3xl font-display font-bold text-primary">{score}</p>
              </div>

              <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Medal className="size-4 text-success" />
                  <span className="text-xs text-muted-foreground">Correct</span>
                </div>
                <p className="text-3xl font-display font-bold text-success">{correctAnswers}/10</p>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Flame className="size-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Streak</span>
                </div>
                <p className="text-3xl font-display font-bold text-accent">{maxStreak}x</p>
              </div>
            </motion.div>

            {/* Results Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="py-4"
            >
              <p className="text-sm text-muted-foreground mb-2">Your Results:</p>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground w-12">Films:</span>
                  <div className="flex gap-1">
                    {questionResults.slice(0, 5).map((correct, i) => (
                      <span key={i} className="text-xl">
                        {correct ? "✅" : "❌"}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground w-12">Books:</span>
                  <div className="flex gap-1">
                    {questionResults.slice(5, 10).map((correct, i) => (
                      <span key={i} className="text-xl">
                        {correct ? "✅" : "❌"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievement message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {score === 100 ? (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Medal className="size-6" />
                  <span className="font-display font-semibold">Perfect Score!</span>
                </div>
              ) : score >= 70 ? (
                <p className="text-muted-foreground">Great job! You know your stuff!</p>
              ) : score >= 50 ? (
                <p className="text-muted-foreground">Good effort! Keep learning!</p>
              ) : (
                <p className="text-muted-foreground">Every question is a chance to learn!</p>
              )}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={handleShare}
                className="flex-1 btn-geometric flex items-center justify-center gap-2 py-4"
              >
                <Share2 className="size-5" />
                Share Results
              </button>
              <button
                onClick={() => router.push("/daily")}
                className="flex-1 px-6 py-4 rounded-lg border-2 border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="size-5" />
                Back to Hub
              </button>
            </motion.div>
          </motion.div>
        </div>
      </>
    )
  }

  // Loading question
  if (!currentQuestion || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="size-20 rounded-full border-4 border-primary/30 border-t-primary"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground font-display"
        >
          Loading question {currentQuestionIndex + 1}...
        </motion.p>
      </div>
    )
  }

  // Main game view
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-6 py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full max-w-4xl items-center justify-between"
      >
        {/* Back button + Daily badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/daily")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
            <Calendar className="size-4 text-primary" />
            <span className="font-display font-semibold text-sm">
              Daily #{todaysChallenge.challengeNumber}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-card border border-border">
            <span className="font-display font-semibold">
              <span className="text-primary">{currentQuestionIndex + 1}</span>
              <span className="text-muted-foreground">/10</span>
            </span>
          </div>
          <div className="hidden sm:flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`size-3 rounded-full ${
                  i < currentQuestionIndex
                    ? questionResults[i]
                      ? "bg-success"
                      : "bg-destructive"
                    : i === currentQuestionIndex
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
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
            <span className="font-display font-semibold text-primary">{score} pts</span>
          </motion.div>

          {streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-accent/10 border border-accent/30"
            >
              <Flame className={`size-4 ${streak >= 5 ? "text-primary animate-streak-fire" : "text-accent"}`} />
              <span className="font-display font-semibold text-accent">{streak}x</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentPoints={10}
          questionNumber={currentQuestionIndex + 1}
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
        correctAnswer={currentQuestion.answer}
        onContinue={handleContinue}
      />
    </div>
  )
}
