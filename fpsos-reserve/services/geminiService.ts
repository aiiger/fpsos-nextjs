
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async suggestBestTime(context: {
    serviceName: string;
    availableSlots: string[];
    userNotes: string;
  }) {
    const prompt = `Based on the user's notes: "${context.userNotes}", and the available time slots for a "${context.serviceName}" meeting: ${context.availableSlots.join(', ')}, suggest the best 2 slots and explain why in a very concise, helpful, friendly Apple-style tone.`;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "I recommend picking a slot that fits your schedule best. Most clients prefer morning sessions for discovery calls!";
    }
  }
}

export const geminiService = new GeminiService();
