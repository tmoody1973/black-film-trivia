"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Check, Loader2 } from "lucide-react"
import { api } from "../../../convex/_generated/api"
import type { ContentType } from "@/types/game"

interface SaveToLibraryButtonProps {
  contentTitle: string
  contentType: ContentType
  creator?: string
  year?: string
  posterUrl?: string | null
  variant?: "default" | "compact"
}

export function SaveToLibraryButton({
  contentTitle,
  contentType,
  creator,
  year,
  posterUrl,
  variant = "default",
}: SaveToLibraryButtonProps) {
  const { user } = useUser()
  const [showSaved, setShowSaved] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const isInLibrary = useQuery(
    api.userLibrary.isInLibrary,
    user ? { contentTitle } : "skip"
  )
  const addToLibrary = useMutation(api.userLibrary.addToLibrary)
  const removeFromLibrary = useMutation(api.userLibrary.removeFromLibrary)

  const handleToggle = async () => {
    if (!user || isProcessing) return

    setIsProcessing(true)
    try {
      if (isInLibrary) {
        await removeFromLibrary({ contentTitle })
      } else {
        await addToLibrary({
          contentTitle,
          contentType,
          creator,
          year,
          posterUrl: posterUrl || undefined,
        })
        setShowSaved(true)
        setTimeout(() => setShowSaved(false), 2000)
      }
    } catch (error) {
      console.error("Error toggling library:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Don't show if not authenticated
  if (!user) return null

  // Loading state
  if (isInLibrary === undefined) {
    return (
      <div className={`flex items-center gap-2 ${variant === "compact" ? "p-2" : "px-4 py-2"}`}>
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        disabled={isProcessing}
        className={`p-2 rounded-full transition-colors ${
          isInLibrary
            ? "bg-primary/20 text-primary"
            : "bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary"
        }`}
        title={isInLibrary ? "Remove from Library" : "Save to Library"}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Loader2 className="size-5 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="heart"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Heart
                className={`size-5 ${isInLibrary ? "fill-current" : ""}`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    )
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleToggle}
        disabled={isProcessing}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isInLibrary
            ? "bg-primary/20 text-primary border border-primary/30"
            : "bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border"
        }`}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="size-4 animate-spin" />
            </motion.div>
          ) : isInLibrary ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Heart className="size-4 fill-current" />
              <span>Saved</span>
            </motion.div>
          ) : (
            <motion.div
              key="save"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Heart className="size-4" />
              <span>Save</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Success toast */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-success text-success-foreground text-sm font-medium shadow-lg flex items-center gap-1.5 whitespace-nowrap"
          >
            <Check className="size-3" />
            Added to Library!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
