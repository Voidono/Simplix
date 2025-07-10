import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import type { CoreMessage } from 'ai';

export async function POST(req: NextRequest) {
  try {
    const { message, locale, history } = await req.json();

    const languageInstruction =
      locale === 'vi'
        ? 'Hãy phản hồi bằng tiếng Việt. Xưng hô: gọi người dùng là "bạn", và xưng là "mình".'
        : 'Respond in English. Use warm, compassionate tone.';

    const messages: CoreMessage[] = [
      {
        role: 'system',
        content: `You are a compassionate AI therapist.

Respond in **well-formatted Markdown** with emojis to feel more human and emotionally expressive.

Use:
- Markdown (**bold**, _italic_, ~~strikethrough~~)
- Emojis via shorthand (:sparkles:) or unicode (✨)
- Short paragraphs and lists

${languageInstruction}

If you detect something emotionally extreme (e.g., suicidal thoughts, hopelessness):
- DO NOT try to solve the issue.
- Instead, end your message with [FLAG:CRISIS].

Also, based on the emotional tone of your message, Always include a reaction line like this:
[REACT: ❤️, 😢]`,
      },
      ...history.map((msg: any) => ({
        role: msg.role,
        content: msg.content.map((t: string) => ({ type: 'text', text: t })),
      })),
      {
        role: 'user',
        content: [{ type: 'text', text: message }],
      },
    ];

    const result = await generateText({
      model: google('gemini-1.5-flash'),
      messages,
      temperature: 0.7,
      providerOptions: {
        google: {
          safetySettings: [
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_ONLY_HIGH',
            },
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        },
      },
    });

    const rawText = result.text;

    // Detect crisis
    const isCrisis = rawText.includes('[FLAG:CRISIS]');

    // Extract reactions
    const reactionMatch = rawText.match(/\[REACT: (.+?)\]/);
    const reactions = reactionMatch
      ? reactionMatch[1].split(',').map((r) => r.trim())
      : [];

    // Clean up text
    const cleanText = rawText
      .replace('[FLAG:CRISIS]', '')
      .replace(/\[REACT: (.+?)\]/, '')
      .trim();

    // Split into 1-4 chunks
    const responseChunks =
      cleanText.match(/[^.?!]+[.?!]/g)?.slice(0, 4).map((s) => s.trim()) || [
        cleanText,
      ];

    return NextResponse.json({ response: responseChunks, isCrisis, reactions });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

