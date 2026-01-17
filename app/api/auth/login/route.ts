import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth'; // Use shared auth helper

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE email = ?',
            args: [email]
        });

        const user = result.rows[0];

        // Verify password
        if (!user || !bcrypt.compareSync(password, user.password_hash as string)) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create Session Payload
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000 * 7); // 7 days
        const sessionToken = await encrypt({
            userId: user.id?.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            expires
        });

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username
            }
        });

        // Set 'session' cookie (matching lib/auth.ts)
        response.cookies.set('session', sessionToken, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax'
        });

        return response;

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
