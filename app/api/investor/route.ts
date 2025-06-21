import { getStockQuote } from '@/lib/finhub';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, symbols } = await req.json();

  const results = await Promise.all(symbols.map(async (sym: string) => {
    const data = await getStockQuote(sym);
    return { symbol: sym, ...data };
  }));

  const prompt = `
You are an investment AI assistant. User is interested in: ${symbols.join(', ')}

Here is real-time data:
${JSON.stringify(results, null, 2)}

User asks: "${message}"

Respond in **Markdown**, including:
- Summary per stock
- Suggest Buy/Hold/Sell
- Mention price trends
`;

  const { text } = await generateText({
    model: google('gemini-1.5-flash'),
    prompt,
    temperature: 0.7,
  });

  return NextResponse.json({ response: text, quotes: results });
}

