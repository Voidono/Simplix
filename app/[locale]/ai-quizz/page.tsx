'use client';

import { useState } from 'react';
import { Send, BrainCircuit, Bot } from 'lucide-react';
import { QuizCard } from '@/components/QuizCard';
import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

type QuizItem = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

const page = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai' | 'quiz'; content: string }[]>([]);

  // auto scroll when new quizz added
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function generateQuiz() {
    const res = await fetch('/api/quizz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, numQuestions: 3 }),
    });

    const data = await res.json();
    setQuiz(data.quizzes);

    setMessages((prev) => [...prev, { role: 'quiz', content: data.quizzes }]);
  }


  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');

    const res = await fetch('/api/quizzchat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: input,
        quizContext: quiz }),
    });

    const data = await res.json();
    console.log('QUIZ DATA:', data); // ← check shape here
    setMessages((prev) => [...prev, { role: 'ai', content: data.response.join(' ') }]);
  }

  return (
   <main className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Header */}
      <header className="px-4 py-3">
        <h1 className="text-3xl font-bold text-center text-green-700 flex items-center justify-center">
          <Bot className="w-8 h-8 mr-2" />
          <span>AI Quiz & Chat</span>
        </h1>
      </header>

      {/* Scrollable Content (Quiz Generator + Messages) */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-32"> {/* pb-32 ensures input won't cover content */}
        
        {/* Quiz Generator Form */}
        <div className="space-y-3 grid grid-cols-3 gap-1">
          <div className='col-span-2 space-y-2'>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., JavaScript)"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button
            onClick={generateQuiz}
            className="flex items-center justify-center h-[88px] bg-green-600 text-white px-4 rounded-lg shadow-md text-center hover:bg-green-700"
          >
            <BrainCircuit className="w-5 h-5 mr-1" /> Generate Quizzes
          </button>
        </div>

        {/* Quiz Cards */}
        {quiz.length > 0 && (
          <div className="space-y-6">
            {quiz.map((q, idx) => (
              <QuizCard key={idx} question={q} />
            ))}
          </div>
        )}

        {/* Message History */}
        {messages.length > 0 && (
          <div className="space-y-2">
            {messages.map((msg, idx) => {
              if (msg.role === 'quiz' && Array.isArray(msg.content)) {
                return (
                  <div key={idx} className="space-y-4">
                    {msg.content.map((q, qIdx) => (
                      <QuizCard key={qIdx} question={q} />
                    ))}
                  </div>
                );
              }

              return (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`px-4 py-2 max-w-xs rounded-lg shadow ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.role === 'ai' ? (
                      <Markdown>{msg.content}</Markdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Fixed Chat Input */}
      <form
        onSubmit={sendMessage}
        className="bottom-0 left-0 right-0 w-full mx-auto bg-white border-t border-gray-300 p-4 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ask the AI something..."
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </main>
  );
}

export default page;