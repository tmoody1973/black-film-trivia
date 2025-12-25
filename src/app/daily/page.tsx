"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import {
  Calendar,
  Flame,
  Trophy,
  Clock,
  Star,
  ChevronRight,
  LogIn,
  Users,
  Target,
  Award
} from "lucide-react"

// Countdown timer component
function CountdownTimer({ targetTime }: { targetTime: number }) {
  const [timeLeft, setTimeLeft] = useState(targetTime)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex items-center gap-2 font-mono text-2xl font-bold">
      <div className="flex flex-col items-center">
        <span className="text-primary">{hours.toString().padStart(2, "0")}</span>
        <span className="text-xs text-muted-foreground">hrs</span>
      </div>
      <span className="text-muted-foreground">:</span>
      <div className="flex flex-col items-center">
        <span className="text-primary">{minutes.toString().padStart(2, "0")}</span>
        <span className="text-xs text-muted-foreground">min</span>
      </div>
      <span className="text-muted-foreground">:</span>
      <div className="flex flex-col items-center">
        <span className="text-primary">{seconds.toString().padStart(2, "0")}</span>
        <span className="text-xs text-muted-foreground">sec</span>
      </div>
    </div>
  )
}

export default function DailyChallengePage() {
  const router = useRouter()
  const { user, isLoaded: isUserLoaded } = useUser()

  // Convex queries
  const todaysChallenge = useQuery(api.dailyChallenge.getTodaysChallenge)
  const hasPlayedToday = useQuery(api.dailyChallenge.hasPlayedToday)
  const userStreak = useQuery(api.dailyChallenge.getUserStreak)
  const countdown = useQuery(api.dailyChallenge.getNextChallengeCountdown)
  const leaderboard = useQuery(api.dailyChallenge.getDailyLeaderboard, { limit: 5 })
  const userAttempt = useQuery(api.dailyChallenge.getUserDailyAttempt, {})

  const handleStartChallenge = () => {
    router.push("/daily/play")
  }

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
            <Calendar className="size-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient-gold">Daily Challenge</h1>
          <p className="text-muted-foreground">
            Sign in to compete in today&apos;s challenge! Same 10 questions for everyone.
            Compare your score on the global leaderboard.
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
            className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl"
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
            className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl"
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
            <Calendar className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">Daily Challenge</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {todaysChallenge ? (
              <>Daily #{todaysChallenge.challengeNumber}</>
            ) : (
              <>Today&apos;s Challenge</>
            )}
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {hasPlayedToday
              ? "You've completed today's challenge! Come back tomorrow for a new one."
              : "Same 10 questions for everyone. One attempt per day. How will you rank?"}
          </p>

          {/* User Stats Card */}
          {userStreak && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-card border border-border mb-8"
            >
              <div className="flex items-center gap-2">
                <Flame className={`size-6 ${userStreak.currentStreak > 0 ? "text-orange-500" : "text-muted-foreground"}`} />
                <div className="text-left">
                  <div className="text-2xl font-bold">{userStreak.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex items-center gap-2">
                <Trophy className="size-6 text-yellow-500" />
                <div className="text-left">
                  <div className="text-2xl font-bold">{userStreak.longestStreak}</div>
                  <div className="text-xs text-muted-foreground">Best Streak</div>
                </div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex items-center gap-2">
                <Star className="size-6 text-primary" />
                <div className="text-left">
                  <div className="text-2xl font-bold">{userStreak.totalDaysPlayed}</div>
                  <div className="text-xs text-muted-foreground">Days Played</div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Challenge Card */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-geometric p-8"
            >
              {hasPlayedToday && userAttempt ? (
                // Already played - show results
                <div className="text-center space-y-6">
                  <div className="size-20 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                    <Award className="size-10 text-success" />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Challenge Complete!</h2>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                      <div className="text-3xl font-bold text-primary">{userAttempt.score}</div>
                      <div className="text-sm text-muted-foreground">Score</div>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                      <div className="text-3xl font-bold text-accent">{userAttempt.correctAnswers}/10</div>
                      <div className="text-sm text-muted-foreground">Correct</div>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                      <div className="text-3xl font-bold text-orange-500">{userAttempt.maxStreak}x</div>
                      <div className="text-sm text-muted-foreground">Best Streak</div>
                    </div>
                  </div>

                  {/* Next challenge countdown */}
                  <div className="pt-6 border-t border-border">
                    <p className="text-muted-foreground mb-4">Next challenge in:</p>
                    {countdown !== undefined && <CountdownTimer targetTime={countdown} />}
                  </div>
                </div>
              ) : (
                // Not played yet - show start button
                <div className="text-center space-y-6">
                  <div className="size-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <Target className="size-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Ready to Test Your Knowledge?</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    10 questions about Black films and literature.
                    Everyone gets the same questions. One attempt only!
                  </p>

                  <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4" />
                      <span>~5 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="size-4" />
                      <span>10 questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-4" />
                      <span>Same for everyone</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleStartChallenge}
                    className="btn-geometric px-12 py-4 text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Today&apos;s Challenge
                    <ChevronRight className="size-5 ml-2 inline" />
                  </motion.button>

                  {/* Countdown */}
                  <div className="pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Resets in:</p>
                    {countdown !== undefined && <CountdownTimer targetTime={countdown} />}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Leaderboard */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-geometric p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Trophy className="size-5 text-yellow-500" />
                  Today&apos;s Leaders
                </h3>
                <button
                  onClick={() => router.push("/daily/leaderboard")}
                  className="text-sm text-primary hover:underline"
                >
                  See All
                </button>
              </div>

              {leaderboard && leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.userId}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg
                        ${index === 0 ? "bg-yellow-500/10 border border-yellow-500/30" : "bg-muted/50"}
                      `}
                    >
                      <div className={`
                        size-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${index === 0 ? "bg-yellow-500 text-yellow-950" : ""}
                        ${index === 1 ? "bg-slate-300 text-slate-800" : ""}
                        ${index === 2 ? "bg-amber-600 text-amber-950" : ""}
                        ${index > 2 ? "bg-muted text-muted-foreground" : ""}
                      `}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{entry.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.correctAnswers}/10 correct
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{entry.score}</p>
                        <p className="text-xs text-muted-foreground">pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No scores yet today. Be the first!
                </p>
              )}
            </motion.div>

            {/* Challenge Stats */}
            {todaysChallenge && todaysChallenge.totalAttempts > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-geometric p-6 mt-6"
              >
                <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Star className="size-5 text-primary" />
                  Today&apos;s Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Players</span>
                    <span className="font-semibold">{todaysChallenge.totalAttempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Score</span>
                    <span className="font-semibold">{Math.round(todaysChallenge.averageScore)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Perfect Scores</span>
                    <span className="font-semibold">{todaysChallenge.perfectScores}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-display font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground">One challenge, one chance, unlimited bragging rights</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            { step: 1, title: "Same Questions", desc: "Everyone gets identical questions", icon: Target },
            { step: 2, title: "One Attempt", desc: "No retries - make it count!", icon: Clock },
            { step: 3, title: "Global Ranking", desc: "Compare with all players", icon: Trophy },
            { step: 4, title: "Build Streaks", desc: "Play daily to maintain streaks", icon: Flame },
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
