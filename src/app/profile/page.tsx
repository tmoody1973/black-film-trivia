"use client"

import { useUser, SignIn, UserProfile } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const userStats = useQuery(api.users.getUserStats, {})
  const userRank = useQuery(api.leaderboard.getUserRank, {})

  if (!isLoaded) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="flex items-center justify-center gap-3 text-4xl font-bold">
              Welcome to Black Cultural Trivia
              <span className="rounded bg-primary/10 px-2 py-1 text-sm font-medium text-primary">BETA</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              Test your knowledge of films directed by Black filmmakers and books by Black authors.
            </p>
          </div>
          <div className="flex justify-center">
            <SignIn />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {user.firstName || user.username || 'Player'}!
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 text-center">
            <p className="text-4xl font-bold text-primary">
              {userStats?.totalGamesPlayed || 0}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Games Played</p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-center">
            <p className="text-4xl font-bold text-primary">
              {userStats?.accuracy || 0}%
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Accuracy</p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-center">
            <p className="text-4xl font-bold text-primary">
              #{userRank?.rank || '-'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Leaderboard Rank
              {userRank?.bestScore !== undefined && (
                <span className="block text-xs">
                  Best Score: {userRank.bestScore}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Recent Games */}
        {userStats?.recentGames && userStats.recentGames.length > 0 && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Recent Games</h2>
            <div className="space-y-2">
              {userStats.recentGames.slice(0, 5).map((game) => (
                <div
                  key={game._id}
                  className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-2"
                >
                  <span className="text-sm">
                    {new Date(game.completedAt).toLocaleDateString()}
                  </span>
                  <span className="font-medium">Score: {game.score}</span>
                  <span className="text-sm text-muted-foreground">
                    Streak: {game.streak}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clerk User Profile for account management */}
        <div className="flex justify-center">
          <UserProfile />
        </div>
      </div>
    </div>
  )
}
