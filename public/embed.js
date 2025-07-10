// public/embed.js
(function() {
    const scriptTag = document.currentScript;
    const botId = scriptTag.getAttribute('data-bot-id') || 'general_bot_1';
    const initialWelcomeMessage = scriptTag.getAttribute('data-welcome-message');
    const theme = scriptTag.getAttribute('data-theme') || 'light'; // Add theme attribute if needed

    // *** IMPORTANT: Define your Next.js app's base URL here ***
    // For local development:
    const NEXT_APP_BASE_URL = 'http://localhost:3000'; 
    // For production, this should be your deployed Vercel domain, e.g., 'https://your-domain.com'

    // Define ChatMessage type for clarity, even in JS
    // type ChatMessage = { role: 'user' | 'assistant'; content: string[]; };

    const messages = []; // Array to store chat messages
    let input = '';
    let isOpen = false;
    let isTyping = false;

    // --- Helper function for rendering ---
    function renderChatWindow() {
        const chatWidget = document.getElementById('chat-widget-container');
        if (!chatWidget) return; // Ensure container exists

        chatWidget.innerHTML = `
            ${isOpen ? `
                <div class="chat-window">
                    <div class="chat-header">
                        <h3>AI Assistant</h3>
                        <button class="close-btn">✕</button>
                    </div>
                    <div class="chat-messages">
                        ${messages.map(msg => 
                            msg.content.map(text => `
                                <div class="message ${msg.role === 'user' ? 'user' : 'assistant'}">
                                    <div class="message-content">
                                        <p>${text}</p>
                                    </div>
                                </div>
                            `).join('')
                        ).join('')}
                        ${isTyping ? `
                            <div class="message assistant">
                                <div class="message-content typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        ` : ''}
                        <div class="bottom-ref"></div>
                    </div>
                    <form class="chat-input-form">
                        <input type="text" class="chat-input-field" placeholder="Type your message..." ${isTyping ? 'disabled' : ''}/>
                        <button type="submit" class="chat-send-btn" ${isTyping || !input.trim() ? 'disabled' : ''}>Send</button>
                    </form>
                </div>
            ` : ''}
            <button class="chat-toggle-btn">${isOpen ? '✕' : '💬'}</button>
        `;

        // --- Event Listeners ---
        const toggleBtn = chatWidget.querySelector('.chat-toggle-btn');
        if (toggleBtn) {
            toggleBtn.onclick = toggleChat;
        }

        const closeBtn = chatWidget.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.onclick = toggleChat;
        }

        const inputField = chatWidget.querySelector('.chat-input-field');
        if (inputField) {
            inputField.value = input; // Set current input value
            inputField.oninput = (e) => {
                input = e.target.value;
                // No need to re-render everything on every input change,
                // but we update the internal `input` variable for the send button state.
                const sendBtn = chatWidget.querySelector('.chat-send-btn');
                if (sendBtn) {
                    sendBtn.disabled = isTyping || !input.trim();
                }
            };
        }

        const chatInputForm = chatWidget.querySelector('.chat-input-form');
        if (chatInputForm) {
            chatInputForm.onsubmit = sendMessage;
        }

        // Scroll to bottom
        const bottomRefElement = chatWidget.querySelector('.bottom-ref');
        if (bottomRefElement) {
            bottomRefElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // --- Core Logic ---
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen && messages.length === 0) {
            messages.push({
                role: 'assistant',
                content: [initialWelcomeMessage || 'Hello! How can I help you today?']
            });
        }
        renderChatWindow();
    }

    async function sendMessage(e) {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            role: 'user',
            content: [input],
        };

        messages.push(userMsg);
        input = ''; // Clear input
        isTyping = true;
        renderChatWindow(); // Re-render to show user message and typing indicator

        try {
            const res = await fetch(`${NEXT_APP_BASE_URL}/api/chat/${botId}`, { // *** Use NEXT_APP_BASE_URL here! ***
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages.map(msg => ({ // Prepare messages for API
                        role: msg.role,
                        content: msg.content.join(' ')
                    })),
                    locale: (messages.some(m => m.role === 'assistant' && m.content.some(c => c.includes('tiếng Việt'))) ? 'vi' : 'en') // Simple heuristic
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Unknown API error' }));
                throw new Error(errorData.error || `API Error: ${res.status}`);
            }

            const data = await res.json();
            const { response, chunks } = data;

            const aiMsg = {
                role: 'assistant',
                content: chunks || [response || 'Sorry, I encountered an error. Please try again.'],
            };

            messages.push(aiMsg);

        } catch (err) {
            console.error('Chat error:', err);
            messages.push({ role: 'assistant', content: ['Sorry, I encountered an error. Please try again.'] });
        } finally {
            isTyping = false;
            renderChatWindow(); // Re-render after AI response or error
        }
    }

    // --- Initialize widget ---
    function initializeWidget() {
        const container = document.createElement('div');
        container.id = 'chat-widget-container';
        container.className = `chat-widget ${theme}`;
        document.body.appendChild(container);

        // Add styles dynamically (same as ChatWidget.tsx)
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
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
                background-color: #f8f9fa;
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
                background: #e9ecef;
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

            .chat-input-form {
                padding: 20px;
                border-top: 1px solid #e9ecef;
                display: flex;
                gap: 10px;
                background: white;
            }

            .chat-input-field {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid #ddd;
                border-radius: 25px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }

            .chat-input-field:focus {
                border-color: #667eea;
            }

            .chat-send-btn {
                padding: 12px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: opacity 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chat-send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .chat-send-btn:not(:disabled):hover {
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
        `;
        document.head.appendChild(styleTag);

        renderChatWindow(); // Initial render
    }

    // Run initialization when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWidget);
    } else {
        initializeWidget();
    }
})();