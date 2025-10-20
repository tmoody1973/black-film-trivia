import { create } from 'zustand'
import { GameState, Question } from '@/types/game'

interface GameStore extends GameState {
  setCurrentQuestion: (question: Question) => void
  incrementScore: (points: number) => void
  incrementStreak: () => void
  resetStreak: () => void
  incrementQuestionsAnswered: () => void
  setGameOver: (isOver: boolean) => void
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void
  resetGame: () => void
}

const initialState: GameState = {
  currentQuestion: null,
  score: 0,
  streak: 0,
  questionsAnswered: 0,
  isGameOver: false,
  difficulty: 'medium',
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  incrementScore: (points) => set((state) => ({ score: state.score + points })),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
  resetStreak: () => set({ streak: 0 }),
  incrementQuestionsAnswered: () =>
    set((state) => ({ questionsAnswered: state.questionsAnswered + 1 })),
  setGameOver: (isOver) => set({ isGameOver: isOver }),
  setDifficulty: (difficulty) => set({ difficulty }),
  resetGame: () => set({ ...initialState }),
})) 