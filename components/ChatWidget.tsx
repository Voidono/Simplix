'use client';

import { useState, useEffect, useRef } from 'react';
// import { Send } from 'lucide-react'; // Nếu bạn muốn dùng icon gửi tin nhắn

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string[]; // Content có thể là một mảng chuỗi
}

interface ChatWidgetProps {
  botId: string;
  theme?: 'light' | 'dark';
  initialWelcomeMessage?: string;
}

export default function ChatWidget({ botId, theme = 'light', initialWelcomeMessage }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const defaultWelcomeMessage = 'Hello! How can I help you today?';

  // Initialize welcome message when widget opens or botId changes
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: [initialWelcomeMessage || defaultWelcomeMessage]
      }]);
    }
  }, [isOpen, botId, initialWelcomeMessage, messages.length]);

  // Scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // If opening for the first time and no messages, add welcome message
    if (!isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: [initialWelcomeMessage || defaultWelcomeMessage]
      }]);
    }
  };

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: [input], // User input is a single string for now, but wrapped in array
    };

    // Add user message to state immediately
    setMessages((prev) => [...prev, userMsg]);
    setInput(''); // Clear input field
    setIsTyping(true); // Show typing indicator

    try {
      const res = await fetch(`/api/chat/${botId}`, { // Use the botId in the API path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(msg => ({ // Pass all current messages including the new one
            role: msg.role,
            content: msg.content.join(' ') // Flatten content array to string for API
          })),
          // We can't easily get the 'locale' from here without passing it down or fetching from botConfig
          // For now, let's assume locale will be handled by the server based on bot config
          locale: (messages.find(m => m.role === 'assistant' && m.content.some(c => c.includes('tiếng Việt'))) ? 'vi' : 'en') // Simple heuristic, better to fetch from botConfig if needed
        }),
      });

      if (!res.ok) {
        // Attempt to parse error response from server
        const errorData = await res.json().catch(() => ({ error: 'Unknown API error' }));
        throw new Error(errorData.error || `API Error: ${res.status}`);
      }

      const data = await res.json();
      const { response, chunks } = data; // API returns 'response' (string) and 'chunks' (array of strings)

      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: chunks || [response || 'Sorry, I encountered an error. Please try again.'], // Prefer chunks if available, else use response
      };

      setMessages((prev) => [...prev, aiMsg]);

    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: ['Sorry, I encountered an error. Please try again.'] },
      ]);
    } finally {
      setIsTyping(false); // Hide typing indicator
    }
  }

  return (
    <div className={`chat-widget ${theme}`}>
      {/* Chat Button */}
      <button 
        onClick={toggleChat}
        className="chat-toggle-btn"
        aria-label="Open chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>AI Assistant</h3>
            <button onClick={toggleChat} className="close-btn">✕</button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, idx) =>
              msg.content.map((text, i) => (
                <div
                  key={`${idx}-${msg.role}-${i}`} // Improved key for stability
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg shadow ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-black rounded-bl-none'
                    }`}
                  >
                    <p>{text}</p>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-xs p-3 rounded-lg shadow bg-gray-200 text-black rounded-bl-none">
                  <div className="message-content typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} /> {/* Scroll target */}
          </div>

          <form onSubmit={sendMessage} className="chat-input">
            <input
              type="text" // Explicitly define type
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isTyping}
            />
            <button type="submit" disabled={isTyping || !input.trim()}>
              {/* <Send className="w-7 h-7" /> */} {/* Nếu dùng icon */}
              Send
            </button>
          </form>
        </div>
      )}

      {/* Styles (can be moved to a separate CSS file for larger projects) */}
      <style jsx>{`
        .chat-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .chat-toggle-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-toggle-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(0,0,0,0.2);
        }

        .chat-window {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .chat-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          background-color: #f8f9fa; /* Added background for clarity */
        }

        .message {
          display: flex;
          max-width: 85%;
        }

        .message.user {
          align-self: flex-end;
        }

        .message.assistant {
          align-self: flex-start;
        }

        .message-content {
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .message.assistant .message-content {
          background: #e9ecef; /* Lighter gray for assistant */
          color: #333;
        }

        .typing {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .typing span {
          width: 6px;
          height: 6px;
          background: #999;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing span:nth-child(1) { animation-delay: 0s; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }

        .chat-input {
          padding: 20px;
          border-top: 1px solid #e9ecef;
          display: flex;
          gap: 10px;
          background: white; /* Added background */
        }

        .chat-input input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 25px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input input:focus {
          border-color: #667eea;
        }

        .chat-input button {
          padding: 12px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
          display: flex; /* For icon alignment */
          align-items: center; /* For icon alignment */
          justify-content: center; /* For icon alignment */
        }

        .chat-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-input button:not(:disabled):hover {
          opacity: 0.9;
        }

        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 40px);
            height: 80vh;
            bottom: 70px;
            right: 20px;
          }
        }
      `}</style>
    </div>
  );
}