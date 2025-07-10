// api/duo-roadmap/route.ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `
        You are a curriculum generator AI.
        Break down the topic "${topic}" into a clear step-by-step roadmap for a beginner to master it.
        Each step should have a clear title and an objective.
        Output as a JSON array like:
        [
          { "title": "Introduction to X", "objective": "Understand basic idea of X" },
          { "title": "Core Concepts of Y", "objective": "Master essential principles of Y" }
        ]
        `,
      temperature: 0.7,
    });

    const json = JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1));
    return NextResponse.json({ roadmap: json });
  } catch (err) {
    console.error('Error generating roadmap:', err);
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
  }
}
