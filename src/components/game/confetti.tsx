"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  rotation: number
  size: number
}

interface ConfettiProps {
  isActive: boolean
  type?: 'correct' | 'streak-3' | 'streak-5' | 'streak-7' | 'streak-10'
  onComplete?: () => void
}

const COLORS = {
  gold: ['#F5A623', '#FFD700', '#FFA500', '#DAA520'],
  bronze: ['#CD7F32', '#B87333', '#8B4513', '#A0522D'],
  silver: ['#C0C0C0', '#D3D3D3', '#A9A9A9', '#808080'],
  rainbow: ['#F5A623', '#1E7B46', '#D4683A', '#5C3D2E', '#FFD700', '#32CD32'],
  earth: ['#F5A623', '#1E7B46', '#D4683A', '#5C3D2E'],
}

export function Confetti({ isActive, type = 'correct', onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (!isActive) {
      setPieces([])
      return
    }

    const colorPalette =
      type === 'correct' ? COLORS.gold :
      type === 'streak-3' ? COLORS.bronze :
      type === 'streak-5' ? COLORS.silver :
      type === 'streak-7' ? COLORS.gold :
      type === 'streak-10' ? COLORS.rainbow :
      COLORS.earth

    const pieceCount =
      type === 'correct' ? 30 :
      type === 'streak-3' ? 40 :
      type === 'streak-5' ? 50 :
      type === 'streak-7' ? 60 :
      type === 'streak-10' ? 80 :
      30

    const newPieces: ConfettiPiece[] = Array.from({ length: pieceCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
      size: Math.random() * 8 + 4,
    }))

    setPieces(newPieces)

    const timer = setTimeout(() => {
      setPieces([])
      onComplete?.()
    }, 3000)

    return () => clearTimeout(timer)
  }, [isActive, type, onComplete])

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: '110vh',
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 3,
                delay: piece.delay,
                ease: 'easeIn',
              }}
              style={{
                position: 'absolute',
                width: piece.size,
                height: piece.size * 0.6,
                backgroundColor: piece.color,
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

interface StreakCelebrationProps {
  streak: number
  isVisible: boolean
  onComplete?: () => void
}

export function StreakCelebration({ streak, isVisible, onComplete }: StreakCelebrationProps) {
  const getMessage = () => {
    if (streak >= 10) return { text: 'LEGENDARY!', emoji: '👑' }
    if (streak >= 7) return { text: 'UNSTOPPABLE!', emoji: '🔥' }
    if (streak >= 5) return { text: 'ON FIRE!', emoji: '⚡' }
    if (streak >= 3) return { text: 'NICE STREAK!', emoji: '✨' }
    return null
  }

  const getStreakType = (): ConfettiProps['type'] => {
    if (streak >= 10) return 'streak-10'
    if (streak >= 7) return 'streak-7'
    if (streak >= 5) return 'streak-5'
    if (streak >= 3) return 'streak-3'
    return 'correct'
  }

  const message = getMessage()

  if (!message || !isVisible) return null

  return (
    <>
      <Confetti isActive={isVisible} type={getStreakType()} onComplete={onComplete} />
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2,
                }}
                className="text-6xl mb-4"
              >
                {message.emoji}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`text-4xl md:text-5xl font-display font-bold ${
                  streak >= 10 ? 'text-gradient-gold' :
                  streak >= 7 ? 'text-primary' :
                  streak >= 5 ? 'text-secondary' :
                  'text-accent'
                }`}
                style={{
                  textShadow: streak >= 7
                    ? '0 0 30px hsl(var(--primary) / 0.5)'
                    : undefined
                }}
              >
                {message.text}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground mt-2"
              >
                {streak} in a row!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface ScorePopupProps {
  points: number
  x: number
  y: number
  isVisible: boolean
}

export function ScorePopup({ points, x, y, isVisible }: ScorePopupProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -60, scale: 1.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="fixed pointer-events-none z-50 font-display font-bold text-2xl text-primary"
          style={{ left: x, top: y }}
        >
          +{points}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function GlowBurst({ isActive, type = 'success' }: { isActive: boolean; type?: 'success' | 'error' }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`fixed inset-0 pointer-events-none z-40 ${
            type === 'success'
              ? 'bg-gradient-radial from-success/30 to-transparent'
              : 'bg-gradient-radial from-destructive/30 to-transparent'
          }`}
          style={{
            background: type === 'success'
              ? 'radial-gradient(circle, hsl(var(--success) / 0.4) 0%, transparent 70%)'
              : 'radial-gradient(circle, hsl(var(--destructive) / 0.4) 0%, transparent 70%)',
          }}
        />
      )}
    </AnimatePresence>
  )
}
