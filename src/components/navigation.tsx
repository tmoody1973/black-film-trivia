"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
  },
  {
    href: "/admin",
    label: "Analytics",
  },
  {
    href: "/profile",
    label: "Profile",
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Black Film Trivia</span>
            <span className="rounded bg-gradient-to-r from-primary/10 to-secondary/10 px-1.5 py-0.5 text-xs font-medium text-primary">BETA</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={pathname === route.href 
                ? "text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" 
                : "text-muted-foreground transition-colors hover:text-foreground"}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
} 