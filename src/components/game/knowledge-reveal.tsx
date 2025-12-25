"use client"

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Sparkles, Award, BookOpen, User, Star } from 'lucide-react'
import type { ContentType } from '@/types/game'
import { SaveToLibraryButton } from './save-to-library-button'
import { PurchaseLinks } from './purchase-links'

interface LearningContent {
  didYouKnow: string
  culturalContext: string
  creatorSpotlight: string
  awards?: string[]
  legacy: string
}

interface KnowledgeRevealProps {
  isVisible: boolean
  contentTitle: string
  contentType?: ContentType
  posterUrl?: string | null
  creator?: string
  year?: string
  learning: LearningContent
  wasCorrect: boolean
  correctAnswer?: string
  onContinue: () => void
}

export function KnowledgeReveal({
  isVisible,
  contentTitle,
  contentType = 'film',
  posterUrl,
  creator,
  year,
  learning,
  wasCorrect,
  correctAnswer,
  onContinue,
}: KnowledgeRevealProps) {
  const isBook = contentType === 'book'
  const creatorLabel = isBook ? 'Written by' : 'Directed by'
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        >
          {/* Main Content Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Kente stripe accent at top */}
            <div className="h-2 kente-stripe rounded-t-lg" />

            {/* Card content */}
            <div className="card-geometric rounded-t-none p-6 space-y-6">
              {/* Header with movie info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-6"
              >
                {/* Poster/Cover */}
                {posterUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="relative shrink-0"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-primary via-accent to-secondary rounded-lg blur-sm opacity-50" />
                    <Image
                      src={posterUrl}
                      alt={contentTitle}
                      width={120}
                      height={180}
                      className="relative rounded-lg object-cover ring-2 ring-primary/30"
                    />
                  </motion.div>
                )}

                {/* Title and basic info */}
                <div className="flex-1 space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      wasCorrect
                        ? 'bg-success/20 text-success'
                        : 'bg-accent/20 text-accent'
                    }`}
                  >
                    {wasCorrect ? (
                      <>
                        <Sparkles className="size-4" />
                        Correct!
                      </>
                    ) : (
                      <>
                        <BookOpen className="size-4" />
                        Learn More
                      </>
                    )}
                  </motion.div>

                  {/* Show correct answer for wrong answers - more prominent */}
                  {!wasCorrect && correctAnswer && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="mt-4 p-4 rounded-lg bg-destructive/15 border-2 border-destructive/40"
                    >
                      <p className="text-sm text-destructive/80 font-medium mb-1">The correct answer was:</p>
                      <p className="font-display font-bold text-xl text-destructive">{correctAnswer}</p>
                    </motion.div>
                  )}

                  <motion.h2
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-display font-bold text-gradient-gold"
                  >
                    {contentTitle}
                  </motion.h2>

                  {(creator || year) && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-muted-foreground"
                    >
                      {creator && <span>{creatorLabel} {creator}</span>}
                      {creator && year && <span> • </span>}
                      {year && <span>{year}</span>}
                    </motion.p>
                  )}

                  {/* Save to Library button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-2"
                  >
                    <SaveToLibraryButton
                      contentTitle={contentTitle}
                      contentType={contentType}
                      creator={creator}
                      year={year}
                      posterUrl={posterUrl}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Did You Know section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="size-5" />
                  <h3 className="font-display font-semibold text-lg">Did You Know?</h3>
                </div>
                <p className="text-foreground/90 leading-relaxed pl-7">
                  {learning.didYouKnow}
                </p>
              </motion.div>

              {/* Cultural Context */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-secondary">
                  <BookOpen className="size-5" />
                  <h3 className="font-display font-semibold text-lg">Cultural Significance</h3>
                </div>
                <p className="text-foreground/90 leading-relaxed pl-7">
                  {learning.culturalContext}
                </p>
              </motion.div>

              {/* Creator Spotlight */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-accent">
                  <User className="size-5" />
                  <h3 className="font-display font-semibold text-lg">Creator Spotlight</h3>
                </div>
                <p className="text-foreground/90 leading-relaxed pl-7">
                  {learning.creatorSpotlight}
                </p>
              </motion.div>

              {/* Awards */}
              {learning.awards && learning.awards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <Award className="size-5" />
                    <h3 className="font-display font-semibold text-lg">Awards & Recognition</h3>
                  </div>
                  <div className="pl-7 flex flex-wrap gap-2">
                    {learning.awards.map((award, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        <Star className="size-3" />
                        {award}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Legacy */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-tertiary">
                  <Star className="size-5" />
                  <h3 className="font-display font-semibold text-lg">Legacy & Impact</h3>
                </div>
                <p className="text-foreground/90 leading-relaxed pl-7">
                  {learning.legacy}
                </p>
              </motion.div>

              {/* Purchase Links */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95 }}
              >
                <PurchaseLinks
                  contentTitle={contentTitle}
                  contentType={contentType}
                  creator={creator}
                />
              </motion.div>

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="pt-4"
              >
                <button
                  onClick={onContinue}
                  className="w-full btn-geometric pulse-glow text-lg py-4"
                >
                  Continue
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
