/**
 * Simple in-memory rate limiter for API routes
 * For production with multiple instances, consider using Redis
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up old entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.requests.entries()) {
        if (now > entry.resetTime) {
          this.requests.delete(key)
        }
      }
    }, 60000)
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier for the client (IP, userId, etc.)
   * @param maxRequests - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with allowed status and retry time
   */
  check(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): { allowed: boolean; retryAfter?: number } {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry || now > entry.resetTime) {
      // No entry or expired - create new
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      })
      return { allowed: true }
    }

    if (entry.count < maxRequests) {
      // Under limit - increment
      entry.count++
      return { allowed: true }
    }

    // Over limit - reject
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return { allowed: false, retryAfter }
  }

  cleanup() {
    clearInterval(this.cleanupInterval)
    this.requests.clear()
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter()

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Question generation is expensive (Claude API + OMDB API)
  QUESTION_GENERATION: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
  },
  // Score submission should be limited to prevent spam
  SCORE_SUBMISSION: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  // User questions lookup
  USER_QUESTIONS: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },
  // Leaderboard fetch
  LEADERBOARD: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  },
}

/**
 * Get client identifier from request (IP address or userId)
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }

  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return `ip:${forwarded.split(',')[0].trim()}`
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return `ip:${realIp}`
  }

  // Fallback to a generic identifier
  return 'ip:unknown'
}
