// This file remains largely the same as before, as it interacts with your API routes.
// No significant changes needed from the previous version provided.
'use client';
import { useState, useEffect } from 'react';

// Define a type for bot configuration
interface BotConfig {
  name: string;
  context: string;
  locale: string;
}

export default function Dashboard() {
  const [botId] = useState<string>('general_bot_1'); 
  const [botConfig, setBotConfig] = useState<BotConfig>({
    name: '',
    context: '',
    locale: 'en',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBotConfig() {
      try {
        const response = await fetch(`/api/bot/${botId}`);
        if (response.ok) {
          const data = await response.json();
          setBotConfig({
            name: data.name,
            context: data.context,
            locale: data.locale || 'en',
          });
        } else if (response.status === 404) {
            setMessage(`Bot with ID '${botId}' not found. Attempting to create it.`);
            await handleCreateBot(); // Try to create if not found
        } else {
          setMessage('Failed to load bot configuration.');
        }
      } catch (error) {
        console.error('Error fetching bot config:', error);
        setMessage('Error connecting to the server.');
      } finally {
        setLoading(false);
      }
    }

    fetchBotConfig();
  }, [botId]);

  const handleCreateBot = async () => {
    setMessage(null);
    try {
      const response = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId,
          name: 'My General AI Assistant',
          context: 'This is a general purpose AI assistant. It can answer questions about various topics and provide helpful information.',
          locale: 'en',
        }),
      });
      if (response.ok) {
        const newBot = await response.json();
        setBotConfig(newBot);
        setMessage('New bot created successfully! You can now customize its details.');
      } else {
        const errorData = await response.json();
        setMessage(`Failed to create new bot: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating bot:', error);
      setMessage('Error creating new bot. Check server logs.');
    }
  };

  const handleSave = async () => {
    setMessage(null);
    try {
      const response = await fetch(`/api/bot/${botId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(botConfig),
      });

      if (response.ok) {
        setMessage('Bot settings saved successfully!');
      } else {
        const errorData = await response.json();
        setMessage(`Failed to save bot settings: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving bot config:', error);
      setMessage('Error connecting to the server.');
    }
  };

  const embedCode = `<script src="https://your-domain.com/embed.js" data-bot-id="${botId}" data-welcome-message="${botConfig.name && botConfig.context ? `Hello! I'm ${botConfig.name}, your AI assistant. I can help you with: ${botConfig.context.substring(0, Math.min(botConfig.context.length, 50))}...` : 'Hello! How can I help you today?'}"></script>`;

  if (loading) {
    return <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>Loading bot configuration...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>AI Chatbot Dashboard</h1>
      
      {message && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          borderRadius: '8px', 
          backgroundColor: message.includes('successfully') || message.includes('created') ? '#e6ffe6' : '#ffe6e6', 
          color: message.includes('successfully') || message.includes('created') ? '#1a6a1a' : '#a00000',
          border: `1px solid ${message.includes('successfully') || message.includes('created') ? '#a6f2a6' : '#f2a6a6'}`
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Bot Name
          </label>
          <input
            type="text"
            value={botConfig.name}
            onChange={(e) => setBotConfig(prev => ({ ...prev, name: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Bot Context / Knowledge Base
          </label>
          <textarea
            value={botConfig.context}
            onChange={(e) => setBotConfig(prev => ({ ...prev, context: e.target.value }))}
            rows={8}
            placeholder="Provide detailed information or instructions for your AI bot here. This could be about your business, product, service, or any specific knowledge you want the AI to have. Examples: 'Our company sells custom t-shirts. We offer sizes S-XL and ship worldwide.', 'This bot is for customer support regarding software installation issues. Common problems include...'."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
          <small style={{ color: '#777', marginTop: '5px', display: 'block' }}>
            The AI will use this information to answer questions. Be specific and clear!
          </small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Language Locale
          </label>
          <select
            value={botConfig.locale}
            onChange={(e) => setBotConfig(prev => ({ ...prev, locale: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          style={{
            padding: '15px 30px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Save Changes
        </button>

        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Embed Code for Bot ID: `{botId}`</h3>
          <p style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>
            Copy this code and paste it into the `&lt;body&gt;` section of your website:
          </p>
          <pre style={{
            background: '#fff',
            padding: '15px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '13px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {embedCode}
          </pre>
          <small style={{ color: '#777', marginTop: '10px', display: 'block' }}>
            Remember to replace `https://your-domain.com` with the actual domain where your Next.js app is hosted.
          </small>
        </div>
      </div>
    </div>
  );
}