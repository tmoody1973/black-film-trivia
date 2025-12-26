"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import {
  Music,
  Trophy,
  Flame,
  Star,
  ChevronRight,
  Lock,
  Award,
  Users,
  LogIn
} from "lucide-react"

// Mastery level config
const MASTERY_CONFIG = {
  novice: { label: "Novice", color: "text-slate-400", icon: Star },
  fan: { label: "Fan", color: "text-blue-400", icon: Flame },
  expert: { label: "Expert", color: "text-purple-400", icon: Award },
  scholar: { label: "Scholar", color: "text-yellow-400", icon: Trophy },
}

export default function MusicPage() {
  const router = useRouter()
  const { user, isLoaded: isUserLoaded } = useUser()

  const genres = useQuery(api.music.getGenres)
  const userStats = useQuery(api.music.getUserMusicStats)

  const handleGenreClick = (genreId: string) => {
    if (!user) return
    router.push(`/music/${genreId}`)
  }

  if (!isUserLoaded || genres === undefined) {
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
          Loading Music Trivia...
        </motion.p>
      </div>
    )
  }

  // Require authentication
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-geometric max-w-md p-8 text-center space-y-6"
        >
          <div className="size-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <Music className="size-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient-gold">Music Trivia</h1>
          <p className="text-muted-foreground">
            Sign in to test your knowledge of Black music legends.
            Master each genre and become a music scholar!
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

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-12">
      {/* Hero Section */}
      <section className="relative px-4 py-12 text-center">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <Music className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">Music Trivia Mode</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Test Your <span className="text-gradient-gold">Black Music Knowledge</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            From Jazz legends to Hip-Hop icons, Afrobeats stars to Soul pioneers.
            Master each genre and become a music scholar.
          </p>

          {/* User Stats */}
          {userStats && userStats.genresPlayed > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-card border border-border"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userStats.genresPlayed}</div>
                <div className="text-xs text-muted-foreground">Genres Explored</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{userStats.genresMastered}</div>
                <div className="text-xs text-muted-foreground">Genres Mastered</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {Math.round(userStats.overallAccuracy * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Genre Cards Grid */}
      <section className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {genres?.map((genre, index) => {
            const progress = genre.progress
            const masteryLevel = progress?.masteryLevel || "novice"
            const masteryConfig = MASTERY_CONFIG[masteryLevel as keyof typeof MASTERY_CONFIG]
            const MasteryIcon = masteryConfig?.icon || Star

            return (
              <motion.div
                key={genre.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleGenreClick(genre.id)}
                className="group relative cursor-pointer"
              >
                <div className={`
                  relative overflow-hidden rounded-2xl border bg-card p-6
                  transition-all duration-300
                  hover:shadow-xl hover:shadow-primary/10
                  hover:border-primary/50
                  ${!user ? 'opacity-60' : ''}
                `}>
                  {/* Gradient Background */}
                  <div className={`
                    absolute inset-0 opacity-10 bg-gradient-to-br ${genre.color}
                    group-hover:opacity-20 transition-opacity
                  `} />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{genre.icon}</span>
                        <div>
                          <h3 className="text-lg font-display font-bold">{genre.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{genre.title}</p>
                        </div>
                      </div>

                      {/* Mastery Badge */}
                      {progress && (
                        <div className={`
                          flex items-center gap-1 px-2 py-1 rounded-full
                          bg-background/80 border
                          ${masteryConfig?.color || 'text-slate-400'}
                        `}>
                          <MasteryIcon className="size-3" />
                          <span className="text-xs font-medium">{masteryConfig?.label}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="size-4" />
                        <span>{genre.totalArtists} Artists</span>
                      </div>
                    </div>

                    {/* Progress Bar (if played) */}
                    {progress && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">
                            {progress.gamesPlayed} games
                          </span>
                          <span className="text-primary font-medium">
                            High: {progress.highScore}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(progress.correctAnswers / Math.max(progress.questionsAnswered, 1)) * 100}%` }}
                            className={`h-full bg-gradient-to-r ${genre.color}`}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Math.round((progress.correctAnswers / Math.max(progress.questionsAnswered, 1)) * 100)}% accuracy
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <span className={`
                        text-sm font-medium
                        ${progress ? 'text-primary' : 'text-muted-foreground'}
                      `}>
                        {progress ? 'Continue' : 'Start'}
                      </span>
                      <ChevronRight className={`
                        size-5 transform transition-transform
                        group-hover:translate-x-1
                        ${progress ? 'text-primary' : 'text-muted-foreground'}
                      `} />
                    </div>
                  </div>

                  {/* Lock overlay for unauthenticated */}
                  {!user && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
                      <Lock className="size-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-display font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground">Master each genre to become a music scholar</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            { step: 1, title: "Choose Genre", desc: "Select a music genre", icon: Music },
            { step: 2, title: "Answer Questions", desc: "10 questions per session", icon: Star },
            { step: 3, title: "Learn History", desc: "Discover musical legacy", icon: Award },
            { step: 4, title: "Earn Mastery", desc: "Unlock genre badges", icon: Trophy },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="size-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="size-6 text-primary" />
              </div>
              <div className="text-sm text-primary font-medium mb-1">Step {item.step}</div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
