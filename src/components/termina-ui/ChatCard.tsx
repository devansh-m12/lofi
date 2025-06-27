'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { useChat, ChatMessage } from '../../lib/useChat';

export function ChatCard() {
  const { currentTheme } = useTheme();
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [userName, setUserName] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize username from localStorage or generate a random one
  useEffect(() => {
    const savedUsername = localStorage.getItem('chat-username');
    if (savedUsername) {
      setUserName(savedUsername);
      setIsUsernameSet(true);
    } else {
      const randomUsername = `User_${Math.random().toString(36).substring(2, 8)}`;
      setUserName(randomUsername);
    }
  }, []);

  const { messages, loading, error, connected, sendMessage, testConnection } = useChat({
    roomId: 'general',
    userName: userName || 'Anonymous',
  });

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

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !isUsernameSet) return;

    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUsernameSubmit = () => {
    if (userName.trim() === '') return;
    
    localStorage.setItem('chat-username', userName);
    setIsUsernameSet(true);
  };

  const handleUsernameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUsernameSubmit();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chat-username');
    setIsUsernameSet(false);
    setUserName('');
    // Generate new random username
    const randomUsername = `User_${Math.random().toString(36).substring(2, 8)}`;
    setUserName(randomUsername);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConnectionStatus = () => {
    if (loading) return 'CONNECTING...';
    if (error) return 'CONNECTION ERROR';
    if (!connected) return 'DISCONNECTED';
    return 'LIVE';
  };

  const getStatusColor = () => {
    if (loading) return 'var(--theme-accent)';
    if (error || !connected) return '#ff4444';
    return '#00ff00';
  };

  return (
    <div className="chat-card">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="header-title">
          <span>LIVE CHAT MODULE</span>
          <span className="status-indicator" style={{ color: getStatusColor() }}>
            {getConnectionStatus()}
          </span>
        </div>
        <div className="header-controls">
          {isUsernameSet && (
            <button
              onClick={handleLogout}
              className="control-btn logout-btn"
              title="Logout"
            >
              ↪
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="control-btn"
            title="Minimize/Maximize"
          >
            {isMinimized ? '□' : '─'}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Username Setup */}
          {!isUsernameSet && (
            <div className="username-setup">
              <div className="setup-header">SET USERNAME</div>
              <div className="setup-content">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={handleUsernameKeyPress}
                  className="username-input"
                  placeholder="Enter your username..."
                  maxLength={20}
                />
                <button
                  onClick={handleUsernameSubmit}
                  className="setup-btn"
                  disabled={userName.trim() === ''}
                >
                  CONNECT
                </button>
                {/* <div className="connection-test">
                  <button
                    onClick={async () => {
                      const isConnected = await testConnection();
                      alert(isConnected ? 'Connection OK!' : 'Connection Failed!');
                    }}
                    className="test-btn"
                  >
                    TEST CONNECTION
                  </button>
                </div> */}
              </div>
            </div>
          )}

          {/* User Info */}
          {isUsernameSet && (
            <div className="user-info">
              <span>Logged in as: <strong>{userName}</strong></span>
            </div>
          )}

          {/* Message Buffer */}
          {isUsernameSet && (
            <div className="message-buffer">
              <div className="buffer-header">
                MESSAGE BUFFER - {messages.length} MSGS
                {error && <span className="error-indicator"> [ERROR]</span>}
                {!connected && !loading && <span className="warning-indicator"> [OFFLINE]</span>}
              </div>
              <div className="messages-container">
                {loading && messages.length === 0 ? (
                  <div className="loading-msg">LOADING CHAT HISTORY...</div>
                ) : messages.length === 0 ? (
                  <div className="empty-msg">No messages yet. Start the conversation!</div>
                ) : (
                  messages.map((msg: ChatMessage) => (
                    <div key={msg.id} className="message-line">
                      [{formatTimestamp(msg.created_at)}] <span className="username">{msg.user_name}</span>: {msg.message}
                    </div>
                  ))
                )}
                {error && (
                  <div className="error-msg">
                    CONNECTION ERROR: {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input Section */}
          {isUsernameSet && (
            <div className="input-section">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="chat-input"
                placeholder="Type your message..."
                maxLength={500}
                disabled={loading || !!error}
              />
              <button
                onClick={handleSendMessage}
                className="send-btn"
                disabled={inputMessage.trim() === '' || loading || !!error}
              >
                SEND
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .chat-card {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 400px;
          max-height: 500px;
          background: rgba(0, 0, 0, 0.95);
          border: 1px solid var(--theme-border);
          color: var(--theme-text);
          font-family: var(--theme-font);
          font-size: 14px;
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
          font-size: 13px;
          color: var(--theme-primary);
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-indicator {
          font-size: 9px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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

        .logout-btn {
          background: rgba(255, 68, 68, 0.2);
          border-color: #ff4444;
        }

        .logout-btn:hover {
          background: #ff4444;
          color: white;
        }

        /* User Info */
        .user-info {
          padding: 6px 12px;

          border-bottom: 1px solid var(--theme-border);
          font-size: 12px;
          color: var(--theme-text);
        }

        /* Username Setup Section */
        .username-setup {
          background: var(--theme-secondary);
          border: 2px solid var(--theme-accent);
          margin: 8px;
          display: flex;
          flex-direction: column;
        }

        .setup-header {
          background: var(--theme-primary);
          color: var(--theme-background);
          padding: 4px 8px;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
        }

        .setup-content {
          padding: 12px;
          display: flex;
          gap: 8px;
          flex-direction: column;
        }

        .username-input {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid var(--theme-border);
          color: var(--theme-text);
          padding: 8px;
          font-size: 14px;
          font-family: var(--theme-font);
          outline: none;
        }

        .username-input:focus {
          border-color: var(--theme-primary);
          box-shadow: 0 0 5px var(--theme-glow);
        }

        .setup-btn, .test-btn {
          background: var(--theme-primary);
          color: var(--theme-background);
          border: none;
          padding: 8px 12px;
          font-size: 13px;
          cursor: pointer;
          font-family: var(--theme-font);
          font-weight: bold;
        }

        .test-btn {
          background: var(--theme-accent);
          font-size: 9px;
          padding: 6px 10px;
        }

        .setup-btn:hover, .test-btn:hover {
          opacity: 0.8;
        }

        .setup-btn:disabled, .test-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: var(--theme-muted);
        }

        .connection-test {
          text-align: center;
        }

        /* Message Buffer Section */
        .message-buffer {
          background: var(--theme-glow);
          border: 2px solid var(--theme-primary);
          box-shadow: 
            0 0 10px var(--theme-glow),
            inset 0 0 10px rgba(0, 0, 0, 0.3);
          margin: 8px;
          display: flex;
          flex-direction: column;
          max-height: 300px;
        }

        .buffer-header {
          background: var(--theme-primary);
          color: var(--theme-background);
          padding: 4px 8px;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .error-indicator {
          color: #ff4444;
          animation: blink 1s infinite;
        }

        .warning-indicator {
          color: #ffaa00;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
          min-height: 150px;
          max-height: 240px;
        }

        .message-line {
          margin: 2px 0;
          font-size: 12px;
          word-wrap: break-word;
          color: var(--theme-text);
          line-height: 1.3;
        }

        .username {
          color: var(--theme-accent);
          font-weight: bold;
        }

        .loading-msg, .error-msg, .empty-msg {
          color: var(--theme-accent);
          font-style: italic;
          text-align: center;
          padding: 10px;
        }

        .error-msg {
          color: #ff4444;
          background: rgba(255, 68, 68, 0.1);
          border: 1px solid #ff4444;
          margin: 4px 0;
        }

        .empty-msg {
          color: var(--theme-muted);
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
          font-size: 13px;
          font-family: var(--theme-font);
          outline: none;
        }

        .chat-input:focus {
          border-color: var(--theme-primary);
          box-shadow: 0 0 5px var(--theme-glow);
        }

        .chat-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
          font-size: 12px;
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
            max-height: 450px;
          }

          .messages-container {
            min-height: 120px;
            max-height: 200px;
          }
        }
      `}</style>
    </div>
  );
} 