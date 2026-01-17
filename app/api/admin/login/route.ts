import { admin } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    // Verify Firebase ID Token
    if (username === 'admin') {
        // In a real app, the "password" field would be the ID token sent from client
        try {
            const decodedToken = await admin.auth().verifyIdToken(password);
            // Optional: Check if user is actually an admin claim
            return NextResponse.json({ success: true, uid: decodedToken.uid });
        } catch (error) {
            console.error("Auth failed:", error);
            // Fallback for legacy dev mode (remove in production)
            // if (password === 'legacy_password') return NextResponse.json({ success: true });
        }
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
