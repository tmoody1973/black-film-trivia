"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useGameStore } from '@/store/game'
import { Question } from '@/types/game'
import { Confetti, GlowBurst, ScorePopup, StreakCelebration } from './confetti'

interface QuestionCardProps {
  question: Question
  onAnswer: (isCorrect: boolean, clickPosition?: { x: number; y: number }) => void
  currentPoints: number
  questionNumber: number
}

// Check if the question would be spoiled by showing certain info
const wouldSpoilAnswer = (questionText: string, infoType: 'creator' | 'year' | 'plot') => {
  const lowerQuestion = questionText.toLowerCase()

  if (infoType === 'creator') {
    // Check for both director (film) and author (book) related questions
    return lowerQuestion.includes('direct') ||
           lowerQuestion.includes('who made') ||
           lowerQuestion.includes('filmmaker') ||
           lowerQuestion.includes('helmed') ||
           lowerQuestion.includes('who wrote') ||
           lowerQuestion.includes('author') ||
           lowerQuestion.includes('written by')
  }
  if (infoType === 'year') {
    return lowerQuestion.includes('what year') ||
           lowerQuestion.includes('when was') ||
           lowerQuestion.includes('released in') ||
           lowerQuestion.includes('published in')
  }
  if (infoType === 'plot') {
    // Hide plot if the question asks about specific plot details
    return lowerQuestion.includes('plot') ||
           lowerQuestion.includes('story about') ||
           lowerQuestion.includes('synopsis')
  }
  return false
}

export function QuestionCard({ question, onAnswer, currentPoints, questionNumber }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showGlow, setShowGlow] = useState(false)
  const [glowType, setGlowType] = useState<'success' | 'error'>('success')
  const [scorePopup, setScorePopup] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false })
  const [showStreak, setShowStreak] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const { streak } = useGameStore()
  const cardRef = useRef<HTMLDivElement>(null)

  // Get content-agnostic fields (support both new and legacy field names)
  const contentTitle = question.contentTitle || question.movieTitle || ''
  const creator = question.creator || question.director || ''
  const contentType = question.contentType || 'film'
  const isBook = contentType === 'book'
  const creatorLabel = isBook ? 'Written by' : 'Directed by'
  const posterUrl = question.posterUrl || question.coverUrl

  // Determine what info to hide based on the question
  const hideCreator = wouldSpoilAnswer(question.question, 'creator')
  const hideYear = wouldSpoilAnswer(question.question, 'year')
  const hidePlot = wouldSpoilAnswer(question.question, 'plot')

  const handleAnswer = (answer: string, event: React.MouseEvent) => {
    if (selectedAnswer) return
    setSelectedAnswer(answer)
    const isCorrect = answer === question.answer

    // Get click position for score popup
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    const clickPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top,
    }

    if (isCorrect) {
      setShowConfetti(true)
      setShowGlow(true)
      setGlowType('success')
      setScorePopup({ x: clickPosition.x, y: clickPosition.y, visible: true })

      // Check for streak celebration (streak will be updated after this, so check for 2, 4, 6, 9)
      const newStreak = streak + 1
      if (newStreak >= 3 && (newStreak === 3 || newStreak === 5 || newStreak === 7 || newStreak === 10)) {
        setTimeout(() => setShowStreak(true), 500)
        setTimeout(() => setShowStreak(false), 2500)
      }
    } else {
      setIsShaking(true)
      setShowGlow(true)
      setGlowType('error')
      setTimeout(() => setIsShaking(false), 500)
    }

    setTimeout(() => {
      setShowGlow(false)
      setScorePopup(prev => ({ ...prev, visible: false }))
    }, 600)

    onAnswer(isCorrect, clickPosition)
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  const optionVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        type: 'spring',
        damping: 20,
        stiffness: 200,
      },
    }),
  }

  return (
    <>
      <Confetti isActive={showConfetti} type="correct" onComplete={() => setShowConfetti(false)} />
      <GlowBurst isActive={showGlow} type={glowType} />
      <ScorePopup points={currentPoints} x={scorePopup.x} y={scorePopup.y} isVisible={scorePopup.visible} />
      <StreakCelebration streak={streak + (selectedAnswer === question.answer ? 1 : 0)} isVisible={showStreak} />

      <motion.div
        ref={cardRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`w-full max-w-4xl card-geometric p-6 ${isShaking ? 'shake' : ''}`}
      >
        {/* Kente stripe accent */}
        <div className="absolute top-0 left-0 right-0 h-1 kente-stripe rounded-t-lg" />

        {/* Question number badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="absolute -top-3 -right-3 size-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg shadow-lg"
        >
          {questionNumber}
        </motion.div>

        <div className="flex gap-6">
          {/* Poster/Cover with geometric frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-[180px] flex-shrink-0"
          >
            {posterUrl && !imageError ? (
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-primary via-accent to-secondary rounded-lg blur-sm opacity-40" />
                <div className="relative aspect-[2/3] w-full ring-2 ring-primary/30 rounded-lg overflow-hidden">
                  <Image
                    src={posterUrl}
                    alt={`${isBook ? 'Book cover' : 'Movie poster'} for ${contentTitle}`}
                    fill
                    sizes="(max-width: 180px) 100vw, 180px"
                    className="object-cover"
                    onError={() => setImageError(true)}
                    priority
                  />
                </div>
              </div>
            ) : (
              <div className="aspect-[2/3] w-full flex items-center justify-center rounded-lg bg-muted border-2 border-dashed border-border">
                <p className="text-muted-foreground text-sm text-center px-2">No {isBook ? 'cover' : 'poster'} available</p>
              </div>
            )}
          </motion.div>

          {/* Content info */}
          <div className="flex flex-col flex-grow space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-1"
            >
              <h2 className="text-2xl font-display font-bold text-gradient-gold">{contentTitle}</h2>
              {/* Only show creator/year if they won't spoil the answer */}
              {((!hideCreator && creator) || (!hideYear && question.year)) && (
                <p className="text-sm text-muted-foreground">
                  {!hideCreator && creator && <span>{creatorLabel} {creator}</span>}
                  {!hideCreator && creator && !hideYear && question.year && <span> • </span>}
                  {!hideYear && question.year && <span>{question.year}</span>}
                </p>
              )}
            </motion.div>

            {/* Only show plot if it won't spoil the answer */}
            {question.plot && !hidePlot && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground leading-relaxed text-sm"
              >
                {question.plot}
              </motion.p>
            )}
          </div>
        </div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 space-y-4"
        >
          <h3 className="text-lg font-display font-semibold text-foreground">{question.question}</h3>

          {/* Options with staggered animation */}
          <div className="grid gap-3">
            {question.options.map((option, index) => (
              <motion.button
                key={option}
                custom={index}
                variants={optionVariants}
                initial="hidden"
                animate="visible"
                onClick={(e) => handleAnswer(option, e)}
                disabled={selectedAnswer !== null}
                whileHover={selectedAnswer === null ? { scale: 1.02, x: 5 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                className={`relative w-full rounded-lg border-2 p-4 text-left transition-all duration-300 overflow-hidden
                  ${selectedAnswer === option
                    ? option === question.answer
                      ? 'border-success bg-success/20 glow-success'
                      : 'border-destructive bg-destructive/20 glow-error'
                    : selectedAnswer && option === question.answer
                    ? 'border-success bg-success/20 glow-success'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                  }
                  ${!selectedAnswer ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                {/* Selection ripple effect */}
                {selectedAnswer === option && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`absolute inset-0 rounded-full ${
                      option === question.answer ? 'bg-success' : 'bg-destructive'
                    }`}
                    style={{ transformOrigin: 'center' }}
                  />
                )}

                <span className="relative z-10 flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  <AnimatePresence>
                    {selectedAnswer && option === question.answer && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-success font-semibold flex items-center gap-1"
                      >
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          ✓
                        </motion.span>
                        Correct
                      </motion.span>
                    )}
                    {selectedAnswer === option && option !== question.answer && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-destructive font-semibold"
                      >
                        ✗
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Answer feedback message */}
        <AnimatePresence>
          {selectedAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 20 }}
              className="mt-6 text-center"
            >
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-lg font-display font-semibold"
              >
                {selectedAnswer === question.answer ? (
                  <motion.span
                    animate={{ color: ['hsl(var(--success))', 'hsl(var(--primary))', 'hsl(var(--success))'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="text-2xl">🎉</span>
                    Correct! +{currentPoints} points
                  </motion.span>
                ) : (
                  <span className="text-destructive">
                    The answer was: {question.answer}
                  </span>
                )}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
