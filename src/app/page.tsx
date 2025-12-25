"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { Film, Book, Sparkles, Trophy, Users, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Celebrate Black Excellence
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Black Cultural
            <br />
            <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text">Trivia</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Test your knowledge of groundbreaking films and literature by Black
            creators. From the Harlem Renaissance to contemporary works, explore
            stories that shaped culture and history.
          </motion.p>

          {/* Category Pills */}
          <motion.div
            className="mb-12 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2">
              <Film className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">105+ Films</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2">
              <Book className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">300+ Books</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Multiple Difficulties</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Authenticated>
              <motion.button
                onClick={() => router.push("/play")}
                className="button-gradient group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-lg px-8 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Start Playing</span>
                <Sparkles className="relative z-10 h-5 w-5" />
              </motion.button>
            </Authenticated>

            <Unauthenticated>
              <SignInButton mode="modal">
                <motion.button
                  className="button-gradient group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-lg px-8 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Get Started</span>
                  <Sparkles className="relative z-10 h-5 w-5" />
                </motion.button>
              </SignInButton>
            </Unauthenticated>

            <motion.button
              onClick={() => router.push("/leaderboard")}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-primary/20 bg-background px-8 text-lg font-semibold transition-all hover:border-primary/40 hover:bg-primary/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy className="h-5 w-5" />
              <span>Leaderboard</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Why Play Black Cultural Trivia?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              More than just a game—it's an educational journey through Black
              excellence in arts and literature.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="card-gradient group rounded-2xl border p-8 transition-all hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="text-center"
              >
                <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Book,
    title: "Rich Content Library",
    description:
      "Over 400 carefully curated works including films by Black directors and books by Black authors spanning multiple genres and eras.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Questions",
    description:
      "Dynamic, factually accurate questions generated with cutting-edge AI, ensuring fresh challenges every time you play.",
  },
  {
    icon: Trophy,
    title: "Competitive Leaderboards",
    description:
      "Compete with players worldwide across different difficulty levels, themes, and categories. Track your progress and climb the ranks.",
  },
];

const stats = [
  { value: "400+", label: "Films & Books" },
  { value: "10+", label: "Themes" },
  { value: "3", label: "Difficulty Levels" },
  { value: "∞", label: "Questions" },
];
