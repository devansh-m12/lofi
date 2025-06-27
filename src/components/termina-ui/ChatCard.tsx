'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  isUser: boolean;
}

export function ChatCard() {
  const { currentTheme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'COMMUNICATION MODULE INITIALIZED - READY FOR TRANSMISSION',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      isUser: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = event.key.toLowerCase();
      
      switch (key) {
        case 'c':
          if (event.ctrlKey || event.metaKey) return; // Let default copy work
          event.preventDefault();
          setIsMinimized(!isMinimized);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isMinimized]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      isUser: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate a response (you can replace this with actual chat logic)
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'MESSAGE RECEIVED - PROCESSING...',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        isUser: false
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  return (
    <div className="chat-card">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="header-title">CHAT MODULE</div>
        <div className="header-controls">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="control-btn"
          >
            {isMinimized ? '□' : '─'}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Message Buffer - HIGHLIGHTED SECTION */}
          <div className="message-buffer">
            <div className="buffer-header">MESSAGE BUFFER</div>
            <div className="messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className="message-line">
                  [{msg.timestamp}] {msg.isUser ? 'USER' : 'SYS'}: {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Section */}
          <div className="input-section">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="chat-input"
              placeholder="Enter message..."
              maxLength={100}
            />
            <button
              onClick={handleSendMessage}
              className="send-btn"
              disabled={inputMessage.trim() === ''}
            >
              SEND
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .chat-card {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 350px;
          max-height: 400px;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid var(--theme-border);
          color: var(--theme-text);
          font-family: var(--theme-font);
          font-size: 12px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          --theme-primary: ${currentTheme.colors.primary};
          --theme-secondary: ${currentTheme.colors.secondary};
          --theme-accent: ${currentTheme.colors.accent};
          --theme-background: ${currentTheme.colors.background};
          --theme-text: ${currentTheme.colors.text};
          --theme-border: ${currentTheme.colors.border};
          --theme-glow: ${currentTheme.colors.glow};
          --theme-muted: ${currentTheme.colors.muted};
          --theme-font: ${currentTheme.fonts.primary}, ${currentTheme.fonts.fallback.join(', ')};
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-bottom: 1px solid var(--theme-border);
          background: rgba(0, 0, 0, 0.8);
        }

        .header-title {
          font-size: 11px;
          color: var(--theme-primary);
          font-weight: bold;
        }

        .header-controls {
          display: flex;
          gap: 5px;
        }

        .control-btn {
          background: none;
          border: 1px solid var(--theme-border);
          color: var(--theme-text);
          width: 20px;
          height: 20px;
          cursor: pointer;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-btn:hover {
          background: var(--theme-primary);
          color: var(--theme-background);
        }

        /* HIGHLIGHTED MESSAGE BUFFER SECTION */
        .message-buffer {
          background: var(--theme-glow);
          border: 2px solid var(--theme-primary);
          box-shadow: 
            0 0 10px var(--theme-glow),
            inset 0 0 10px rgba(0, 0, 0, 0.3);
          margin: 8px;
          display: flex;
          flex-direction: column;
          max-height: 250px;
        }

        .buffer-header {
          background: var(--theme-primary);
          color: var(--theme-background);
          padding: 4px 8px;
          font-size: 10px;
          font-weight: bold;
          text-align: center;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
          min-height: 120px;
          max-height: 200px;
        }

        .message-line {
          margin: 2px 0;
          font-size: 10px;
          word-wrap: break-word;
          color: var(--theme-text);
        }

        .input-section {
          display: flex;
          gap: 8px;
          padding: 8px 12px;
          border-top: 1px solid var(--theme-border);
          background: rgba(0, 0, 0, 0.8);
        }

        .chat-input {
          flex: 1;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid var(--theme-border);
          color: var(--theme-text);
          padding: 6px 8px;
          font-size: 11px;
          font-family: var(--theme-font);
          outline: none;
        }

        .chat-input:focus {
          border-color: var(--theme-primary);
          box-shadow: 0 0 5px var(--theme-glow);
        }

        .chat-input::placeholder {
          color: var(--theme-muted);
          opacity: 0.6;
        }

        .send-btn {
          background: var(--theme-primary);
          color: var(--theme-background);
          border: none;
          padding: 6px 12px;
          font-size: 10px;
          cursor: pointer;
          font-family: var(--theme-font);
          font-weight: bold;
        }

        .send-btn:hover {
          background: var(--theme-accent);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: var(--theme-muted);
        }

        /* Scrollbar */
        .messages-container::-webkit-scrollbar {
          width: 4px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: var(--theme-primary);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .chat-card {
            width: calc(100vw - 40px);
            right: 20px;
            left: 20px;
            max-height: 350px;
          }

          .messages-container {
            min-height: 100px;
            max-height: 150px;
          }
        }
      `}</style>
    </div>
  );
} 