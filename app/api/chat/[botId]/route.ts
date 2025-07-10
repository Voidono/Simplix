import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import type { CoreMessage } from 'ai';
import { supabase } from '@/lib/supabase'; // Import Supabase client

interface BotConfig {
  id: number;
  bot_id: string;
  name: string;
  context: string;
  locale: string;
}

// Database helper functions updated for Supabase
async function getBotConfig(botId: string): Promise<BotConfig | null> {
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('bot_id', botId)
    .single(); // Use single() if you expect one row

  if (error) {
    console.error('Database query error:', error);
    return null;
  }
  return data as BotConfig | null;
}

async function saveChatLog(botId: string, userMessage: string, aiResponse: string) {
  const { error } = await supabase
    .from('chat_logs')
    .insert({ bot_id: botId, user_message: userMessage, ai_response: aiResponse });

  if (error) {
    console.error('Failed to save chat log:', error);
  }
}

// Global CORS headers for API routes
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Hoặc cụ thể hóa tên miền của bạn, ví dụ: 'http://127.0.0.1:5500'
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest, { params }: { params: { botId: string } }) {
  try {
    const { messages, locale = 'en' } = await request.json();
    const { botId } = await params; // Đã sửa lỗi await thừa từ lần trước
    
    // Get bot configuration from database
    const botConfig = await getBotConfig(botId);
    if (!botConfig) {
      // Return with CORS headers even on error
      return NextResponse.json({ error: 'Bot not found' }, { status: 404, headers: corsHeaders });
    }

    const languageInstruction = locale === 'vi' 
      ? 'Hãy phản hồi bằng tiếng Việt.' 
      : 'Respond in English.';

    const systemPrompt = `You are a helpful AI assistant named ${botConfig.name}.

Here is the context about yourself or the domain you operate in:
${botConfig.context}

${languageInstruction}

Always be helpful, friendly, and provide accurate information based on the provided context. Keep responses concise but informative.`;

    const coreMessages: CoreMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const result = await generateText({
      model: google('gemini-1.5-flash'),
      messages: coreMessages,
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

    const { text } = result;
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // Save chat interaction to database
    await saveChatLog(botId, userMessage, text);

    const responseChunks = text.match(/[^.?!]+[.?!]/g)?.slice(0, 4).map((s) => s.trim()) || [text];

    // Return with CORS headers
    return NextResponse.json({ 
      response: responseChunks.join(' '),
      chunks: responseChunks 
    }, { headers: corsHeaders }); // <--- THÊM headers Ở ĐÂY

  } catch (error) {
    console.error('Chat API error:', error);
    // Return with CORS headers even on error
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500, headers: corsHeaders }); // <--- THÊM headers Ở ĐÂY
  }
}