"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile
} from 'firebase/auth'

const provider = new GoogleAuthProvider()

export default function ProfilePage() {
  const [user, setUser] = useState(auth.currentUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      router.push('/play')
    } catch (error) {
      console.error('Error with email auth:', error)
      setError(error instanceof Error ? error.message : 'Authentication failed')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider)
      router.push('/play')
    } catch (error) {
      console.error('Error signing in with Google:', error)
      setError(error instanceof Error ? error.message : 'Google authentication failed')
    }
  }

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously(auth)
      router.push('/play')
    } catch (error) {
      console.error('Error signing in anonymously:', error)
      setError(error instanceof Error ? error.message : 'Anonymous authentication failed')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      setError(error instanceof Error ? error.message : 'Sign out failed')
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tighter">Black Film Trivia</h1>
          <p className="text-xl text-muted-foreground">
            Test your knowledge of Black Cinema in this engaging trivia game. Challenge yourself with questions about iconic films, directors, and cultural moments in Black cinema history.
          </p>
          <p className="text-sm text-muted-foreground">
            Created by Tarik Moody • Powered by Claude AI
          </p>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <h2 className="text-2xl font-semibold text-center">Sign In</h2>
          <p className="text-center text-muted-foreground">
            Sign in to save your progress and compete on the leaderboard.
          </p>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'} with Email
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-sm text-muted-foreground hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </form>

          <div className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              Sign in with Google
            </button>
            <button
              onClick={handleAnonymousSignIn}
              className="w-full rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              Continue as Guest
            </button>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName || 'Guest User'}</h1>
            <p className="text-muted-foreground">{user.email || 'Anonymous'}</p>
            <p className="text-sm text-muted-foreground">
              {user.isAnonymous ? 'Playing as guest' : 'Signed in user'}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Sign Out
          </button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Game History</h2>
          <div className="text-center text-muted-foreground">
            Game history feature coming soon!
          </div>
        </div>
      </div>
    </div>
  )
} 