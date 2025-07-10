import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { stepTitle, note } = await req.json();

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `
      You are an AI tutor. Evaluate the following student's note on "${stepTitle}":

      Note:
      ${note}

      Give a score from 0 to 100, and provide 1 paragraph of feedback.
      Output format: { "score": 78, "feedback": "..." }
      `,
    });

    const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
    return NextResponse.json(json);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to evaluate notes' }, { status: 500 });
  }
}
