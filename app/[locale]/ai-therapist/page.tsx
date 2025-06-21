// src/app/[locale]/ai-therapist/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Helpline from '@/components/Helpline';
import { HeartHandshake, Send } from 'lucide-react';
import { useParams } from 'next/navigation'; // <-- Import useParams

export default function Page() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string | string[] }[]>([]);
  const [input, setInput] = useState('');
  const [crisis, setCrisis] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Get the current locale from the URL parameters
  const params = useParams();
  const currentLocale = params.locale as string; // Assert as string, e.g., 'en' or 'vi'
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMsg = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', { // Your API endpoint remains /api/chat
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          locale: currentLocale, // <-- Pass the current locale to the API
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);

      const data = await res.json();
      const responseChunks = data.response as string[];
      const isCrisis = data.isCrisis;

      const newAIMessage = {
        role: 'ai' as const,
        content: isCrisis ? ['I think it\'s time to seek real help.'] : responseChunks,
      };

      if (isCrisis) setCrisis(true);

      setMessages((prev) => [...prev, newAIMessage]);
    } catch (err) {
      console.error('Chat API error:', err);
      setMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, something went wrong.' }]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <HeartHandshake className='mr-1' />
        <span>AI Therapist - blocking only high "EXTREME"</span>
      </h1>

      <div className="flex-1 overflow-y-auto space-y-2 bg-white p-4 rounded-lg">
        {messages.map((msg, idx) => {
          const contents = Array.isArray(msg.content) ? msg.content : [msg.content];
          return contents.map((text, i) => (
            <div
              key={`${idx}-${i}`}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white text-black rounded-bl-none'
                }`}
              >
                <p>{text}</p>
              </div>
            </div>
          ));
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs p-3 rounded-lg shadow bg-white text-gray-400 italic rounded-bl-none">
              AI is typing...
            </div>
          </div>
        )}

        {crisis && <Helpline />}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex mt-4 gap-2 border-2 border-black p-2 rounded-xl">
        <input
          type="text"
          className="flex-1 border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your thoughts..."
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <Send className='w-7 h-7' />
        </button>
      </form>
    </main>
  );
}
