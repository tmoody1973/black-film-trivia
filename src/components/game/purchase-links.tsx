"use client"

import { motion } from "framer-motion"
import { ExternalLink, ShoppingCart, Tv, BookOpen, Library, Music, Disc, Globe } from "lucide-react"
import type { ContentType } from "@/types/game"

interface PurchaseLinksProps {
  contentTitle: string
  contentType: ContentType
  creator?: string
}

interface LinkConfig {
  name: string
  icon: React.ReactNode
  getUrl: (title: string, creator?: string) => string
  color: string
  bgColor: string
}

// Film streaming/purchase links
const filmLinks: LinkConfig[] = [
  {
    name: "Amazon",
    icon: <ShoppingCart className="size-4" />,
    getUrl: (title) => `https://www.amazon.com/s?k=${encodeURIComponent(title)}&i=instant-video`,
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50",
  },
  {
    name: "Apple TV",
    icon: <Tv className="size-4" />,
    getUrl: (title) => `https://tv.apple.com/search?term=${encodeURIComponent(title)}`,
    color: "text-gray-700 dark:text-gray-300",
    bgColor: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
  },
  {
    name: "JustWatch",
    icon: <ExternalLink className="size-4" />,
    getUrl: (title) => `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:hover:bg-yellow-950/50",
  },
]

// Book purchase links
const bookLinks: LinkConfig[] = [
  {
    name: "Amazon",
    icon: <ShoppingCart className="size-4" />,
    getUrl: (title, creator) => {
      const query = creator ? `${title} ${creator}` : title
      return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&i=stripbooks`
    },
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50",
  },
  {
    name: "Bookshop.org",
    icon: <BookOpen className="size-4" />,
    getUrl: (title, creator) => {
      const query = creator ? `${title} ${creator}` : title
      return `https://bookshop.org/search?keywords=${encodeURIComponent(query)}`
    },
    color: "text-teal-600",
    bgColor: "bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/30 dark:hover:bg-teal-950/50",
  },
  {
    name: "WorldCat",
    icon: <Library className="size-4" />,
    getUrl: (title, creator) => {
      const query = creator ? `${title} ${creator}` : title
      return `https://www.worldcat.org/search?q=${encodeURIComponent(query)}`
    },
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50",
  },
  {
    name: "Apple Books",
    icon: <BookOpen className="size-4" />,
    getUrl: (title) => `https://books.apple.com/us/search?term=${encodeURIComponent(title)}`,
    color: "text-gray-700 dark:text-gray-300",
    bgColor: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
  },
]

// Music streaming/info links
const musicLinks: LinkConfig[] = [
  {
    name: "Spotify",
    icon: <Music className="size-4" />,
    getUrl: (title) => `https://open.spotify.com/search/${encodeURIComponent(title)}`,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-950/50",
  },
  {
    name: "Apple Music",
    icon: <Music className="size-4" />,
    getUrl: (title) => `https://music.apple.com/us/search?term=${encodeURIComponent(title)}`,
    color: "text-pink-600",
    bgColor: "bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/30 dark:hover:bg-pink-950/50",
  },
  {
    name: "YouTube Music",
    icon: <Music className="size-4" />,
    getUrl: (title) => `https://music.youtube.com/search?q=${encodeURIComponent(title)}`,
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50",
  },
  {
    name: "Discogs",
    icon: <Disc className="size-4" />,
    getUrl: (title) => `https://www.discogs.com/search/?q=${encodeURIComponent(title)}&type=artist`,
    color: "text-gray-700 dark:text-gray-300",
    bgColor: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
  },
  {
    name: "Wikipedia",
    icon: <Globe className="size-4" />,
    getUrl: (title) => `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(title)}`,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50",
  },
]

export function PurchaseLinks({ contentTitle, contentType, creator }: PurchaseLinksProps) {
  const links = contentType === "book" ? bookLinks : contentType === "music" ? musicLinks : filmLinks
  const heading = contentType === "book" ? "Where to Read" : contentType === "music" ? "Where to Listen" : "Where to Watch"

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <ExternalLink className="size-4" />
        {heading}
      </h4>
      <div className="flex flex-wrap gap-2">
        {links.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.getUrl(contentTitle, creator)}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${link.bgColor} ${link.color}`}
          >
            {link.icon}
            {link.name}
          </motion.a>
        ))}
      </div>
    </div>
  )
}
