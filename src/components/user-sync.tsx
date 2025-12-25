"use client"

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function UserSync() {
  const { user, isLoaded } = useUser()
  const storeUser = useMutation(api.users.store)

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user with Convex when they sign in
      storeUser().catch(console.error)
    }
  }, [isLoaded, user, storeUser])

  return null
}
