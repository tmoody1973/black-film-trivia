import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Welcome to Black Film Trivia
      </h1>
      <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
        Test your knowledge of Black Cinema with our interactive trivia game.
      </p>
      <Link
        href="/play"
        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Start Playing
      </Link>
    </div>
  )
} 