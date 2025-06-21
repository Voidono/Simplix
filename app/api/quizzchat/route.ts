import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, quizContext } = await req.json();

    const prompt = `
    You are a helpful AI assistant responding in Markdown.

    The user previously received the following quiz questions:
    ${quizContext && quizContext.length > 0 ? JSON.stringify(quizContext, null, 2) : '[No quiz context provided]'}

    Now, the user asks: "${message}"

    Respond clearly using **Markdown** formatting where helpful:

    - Use \`code blocks\` for code
    - Use **bold** or *italic* for emphasis
    - Use \`inline code\` for terms or functions
    - Use bullet points or numbered steps if explaining a process
    - Use headings if breaking down multiple points

    Answer now:
        `;

        const { text } = await generateText({
        model: google('gemini-1.5-flash'),
        prompt,
        temperature: 0.7,
        });

        return NextResponse.json({ response: [text.trim()] }); // just one string, don't split into array
    } catch (error) {
        console.error('Chat response generation failed:', error);
        return NextResponse.json({ error: 'Failed to generate chat response.' }, { status: 500 });
    }
}
