import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        const validPassword = process.env.ADMIN_PASSWORD;

        if (!validPassword) {
            console.error('ADMIN_PASSWORD environment variable is not set');
            return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
        }

        if (password === validPassword) {
            const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            const session = await encrypt({ user: 'admin', expires });

            const response = NextResponse.json({ success: true });
            response.cookies.set('session', session, {
                expires,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            return response;
        }

        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
