"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
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
  RotateCcw,
  Medal,
  LogIn,
  Clock,
  ArrowLeft,
  Award
} from "lucide-react"
import { Id } from "../../../../convex/_generated/dataModel"

// Mastery level config
const MASTERY_CONFIG = {
  novice: { label: "Novice", color: "text-slate-400", bgColor: "bg-slate-400/10", borderColor: "border-slate-400/30" },
  fan: { label: "Fan", color: "text-blue-400", bgColor: "bg-blue-400/10", borderColor: "border-blue-400/30" },
  expert: { label: "Expert", color: "text-purple-400", bgColor: "bg-purple-400/10", borderColor: "border-purple-400/30" },
  scholar: { label: "Scholar", color: "text-yellow-400", bgColor: "bg-yellow-400/10", borderColor: "border-yellow-400/30" },
}

export default function EraPlayPage() {
  const params = useParams()
  const router = useRouter()
  const eraId = params.era as string

  const { user, isLoaded: isUserLoaded } = useUser()

  // Convex queries and mutations
  const eraDetails = useQuery(api.timeMachine.getEraDetails, { eraId })
  const eraQuestions = useQuery(api.timeMachine.getEraQuestions, { eraId, count: 10 })
  const startSession = useMutation(api.timeMachine.startEraSession)
  const submitAnswer = useMutation(api.timeMachine.submitEraAnswer)
  const completeSession = useMutation(api.timeMachine.completeEraSession)
  const generateQuestionAction = useAction(api.generateQuestion.generateQuestion)

  // Game state
  const [sessionId, setSessionId] = useState<Id<"era_sessions"> | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionQueue, setQuestionQueue] = useState<Array<{ contentTitle: string; contentType: string }>>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showKnowledgeReveal, setShowKnowledgeReveal] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [finalMastery, setFinalMastery] = useState<string | null>(null)

  const hasInitialized = useRef(false)

  // Initialize game session
  useEffect(() => {
    if (!user || !eraQuestions || hasInitialized.current) return

    hasInitialized.current = true

    const initGame = async () => {
      try {
        setIsLoading(true)
        const newSessionId = await startSession({ eraId })
        setSessionId(newSessionId)
        setQuestionQueue(eraQuestions)

        // Generate first question
        if (eraQuestions.length > 0) {
          await generateQuestion(eraQuestions[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to start session")
      } finally {
        setIsLoading(false)
      }
    }

    initGame()
  }, [user, eraQuestions, eraId])

  const generateQuestion = async (content: { contentTitle: string; contentType: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await generateQuestionAction({
        contentTitle: content.contentTitle,
        contentType: content.contentType as "film" | "book",
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
    if (!sessionId || !currentQuestion) return

    setLastAnswerCorrect(isCorrect)

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
        sessionId,
        contentTitle: currentQuestion.contentTitle || currentQuestion.movieTitle || "",
        contentType: currentQuestion.contentType || "film",
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
    if (nextIndex >= 10 || nextIndex >= questionQueue.length) {
      // Complete session
      try {
        if (sessionId) {
          const completedSession = await completeSession({ sessionId })
          // Get updated progress for mastery level
          if (eraDetails?.progress) {
            const accuracy = (correctAnswers + (lastAnswerCorrect ? 0 : 0)) / 10
            let mastery = "novice"
            if (accuracy >= 0.9) mastery = "scholar"
            else if (accuracy >= 0.75) mastery = "expert"
            else if (accuracy >= 0.5) mastery = "fan"
            setFinalMastery(mastery)
          }
        }
      } catch (err) {
        console.error("Error completing session:", err)
      }

      setIsGameOver(true)
      setShowCelebration(true)
      return
    }

    // Move to next question
    setCurrentQuestionIndex(nextIndex)
    setTimeout(() => {
      generateQuestion(questionQueue[nextIndex])
    }, 300)
  }, [currentQuestionIndex, questionQueue, sessionId, completeSession, lastAnswerCorrect, correctAnswers, eraDetails])

  const handlePlayAgain = async () => {
    // Reset state
    hasInitialized.current = false
    setSessionId(null)
    setCurrentQuestion(null)
    setCurrentQuestionIndex(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setCorrectAnswers(0)
    setIsGameOver(false)
    setShowCelebration(false)
    setFinalMastery(null)

    // Re-initialize
    if (user && eraQuestions) {
      try {
        setIsLoading(true)
        const newSessionId = await startSession({ eraId })
        setSessionId(newSessionId)

        // Shuffle questions for variety
        const shuffled = [...eraQuestions].sort(() => Math.random() - 0.5)
        setQuestionQueue(shuffled)

        if (shuffled.length > 0) {
          await generateQuestion(shuffled[0])
        }
        hasInitialized.current = true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to start session")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Get content helpers
  const getContentTitle = () => currentQuestion?.contentTitle || currentQuestion?.movieTitle || ""
  const getCreator = () => currentQuestion?.creator || currentQuestion?.director || ""
  const getContentType = () => currentQuestion?.contentType || "film"

  const defaultLearning: LearningContent = {
    didYouKnow: `"${getContentTitle()}" is a notable ${getContentType() === "book" ? "work in Black literature" : "film in Black cinema history"}.`,
    culturalContext: `This ${getContentType()} represents an important contribution to Black storytelling in the ${eraDetails?.name || ""} era.`,
    creatorSpotlight: getCreator()
      ? `${getContentType() === "book" ? "Written" : "Directed"} by ${getCreator()}.`
      : `A talented ${getContentType() === "book" ? "author" : "filmmaker"} brought this vision to life.`,
    awards: [],
    legacy: `This ${getContentType()} continues to influence and inspire audiences today.`,
  }

  // Loading state
  if (!isUserLoaded || !eraDetails) {
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
          Loading {eraId} era...
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
            Sign in to play Time Machine mode and track your progress through the {eraDetails.name} era.
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
              if (questionQueue[currentQuestionIndex]) {
                generateQuestion(questionQueue[currentQuestionIndex])
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
    const masteryConfig = finalMastery
      ? MASTERY_CONFIG[finalMastery as keyof typeof MASTERY_CONFIG]
      : MASTERY_CONFIG.novice

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
            {/* Era badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                <span className="text-2xl">{eraDetails.icon}</span>
                <span className="font-display font-semibold">{eraDetails.name}</span>
              </div>
            </motion.div>

            {/* Trophy */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mx-auto"
            >
              <div className={`
                size-24 mx-auto rounded-full flex items-center justify-center shadow-lg
                bg-gradient-to-br ${eraDetails.color}
              `}>
                <Trophy className="size-12 text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-display font-bold text-gradient-gold"
            >
              Era Complete!
            </motion.h1>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="size-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Score</span>
                </div>
                <p className="text-4xl font-display font-bold text-primary">{score}</p>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="size-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Best Streak</span>
                </div>
                <p className="text-4xl font-display font-bold text-accent">{maxStreak}x</p>
              </div>
            </motion.div>

            {/* Mastery Badge */}
            {finalMastery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full
                  ${masteryConfig.bgColor} border ${masteryConfig.borderColor}
                `}
              >
                <Award className={`size-5 ${masteryConfig.color}`} />
                <span className={`font-medium ${masteryConfig.color}`}>
                  {masteryConfig.label} Status
                </span>
              </motion.div>
            )}

            {/* Achievement message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {score === 100 ? (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Medal className="size-6" />
                  <span className="font-display font-semibold">
                    Perfect! You&apos;ve mastered the {eraDetails.name}!
                  </span>
                </div>
              ) : score >= 70 ? (
                <p className="text-muted-foreground">
                  Excellent knowledge of {eraDetails.name} culture!
                </p>
              ) : score >= 50 ? (
                <p className="text-muted-foreground">
                  Good start! Keep exploring the {eraDetails.name}.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Every question teaches something new about this era!
                </p>
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
                onClick={handlePlayAgain}
                className="flex-1 btn-geometric flex items-center justify-center gap-2 py-4"
              >
                <RotateCcw className="size-5" />
                Play Again
              </button>
              <button
                onClick={() => router.push("/time-machine")}
                className="flex-1 px-6 py-4 rounded-lg border-2 border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <Clock className="size-5" />
                Choose Era
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
          Loading {eraDetails.name} trivia...
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
        {/* Back button + Era badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/time-machine")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
            <span className="text-lg">{eraDetails.icon}</span>
            <span className="font-display font-semibold text-sm">{eraDetails.name}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-card border border-border">
            <span className="font-display font-semibold">
              <span className="text-primary">{currentQuestionIndex + 1}</span>
              <span className="text-muted-foreground">/10</span>
            </span>
          </div>
          <div className="hidden sm:block w-24 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentQuestionIndex / 10) * 100}%` }}
              className={`h-full bg-gradient-to-r ${eraDetails.color}`}
              transition={{ type: "spring", damping: 20 }}
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
