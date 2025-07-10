// src/app/[locale]/ai-therapist/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Helpline from '@/components/Helpline';
import { HeartHandshake, Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string[];
  reactions?: string[];
};

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [crisis, setCrisis] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const currentLocale = params.locale as string;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: [input],
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          locale: currentLocale,
          history: messages,
        }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      const { response, isCrisis, reactions } = data;

      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: response,
        reactions: reactions || [],
      };

      if (isCrisis) setCrisis(true);
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: ['Sorry, something went wrong.'] },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <HeartHandshake className="mr-1" />
        <span>AI Therapist - blocking only high "EXTREME"</span>
      </h1>

      <div className="flex-1 overflow-y-auto space-y-2 bg-white p-4 rounded-lg">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.content.map((text, i) => (
              <div
                key={`${idx}-${i}`}
                className={`max-w-xs p-3 rounded-lg shadow mb-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-black rounded-bl-none'
                }`}
              >
                <div className="prose prose-sm max-w-full break-words">
                  <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
                </div>
              </div>
            ))}

            {/* 💖 Show AI-suggested reactions under user's message */}
            {msg.role === 'user' && (() => {
              const nextMsg = messages[idx + 1];
              if (
                nextMsg?.role === 'assistant' &&
                Array.isArray(nextMsg.reactions) &&
                nextMsg.reactions.length > 0
              ) {
                return (
                  <div className="flex gap-2 mt-[-10px] bg-blue-50 px-3 py-1 rounded-2xl shadow-inner">
                    {nextMsg.reactions.map((icon, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-xl hover:scale-110 transition"
                        aria-label={`React ${icon}`}
                      >
                        {icon}
                      </span>
                    ))}
                  </div>
                );
              }
              return null;
            })()}
          </div>
        ))}

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

      <form
        onSubmit={sendMessage}
        className="flex mt-4 gap-2 border-2 border-black p-2 rounded-xl"
      >
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
          <Send className="w-7 h-7" />
        </button>
      </form>
    </main>
  );
}
