import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const BOT_API_URL = 'http://localhost:8088/api';

const botActionSchema = z.object({
    action: z.enum(['trigger_diagnostic', 'status']),
    userId: z.string().optional(),
    channelId: z.string().optional(),
});

export async function POST(req: Request) {
    // SECURITY: Require admin session
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Validate request body
        const validation = botActionSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Invalid request',
                details: validation.error.issues
            }, { status: 400 });
        }

        const { action, ...data } = validation.data;

        let endpoint = '';
        let method = 'POST';

        switch (action) {
            case 'trigger_diagnostic':
                endpoint = '/trigger-diagnostic';
                break;
            case 'status':
                endpoint = '/status';
                method = 'GET';
                break;
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': process.env.BOT_SECRET_KEY // Future security
            },
        };

        if (method === 'POST') {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${BOT_API_URL}${endpoint}`, options);
            if (!response.ok) {
                const errorText = await response.text();
                return NextResponse.json({ error: `Bot Error: ${response.status}`, details: errorText }, { status: response.status });
            }
            const result = await response.json();
            return NextResponse.json(result);

        } catch (fetchError) {
            return NextResponse.json({
                error: 'Bot Unreachable',
                details: 'Ensure ultimate_bot.py is running'
            }, { status: 503 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
