export interface SuggestionContext {
    packageName: string;
    packageDuration: string;
    availableSlots: string[];
    userNotes?: string;
}

/**
 * Get AI-powered time slot suggestions based on user context
 * Uses Gemini API via server-side fetch
 */
export async function suggestBestTime(context: SuggestionContext): Promise<string> {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return getDefaultSuggestion(context);
    }

    const prompt = `You are an AI assistant for FPSOS, a premium PC optimization service.

A customer is booking a "${context.packageName}" session (${context.packageDuration} duration).

Available time slots: ${context.availableSlots.join(', ')}

${context.userNotes ? `Customer notes: "${context.userNotes}"` : ''}

Suggest the best 2 time slots for this type of technical session. Consider:
- Morning slots for complex work (when focus is highest)
- Afternoon for simpler consultations
- Give ONE brief, helpful tip about preparing for their session

Keep your response under 60 words. Be friendly but professional, like Apple support.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        return getDefaultSuggestion(context);
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return getDefaultSuggestion(context);
    }
}

/**
 * Fallback suggestion when AI is unavailable
 */
function getDefaultSuggestion(context: SuggestionContext): string {
    const slots = context.availableSlots;
    if (slots.length === 0) {
        return "No slots available for this date. Try selecting another day!";
    }

    // Prefer morning slots for technical work
    const morningSlots = slots.filter(s => {
        const hour = parseInt(s.split(':')[0]);
        return hour < 12;
    });

    if (morningSlots.length >= 2) {
        return `For a ${context.packageName} session, I recommend ${morningSlots[0]} or ${morningSlots[1]}. Morning sessions tend to work best for technical optimizations when your system is fresh. Have TeamViewer ready! 🚀`;
    }

    return `I recommend ${slots[0]}${slots.length > 1 ? ` or ${slots[1]}` : ''} for your session. Make sure you have TeamViewer or AnyDesk installed before your appointment! 🚀`;
}
