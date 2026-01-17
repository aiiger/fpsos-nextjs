import { NextResponse } from 'next/server';

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// In-memory store for rate limiting (per-instance)
// For production with multiple instances, use Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of rateLimitStore.entries()) {
            if (entry.resetAt < now) {
                rateLimitStore.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}

interface RateLimitConfig {
    /** Maximum number of requests allowed in the window */
    limit: number;
    /** Time window in seconds */
    windowSeconds: number;
}

// Default configs for different endpoint types
export const RATE_LIMITS = {
    BOOKING_CREATE: { limit: 5, windowSeconds: 60 },      // 5 per minute
    LEADERBOARD_SUBMIT: { limit: 10, windowSeconds: 60 }, // 10 per minute
    CONTACT_FORM: { limit: 3, windowSeconds: 60 },        // 3 per minute
    NEWS_FETCH: { limit: 30, windowSeconds: 60 },         // 30 per minute
    GENERAL_API: { limit: 60, windowSeconds: 60 },        // 60 per minute
} as const;

/**
 * Extract IP address from request headers
 */
function getClientIP(request: Request): string {
    // Vercel/Cloudflare headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // Fallback
    return 'unknown';
}

/**
 * Check rate limit for a request
 * @returns null if allowed, NextResponse if rate limited
 */
export function checkRateLimit(
    request: Request,
    endpoint: string,
    config: RateLimitConfig
): NextResponse | null {
    const ip = getClientIP(request);
    const key = `${endpoint}:${ip}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);

    if (!entry || entry.resetAt < now) {
        // First request or window expired - start fresh
        rateLimitStore.set(key, {
            count: 1,
            resetAt: now + (config.windowSeconds * 1000),
        });
        return null;
    }

    if (entry.count >= config.limit) {
        // Rate limit exceeded
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

        return NextResponse.json(
            {
                error: 'Too many requests',
                message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
                retryAfter,
            },
            {
                status: 429,
                headers: {
                    'Retry-After': String(retryAfter),
                    'X-RateLimit-Limit': String(config.limit),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
                },
            }
        );
    }

    // Increment counter
    entry.count++;
    rateLimitStore.set(key, entry);

    return null;
}

/**
 * Rate limit middleware wrapper for API routes
 */
export function withRateLimit(
    endpoint: string,
    config: RateLimitConfig,
    handler: (request: Request, ...args: any[]) => Promise<NextResponse>
) {
    return async (request: Request, ...args: any[]): Promise<NextResponse> => {
        const rateLimitResponse = checkRateLimit(request, endpoint, config);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }
        return handler(request, ...args);
    };
}
