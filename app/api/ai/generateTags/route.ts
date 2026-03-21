import { NextResponse } from "next/server";
import { ai } from "@/lib/geminiClient";
import { ThinkingLevel } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 relevant tags for this note.
Return only a JSON array.

Note:
${content}`,
 config: {
                thinkingConfig: {
                    thinkingLevel: ThinkingLevel.LOW,
                },
            }
    });

    const text = response.text ?? "[]";

    return NextResponse.json({
      tags: JSON.parse(text),
    });

  } catch (err) {
    return NextResponse.json(
      { message: "AI processing failed" },
      { status: 500 }
    );
  }
}