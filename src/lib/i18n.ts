/**
 * Internationalization (i18n) support for multilingual trivia questions
 * Provides framework for translating questions into multiple languages
 */

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'pt' | 'sw' // English, Spanish, French, Portuguese, Swahili

export interface Translation {
  language: SupportedLanguage
  plot: string
  question: string
  options: string[]
  answer: string
  explanation: string
}

export interface MultilingualQuestion {
  id: string
  movieTitle: string
  category: string
  difficulty: string
  translations: Translation[]
  defaultLanguage: SupportedLanguage
}

/**
 * Language metadata
 */
export const LANGUAGES: Record<SupportedLanguage, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  sw: { name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
}

/**
 * Get translation prompt for Claude
 */
export function getTranslationPrompt(
  originalQuestion: any,
  targetLanguage: SupportedLanguage
): string {
  const languageName = LANGUAGES[targetLanguage].nativeName

  return `You are translating a trivia question about Black cinema from English to ${languageName}.

ORIGINAL QUESTION:
Movie: ${originalQuestion.movieTitle}
Plot: ${originalQuestion.plot}
Question: ${originalQuestion.question}
Options: ${JSON.stringify(originalQuestion.options)}
Answer: ${originalQuestion.answer}
Explanation: ${originalQuestion.explanation}

TRANSLATION GUIDELINES:
1. Translate all content to ${languageName} while preserving:
   - Cultural context and significance
   - Technical film terminology accuracy
   - The celebratory tone about Black cinema
   - Names of people, films, and places (keep original, add pronunciation if helpful)

2. Quality standards:
   - Natural, fluent ${languageName}
   - Culturally appropriate phrasing
   - Maintain the same difficulty level
   - Keep the educational value

3. Specific considerations:
   - Film titles: Keep original English title, add ${languageName} title if it exists
   - Awards: Translate award category names
   - Names: Keep original names, may add pronunciation guide
   - Technical terms: Use standard ${languageName} film industry terminology

Format your response as JSON:
{
  "plot": "Translated plot summary",
  "question": "Translated question",
  "options": ["Translated option 1", "Translated option 2", "Translated option 3", "Translated option 4"],
  "answer": "Translated correct answer (must match one option exactly)",
  "explanation": "Translated explanation"
}

Translate now:`
}

/**
 * UI translations for the interface
 */
export const UI_TRANSLATIONS: Record<SupportedLanguage, {
  play: string
  leaderboard: string
  profile: string
  analytics: string
  score: string
  streak: string
  difficulty: {
    easy: string
    medium: string
    hard: string
  }
  categories: {
    plot: string
    creative_team: string
    cultural_impact: string
    behind_scenes: string
    themes: string
  }
}> = {
  en: {
    play: 'Play',
    leaderboard: 'Leaderboard',
    profile: 'Profile',
    analytics: 'Analytics',
    score: 'Score',
    streak: 'Streak',
    difficulty: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    },
    categories: {
      plot: 'Plot & Characters',
      creative_team: 'Creative Team',
      cultural_impact: 'Cultural Impact',
      behind_scenes: 'Behind the Scenes',
      themes: 'Themes & Meaning',
    },
  },
  es: {
    play: 'Jugar',
    leaderboard: 'Tabla de Clasificación',
    profile: 'Perfil',
    analytics: 'Analíticas',
    score: 'Puntuación',
    streak: 'Racha',
    difficulty: {
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
    },
    categories: {
      plot: 'Trama y Personajes',
      creative_team: 'Equipo Creativo',
      cultural_impact: 'Impacto Cultural',
      behind_scenes: 'Detrás de las Cámaras',
      themes: 'Temas y Significado',
    },
  },
  fr: {
    play: 'Jouer',
    leaderboard: 'Classement',
    profile: 'Profil',
    analytics: 'Analytique',
    score: 'Score',
    streak: 'Série',
    difficulty: {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
    },
    categories: {
      plot: 'Intrigue et Personnages',
      creative_team: 'Équipe Créative',
      cultural_impact: 'Impact Culturel',
      behind_scenes: 'Coulisses',
      themes: 'Thèmes et Signification',
    },
  },
  pt: {
    play: 'Jogar',
    leaderboard: 'Classificação',
    profile: 'Perfil',
    analytics: 'Análises',
    score: 'Pontuação',
    streak: 'Sequência',
    difficulty: {
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil',
    },
    categories: {
      plot: 'Enredo e Personagens',
      creative_team: 'Equipe Criativa',
      cultural_impact: 'Impacto Cultural',
      behind_scenes: 'Bastidores',
      themes: 'Temas e Significado',
    },
  },
  sw: {
    play: 'Cheza',
    leaderboard: 'Jedwali la Washindi',
    profile: 'Wasifu',
    analytics: 'Takwimu',
    score: 'Alama',
    streak: 'Mfululizo',
    difficulty: {
      easy: 'Rahisi',
      medium: 'Wastani',
      hard: 'Ngumu',
    },
    categories: {
      plot: 'Mwenendo na Wahusika',
      creative_team: 'Timu ya Ubunifu',
      cultural_impact: 'Athari ya Kitamaduni',
      behind_scenes: 'Nyuma ya Pazia',
      themes: 'Mada na Maana',
    },
  },
}

/**
 * Get UI translation
 */
export function getUITranslation(language: SupportedLanguage = 'en'): typeof UI_TRANSLATIONS['en'] {
  return UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en
}

/**
 * Detect user's preferred language from browser
 */
export function detectLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en'

  const browserLang = navigator.language.split('-')[0] as SupportedLanguage
  return Object.keys(LANGUAGES).includes(browserLang) ? browserLang : 'en'
}
