// app/api/quizz/route.ts

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic, difficulty = 'medium', numQuestions = 5 } = await req.json();

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `
      You are a quiz generator AI.

      Generate ${numQuestions} multiple-choice quiz questions about the topic: "${topic}".
      Each question should have 4 options (A, B, C, D), one correct answer, and a short explanation.

      Format the response as JSON array like this:
      [
        {
          "question": "...",
          "options": ["A", "B", "C", "D"],
          "answer": "B",
          "explanation": "..."
        },
        ...
      ]
      `,
      temperature: 0.7,
    });

    const start = text.indexOf('[');
    const end = text.lastIndexOf(']') + 1;
    const json = text.slice(start, end);

    const quizzes = JSON.parse(json);
    return NextResponse.json({ quizzes });
  } catch (err) {
    console.error('Quiz generation error:', err);
    return NextResponse.json({ error: 'Failed to generate quiz.' }, { status: 500 });
  }
}
