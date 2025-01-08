"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'

export default function ProfilePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState(auth.currentUser)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      setCurrentUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      setError('Failed to sign out')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/')
    } catch (error) {
      console.error('Error signing in with Google:', error)
      setError('Failed to sign in with Google')
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || (isSignUp && !username)) {
      setError('Please fill in all fields')
      return
    }

    try {
      let userCredential
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // Set display name for new users
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: username
          })
        }
      } else {
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password)
        } catch (signInError: any) {
          // Handle specific sign-in errors
          if (signInError.code === 'auth/invalid-credential') {
            setError('Invalid email or password. If you haven\'t registered yet, please sign up first.')
          } else if (signInError.code === 'auth/user-not-found') {
            setError('No account found with this email. Please sign up first.')
          } else if (signInError.code === 'auth/wrong-password') {
            setError('Incorrect password. Please try again.')
          } else {
            setError(signInError.message || 'Failed to sign in')
          }
          return
        }
      }
      router.push('/')
    } catch (error: any) {
      console.error('Error with email auth:', error)
      // Handle specific sign-up errors
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in instead.')
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.')
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else {
        setError(error.message || 'Authentication failed')
      }
    }
  }

  const handleGuestSignIn = async () => {
    try {
      if (!username) {
        setError('Please enter a guest name')
        return
      }
      const credential = await signInAnonymously(auth)
      if (credential.user) {
        await updateProfile(credential.user, {
          displayName: username
        })
      }
      router.push('/')
    } catch (error) {
      console.error('Error signing in as guest:', error)
      setError('Failed to sign in as guest')
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="flex items-center justify-center gap-3 text-4xl font-bold">
            {currentUser ? 'Profile' : 'Welcome to Black Film Trivia'}
            <span className="rounded bg-primary/10 px-2 py-1 text-sm font-medium text-primary">BETA</span>
          </h1>
          {!currentUser ? (
            <>
              <p className="mt-2 text-muted-foreground">
                Test your knowledge of films directed by Black filmmakers and movies exploring Black stories and experiences.
                Created by Tarik Moody using Claude AI.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                This game is a learning exercise to build an app using Cursor AI IDE. Questions are generated using Claude Sonnet 3.5, and while most questions and answers are accurate, AI isn't perfect.
              </p>
            </>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <p className="text-lg font-medium">Signed in as:</p>
                <p className="text-muted-foreground">{currentUser.displayName || 'No display name'}</p>
                <p className="text-sm text-muted-foreground">{currentUser.email || 'Guest User'}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full rounded-md border border-destructive bg-destructive/10 px-4 py-2 text-destructive hover:bg-destructive/20"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!currentUser && (
          <div className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border bg-background px-4 py-2"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border bg-background px-4 py-2"
                data-lpignore="true"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border bg-background px-4 py-2"
                data-lpignore="true"
              />
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full rounded-md border bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              Sign in with Google
            </button>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter guest name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border bg-background px-4 py-2"
              />
              <button
                onClick={handleGuestSignIn}
                className="w-full rounded-md border bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
              >
                Play as Guest
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 