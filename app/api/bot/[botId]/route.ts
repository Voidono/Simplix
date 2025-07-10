import { NextRequest, NextResponse } from 'next/server';
import { getBot, updateBot, deleteBot } from '@/lib/db'; // Added deleteBot

export async function GET(request: NextRequest, { params }: { params: { botId: string } }) {
  try {
    const { botId } = await params;
    const bot = await getBot(botId);
    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }
    return NextResponse.json(bot);
  } catch (error) {
    console.error('Error fetching bot:', error);
    return NextResponse.json({ error: 'Failed to fetch bot' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { botId: string } }) {
  try {
    const { botId } = await params;
    const botData = await request.json();
    const updatedBot = await updateBot(botId, botData);
    if (!updatedBot) {
      return NextResponse.json({ error: 'Bot not found or no changes applied' }, { status: 404 });
    }
    return NextResponse.json(updatedBot);
  } catch (error) {
    console.error('Error updating bot:', error);
    return NextResponse.json({ error: 'Failed to update bot' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { botId: string } }) {
  try {
    const { botId } = await params;
    await deleteBot(botId); 
    return NextResponse.json({ message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    return NextResponse.json({ error: 'Failed to delete bot' }, { status: 500 });
  }
}