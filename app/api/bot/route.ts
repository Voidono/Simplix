import { NextRequest, NextResponse } from 'next/server';
import { createBot, getAllBots } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const botData = await request.json();
    if (!botData.botId || !botData.name || !botData.context) {
      return NextResponse.json({ error: 'Missing required bot data: botId, name, context' }, { status: 400 });
    }
    const newBot = await createBot(botData);
    return NextResponse.json(newBot, { status: 201 });
  } catch (error) {
    console.error('Error creating bot:', error);
    return NextResponse.json({ error: 'Failed to create bot' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bots = await getAllBots();
    return NextResponse.json(bots);
  } catch (error) {
    console.error('Error fetching bots:', error);
    return NextResponse.json({ error: 'Failed to fetch bots' }, { status: 500 });
  }
}