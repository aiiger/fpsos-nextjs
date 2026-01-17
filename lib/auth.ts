import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.ADMIN_SECRET || 'fpsos-super-secret-key-change-this';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function login(password: string) {
    // SECURITY: No fallback password - ADMIN_PASSWORD must be set in environment
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validPassword) {
        throw new Error('ADMIN_PASSWORD environment variable is not configured');
    }

    if (password === validPassword) {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const session = await encrypt({ user: 'admin', expires });

        cookies().set('session', session, { expires, httpOnly: true });
        return true;
    }
    return false;
}

export async function logout() {
    cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession() {
    const session = cookies().get('session')?.value;
    if (!session) return null;
    return await decrypt(session).catch(() => null);
}
