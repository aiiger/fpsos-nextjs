import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateRequest, scoreSubmitSchema } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function GET() {
    try {
        // Get top 10 scores for the current month (fastest times are lower)
        const result = await db.execute(`
      SELECT id, username, discordId, score, rank, timestamp FROM scores 
      ORDER BY score ASC 
      LIMIT 10
    `);

        return NextResponse.json(result.rows);
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Database error:', error);
        }
        return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    // Rate limiting
    const rateLimitResponse = checkRateLimit(req, 'leaderboard-submit', RATE_LIMITS.LEADERBOARD_SUBMIT);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        // Validate request body
        const validation = await validateRequest(req, scoreSubmitSchema);
        if (!validation.success) {
            return validation.response;
        }

        const { username, discordId, score, rank, pin } = validation.data;

        await db.execute({
            sql: `INSERT INTO scores (username, discordId, score, rank, pin)
                  VALUES (?, ?, ?, ?, ?)`,
            args: [username, discordId || null, score, rank || null, pin]
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Database insertion error:', error);
        }
        return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
    }
}
