import { supabase } from '@/lib/supabase'; // Import Supabase client

// --- IMPORTANT: For createTables, you should run these SQL commands directly in your Supabase SQL Editor ---
// This function below is conceptual for demonstration of table creation logic,
// but in a real Supabase project, you'd manage schema via Supabase's UI or migrations.
export async function createTablesSupabase() {
  // You should run these SQL commands directly in your Supabase SQL Editor
  // or use Supabase migrations for a production setup.
  console.log('To set up tables in Supabase, run the SQL commands provided in the setup instructions.');
  console.log('This createTablesSupabase function is illustrative and typically not run directly from your Next.js app for schema creation in Supabase.');
  // Example SQL you would run manually in Supabase:
  /*
  CREATE TABLE IF NOT EXISTS bots (
    id SERIAL PRIMARY PRIMARY KEY,
    bot_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    context TEXT,
    locale VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS chat_logs (
    id SERIAL PRIMARY KEY,
    bot_id VARCHAR(50) NOT NULL,
    user_message TEXT,
    ai_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (bot_id) REFERENCES bots(bot_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS user_bots (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    bot_id VARCHAR(50) REFERENCES bots(bot_id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'owner',
    PRIMARY KEY (user_id, bot_id)
  );
  */
}


// Helper functions for bot management using Supabase Client
interface BotData {
  botId: string;
  name: string;
  context: string;
  locale?: string;
}

export async function createBot(botData: BotData) {
  const { data, error } = await supabase
    .from('bots')
    .insert([
      { 
        bot_id: botData.botId, 
        name: botData.name, 
        context: botData.context, 
        locale: botData.locale || 'en' 
      }
    ])
    .select('*') // Select the inserted row
    .single();

  if (error) {
    throw new Error(`Failed to create bot: ${error.message}`);
  }
  return data;
}

export async function updateBot(botId: string, botData: Partial<BotData>) {
  const { data, error } = await supabase
    .from('bots')
    .update({ 
      name: botData.name, 
      context: botData.context, 
      locale: botData.locale,
      updated_at: new Date().toISOString() // Manually update timestamp
    })
    .eq('bot_id', botId)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update bot: ${error.message}`);
  }
  return data;
}

export async function getBot(botId: string) {
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('bot_id', botId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows found'
    console.error('Error fetching bot:', error);
    throw new Error(`Failed to fetch bot: ${error.message}`);
  }
  return data;
}


export async function getAllBots() {
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch all bots: ${error.message}`);
  }
  return data;
}

export async function getChatHistory(botId: string, limit = 100) {
  const { data, error } = await supabase
    .from('chat_logs')
    .select('*')
    .eq('bot_id', botId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch chat history: ${error.message}`);
  }
  return data;
}

// Optional: Function to delete a bot
export async function deleteBot(botId: string) {
  const { error } = await supabase
    .from('bots')
    .delete()
    .eq('bot_id', botId);

  if (error) {
    throw new Error(`Failed to delete bot: ${error.message}`);
  }
  return true;
}