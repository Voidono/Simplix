import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Correctly destructure both 'message' and 'locale' from the request body
    const { message, locale } = await req.json(); // <-- Get locale from the request body

    console.log("API received locale from client:", locale); // Verify it's 'en' or 'vi'

    // Determine the language instruction based on the 'locale' received from the client
    let languageInstruction = '';
    if (locale === 'vi') {
      languageInstruction = 'Hãy phản hồi bằng tiếng Việt.';
    } else if (locale === 'en') {
      languageInstruction = 'Respond in English.';
    } else {
      // Fallback if locale is not 'en' or 'vi', or if it's missing/invalid
      languageInstruction = 'Respond in English.';
    }

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `
        You are a compassionate AI therapist.

        Your role is to help the user feel heard and supported. Respond in a warm, calm, and emotionally intelligent way.
        ${languageInstruction}

        However — if you detect that the user is expressing something emotionally **extreme** (e.g., suicidal thoughts, self-harm, deep hopelessness, severe crisis):
        - DO NOT try to solve the problem.
        - Instead, include "[FLAG:CRISIS]" at the end of your message.
        - Offer empathy and acknowledge the need for real human support.

        Examples that should be flagged:
        - "I don’t want to live anymore."
        - "Everything feels pointless."
        - "I want to hurt myself."

        Only include "[FLAG:CRISIS]" if you're concerned about the user's mental or emotional safety.

        Now respond to this user message:
        "${message}"
      `,
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

    const isCrisis = text.includes('[FLAG:CRISIS]');
    const cleanText = text.replace('[FLAG:CRISIS]', '').trim();

    const sentences = cleanText.match(/[^.?!]+[.?!]/g) || [];
    const responseChunks = sentences.slice(0, 4);

    return NextResponse.json({ response: responseChunks, isCrisis });
  } catch (error) {
    console.error('AI response error:', error);
    return NextResponse.json({ error: 'Failed to generate AI response.' }, { status: 500 });
  }
}
