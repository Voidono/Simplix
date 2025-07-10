'use client'; // This is a client component

import ChatWidget from '@/components/ChatWidget';
import { useEffect, useState } from 'react';

export default function TestEmbedPage() {
  const [botId, setBotId] = useState('general_bot_1');
  const [welcomeMessage, setWelcomeMessage] = useState("Hello! I'm Son, your love expert");

  // In a real scenario, you might fetch these from your dashboard or a config
  useEffect(() => {
    // You could dynamically fetch the bot details here if needed
  }, []);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Test Embed Page</h1>
      <p style={{ color: '#555', marginBottom: '40px' }}>
        This page is part of your Next.js application, allowing the chat widget to
        communicate directly with its API routes.
      </p>

      <div style={{ 
        border: '1px dashed #ccc', 
        padding: '50px', 
        background: 'white', 
        borderRadius: '8px', 
        textAlign: 'center' 
      }}>
        <p>Content of your simulated website...</p>
        <p>Imagine this is where your site's content would go.</p>
      </div>

      {/* Render the ChatWidget directly */}
      <ChatWidget 
        botId={botId} 
        initialWelcomeMessage={welcomeMessage} 
        theme="light" // or "dark"
      />

      <p style={{ marginTop: '50px', fontSize: '12px', color: '#888' }}>
        Note: In a real website, you'd use the embed script, but for local testing
        within the Next.js app, importing directly is simpler.
      </p>
    </div>
  );
}