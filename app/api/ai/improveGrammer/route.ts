import { NextResponse } from "next/server";
import { ai } from "@/lib/geminiClient";
import { ThinkingLevel } from "@google/genai";

export async function POST(req: Request) {
    try {
        const { content } = await req.json();

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Correct spelling and grammar of the following text.
                        Return only the corrected text.
                        Text:
            ${content}`,
                config: {
                    thinkingConfig: {
                        thinkingLevel: ThinkingLevel.LOW,
                    },
                }
        });

        return NextResponse.json({
            corrected: response.text?.trim(),
        });

    } catch (err) {
        return NextResponse.json(
            { message: "AI processing failed" },
            { status: 500 }
        );
    }
}