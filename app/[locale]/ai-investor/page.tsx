'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, DollarSign, Bot } from 'lucide-react';
import { StockCard } from '@/components/StockCard';
import ReactMarkdown from 'react-markdown';

type StockData = {
  symbol: string;
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
};

const page = () => {
  const [symbols, setSymbols] = useState<string>('');
  const [message, setMessage] = useState('');
  const [quotes, setQuotes] = useState<StockData[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiResponse, quotes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!symbols.trim() || !message.trim()) return;

    setLoading(true);
    setAiResponse('');
    setQuotes([]);

    const res = await fetch('/api/investor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbols: symbols.split(',').map((s) => s.trim().toUpperCase()),
        message,
      }),
    });

    const data = await res.json();
    setQuotes(data.quotes);
    setAiResponse(data.response);
    setLoading(false);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-green-700 flex justify-center items-center gap-2">
          <Bot className="w-8 h-8" />
          Investor AI
        </h1>
        <p className="text-gray-500 mt-2 text-sm">Enter stock symbols and ask anything</p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          value={symbols}
          onChange={(e) => setSymbols(e.target.value)}
          placeholder="Stock symbols (e.g. AAPL, TSLA)"
          className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-green-500"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Investor AI something..."
            className="flex-1 p-3 rounded border border-gray-300 focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && <p className="text-center text-sm text-gray-500">Analyzing market data...</p>}

      {/* Stock Cards */}
      {quotes.length > 0 && (
        <div className="">
          {quotes.map((q) => (
            <StockCard key={q.symbol} data={q} />
          ))}
        </div>
      )}

      {/* AI Response */}
      {aiResponse && (
        <div className="prose max-w-none bg-gray-50 p-4 rounded border border-gray-300 mb-6">
          <ReactMarkdown>{aiResponse}</ReactMarkdown>
        </div>
      )}

      <div ref={bottomRef} />
    </main>
  );
}

export default page