import { NextResponse } from 'next/server';
import { suggestBestTime, SuggestionContext } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const body: SuggestionContext = await request.json();

        if (!body.packageName || !body.availableSlots) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const suggestion = await suggestBestTime(body);

        return NextResponse.json({ suggestion });
    } catch (error) {
        console.error('AI Suggestion Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate suggestion' },
            { status: 500 }
        );
    }
}
