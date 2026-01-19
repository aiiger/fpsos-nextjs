import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, reason } = body;

        if (!username || !reason) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Call Bot API (Control Plane)
        // Assuming bot is running on localhost:8080 (or configuring URL via env)
        const botUrl = process.env.BOT_API_URL || 'http://localhost:8080';

        try {
            const response = await fetch(`${botUrl}/api/create-ticket`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, reason }),
            });

            const data = await response.json();

            if (!response.ok) {
                return NextResponse.json({ error: data.error || 'Bot API Error' }, { status: response.status });
            }

            return NextResponse.json(data);
        } catch (fetchError) {
            console.error('Failed to connect to bot:', fetchError);
            return NextResponse.json({ error: 'Bot offline or unreachable' }, { status: 503 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
