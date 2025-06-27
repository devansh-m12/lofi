import { useState, useEffect, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  message: string;
  created_at: string;
  user_name: string;
  user_id?: string;
  room_id: string;
}

interface UseChatOptions {
  roomId?: string;
  userName: string;
}

export function useChat({ roomId = 'general', userName }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Load initial messages from API
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading messages for room:', roomId);
      
      const response = await fetch(`/api/chat/messages?roomId=${roomId}&limit=50`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setMessages(data.messages || []);
      setConnected(true);
      reconnectAttempts.current = 0; // Reset on successful load
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Send a new message via API
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    try {
      setError(null);
      
      console.log('Sending message:', { message, userName, roomId });
      
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          userName,
          roomId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Message will be added via real-time update
      console.log('Message sent successfully:', data.message);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, [userName, roomId]);

  // Clean up existing connection
  const cleanupConnection = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Set up Server-Sent Events for real-time updates
  const setupRealtime = useCallback(() => {
    cleanupConnection();

    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      setError('Unable to establish real-time connection after multiple attempts');
      return;
    }

    try {
      console.log(`Setting up real-time connection for room: ${roomId} (attempt ${reconnectAttempts.current + 1})`);
      
      const eventSource = new EventSource(`/api/chat/realtime?roomId=${roomId}`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('Real-time connection opened');
        setConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle different message types
          if (data.type === 'connected') {
            console.log('Real-time connection established');
            return;
          }
          
          if (data.type === 'subscribed') {
            console.log('Subscribed to real-time updates');
            return;
          }
          
          // Handle actual chat messages
          if (data.id && data.message) {
            const newMessage = data as ChatMessage;
            console.log('Received new message:', newMessage);
            
            setMessages((prev) => {
              // Avoid duplicates by checking if message already exists
              if (prev.some(msg => msg.id === newMessage.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
          }
        } catch (err) {
          console.error('Failed to parse message:', err, 'Raw data:', event.data);
        }
      };

      eventSource.onerror = (event) => {
        console.error('EventSource error:', event);
        setConnected(false);
        
        // Close the current connection
        eventSource.close();
        
        // Attempt to reconnect with exponential backoff
        reconnectAttempts.current++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current - 1), 10000);
        
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setError(`Connection lost. Reconnecting in ${delay / 1000}s... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setupRealtime();
          }, delay);
        } else {
          setError('Real-time connection failed. Please refresh the page.');
        }
      };
    } catch (err) {
      console.error('Failed to setup real-time connection:', err);
      setError('Failed to setup real-time connection');
      setConnected(false);
    }
  }, [roomId, cleanupConnection]);

  // Initialize chat
  useEffect(() => {
    loadMessages();
    setupRealtime();

    return () => {
      cleanupConnection();
    };
  }, [loadMessages, setupRealtime, cleanupConnection]);

  // Test connection function
  const testConnection = useCallback(async () => {
    try {
      const response = await fetch('/api/chat/messages?roomId=test&limit=1');
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  return {
    messages,
    loading,
    error,
    connected,
    sendMessage,
    refreshMessages: loadMessages,
    testConnection,
  };
} 