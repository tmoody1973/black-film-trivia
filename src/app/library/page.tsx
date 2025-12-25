"use client"

import { useState } from "react"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { api } from "../../../convex/_generated/api"
import {
  Film,
  BookOpen,
  Heart,
  Trash2,
  Check,
  Eye,
  BookMarked,
  LogIn,
  ArrowLeft,
  Filter,
  Loader2,
} from "lucide-react"

type FilterType = "all" | "film" | "book"
type StatusFilter = "all" | "want_to_watch" | "watched" | "want_to_read" | "read"

export default function LibraryPage() {
  const { user, isLoaded } = useUser()
  const [contentFilter, setContentFilter] = useState<FilterType>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const library = useQuery(
    api.userLibrary.getLibrary,
    user
      ? contentFilter === "all"
        ? {}
        : { contentType: contentFilter }
      : "skip"
  )
  const libraryStats = useQuery(
    api.userLibrary.getLibraryStats,
    user ? {} : "skip"
  )
  const removeFromLibrary = useMutation(api.userLibrary.removeFromLibrary)
  const updateStatus = useMutation(api.userLibrary.updateStatus)

  const handleRemove = async (contentTitle: string) => {
    if (confirm("Remove this item from your library?")) {
      await removeFromLibrary({ contentTitle })
    }
  }

  const handleStatusChange = async (contentTitle: string, newStatus: string) => {
    await updateStatus({ contentTitle, status: newStatus })
  }

  // Filter by status
  const filteredLibrary = library?.filter((item) => {
    if (statusFilter === "all") return true
    return item.status === statusFilter
  })

  if (!isLoaded) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-geometric max-w-md p-8 text-center space-y-6"
        >
          <div className="size-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <LogIn className="size-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient-gold">
            Sign In Required
          </h1>
          <p className="text-muted-foreground">
            Sign in to view and manage your saved films and books.
          </p>
          <SignInButton mode="modal">
            <button className="btn-geometric px-8 py-4 text-lg flex items-center justify-center gap-2 w-full">
              <LogIn className="size-5" />
              Sign In
            </button>
          </SignInButton>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link
          href="/"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient-gold">
            My Library
          </h1>
          <p className="text-muted-foreground">
            Your saved films and books to explore
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      {libraryStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="card-geometric p-4 text-center">
            <Heart className="size-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-display font-bold text-primary">
              {libraryStats.totalItems}
            </p>
            <p className="text-xs text-muted-foreground">Total Saved</p>
          </div>
          <div className="card-geometric p-4 text-center">
            <Film className="size-6 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-display font-bold text-accent">
              {libraryStats.films.watched}/{libraryStats.films.total}
            </p>
            <p className="text-xs text-muted-foreground">Films Watched</p>
          </div>
          <div className="card-geometric p-4 text-center">
            <BookOpen className="size-6 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-display font-bold text-secondary">
              {libraryStats.books.read}/{libraryStats.books.total}
            </p>
            <p className="text-xs text-muted-foreground">Books Read</p>
          </div>
          <div className="card-geometric p-4 text-center">
            <BookMarked className="size-6 mx-auto mb-2 text-tertiary" />
            <p className="text-2xl font-display font-bold text-tertiary">
              {libraryStats.films.wantToWatch + libraryStats.books.wantToRead}
            </p>
            <p className="text-xs text-muted-foreground">To Explore</p>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 items-center"
      >
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
        </div>

        {/* Content type filter */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["all", "film", "book"] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setContentFilter(filter)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                contentFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {filter === "all" ? "All" : filter === "film" ? "Films" : "Books"}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            All
          </button>
          {contentFilter !== "book" && (
            <>
              <button
                onClick={() => setStatusFilter("want_to_watch")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === "want_to_watch"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Want to Watch
              </button>
              <button
                onClick={() => setStatusFilter("watched")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === "watched"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Watched
              </button>
            </>
          )}
          {contentFilter !== "film" && (
            <>
              <button
                onClick={() => setStatusFilter("want_to_read")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === "want_to_read"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Want to Read
              </button>
              <button
                onClick={() => setStatusFilter("read")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === "read"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Read
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Library items */}
      {library === undefined ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : filteredLibrary?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Heart className="size-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-display font-semibold mb-2">
            No items yet
          </h2>
          <p className="text-muted-foreground mb-6">
            {contentFilter === "all"
              ? "Start playing trivia to discover films and books to save!"
              : contentFilter === "film"
              ? "No films saved yet. Play trivia to discover some!"
              : "No books saved yet. Play trivia to discover some!"}
          </p>
          <Link href="/play" className="btn-geometric px-6 py-3">
            Start Playing
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredLibrary?.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="card-geometric p-4 space-y-3"
              >
                <div className="flex gap-4">
                  {/* Poster/Cover */}
                  {item.posterUrl ? (
                    <div className="relative shrink-0 w-20 h-28 rounded-lg overflow-hidden">
                      <Image
                        src={item.posterUrl}
                        alt={item.contentTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="shrink-0 w-20 h-28 rounded-lg bg-muted flex items-center justify-center">
                      {item.contentType === "book" ? (
                        <BookOpen className="size-8 text-muted-foreground" />
                      ) : (
                        <Film className="size-8 text-muted-foreground" />
                      )}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-semibold truncate">
                        {item.contentTitle}
                      </h3>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                          item.contentType === "book"
                            ? "bg-secondary/20 text-secondary"
                            : "bg-accent/20 text-accent"
                        }`}
                      >
                        {item.contentType === "book" ? "Book" : "Film"}
                      </span>
                    </div>
                    {item.creator && (
                      <p className="text-sm text-muted-foreground truncate">
                        {item.contentType === "book" ? "by" : "dir."}{" "}
                        {item.creator}
                      </p>
                    )}
                    {item.year && (
                      <p className="text-xs text-muted-foreground">
                        {item.year}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status and actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  {/* Status selector */}
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item.contentTitle, e.target.value)
                    }
                    className="text-sm bg-muted rounded-lg px-3 py-1.5 border-none focus:ring-2 focus:ring-primary"
                  >
                    {item.contentType === "film" ? (
                      <>
                        <option value="want_to_watch">Want to Watch</option>
                        <option value="watched">Watched</option>
                      </>
                    ) : (
                      <>
                        <option value="want_to_read">Want to Read</option>
                        <option value="read">Read</option>
                      </>
                    )}
                  </select>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {(item.status === "watched" || item.status === "read") && (
                      <span className="text-success">
                        <Check className="size-4" />
                      </span>
                    )}
                    <button
                      onClick={() => handleRemove(item.contentTitle)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove from library"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
