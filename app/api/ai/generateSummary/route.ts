import { NextResponse } from "next/server";
import { ai } from "@/lib/geminiClient";
import { ThinkingLevel } from "@google/genai";



export async function POST(req: Request) {
    try {
        const { content } = await req.json();

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Generate a concise summary (max 20 words) of the following note:
            ${content}`,
            config: {
                thinkingConfig: {
                    thinkingLevel: ThinkingLevel.LOW,
                },
            }
        });

        const summary = response.text ?? "";

        return NextResponse.json({
            summary,
        });

    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { message: "AI processing failed! try after sometime" },
            { status: 500 }
        );
    }
}