import { useState, useEffect, useRef } from 'react';

interface VisitorData {
  count: number;
  visitors: Array<{
    id: string;
    session_id: string;
    room_id: string;
    last_seen: string;
    created_at: string;
  }>;
}

interface UseVisitorTrackingOptions {
  roomId?: string;
  updateInterval?: number; // in seconds
  enabled?: boolean;
}

export function useVisitorTracking(options: UseVisitorTrackingOptions = {}) {
  const {
    roomId = 'general',
    updateInterval = 30, // Update presence every 30 seconds
    enabled = true
  } = options;

  const [visitorData, setVisitorData] = useState<VisitorData>({ count: 0, visitors: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sessionIdRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const presenceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate or get session ID
  const getSessionId = () => {
    if (!sessionIdRef.current) {
      // Try to get from sessionStorage first
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('visitor_session_id');
        if (stored) {
          sessionIdRef.current = stored;
        } else {
          sessionIdRef.current = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('visitor_session_id', sessionIdRef.current);
        }
      } else {
        sessionIdRef.current = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
    }
    return sessionIdRef.current;
  };

  // Register or update visitor presence
  const updatePresence = async () => {
    if (!enabled) return;
    
    try {
      const sessionId = getSessionId();
      
      const response = await fetch('/api/visitors/active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          roomId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update presence: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Presence updated:', result);
      
    } catch (err) {
      console.error('Error updating presence:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Get current visitor count
  const fetchVisitorCount = async () => {
    if (!enabled) return;
    
    try {
      const response = await fetch(`/api/visitors/active?roomId=${encodeURIComponent(roomId)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch visitor count: ${response.statusText}`);
      }

      const data = await response.json();
      setVisitorData(data);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching visitor count:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove visitor on cleanup
  const removeVisitor = async () => {
    if (!sessionIdRef.current || !enabled) return;
    
    try {
      const response = await fetch(`/api/visitors/active?sessionId=${encodeURIComponent(sessionIdRef.current)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        console.error('Failed to remove visitor:', response.statusText);
      }
      
    } catch (err) {
      console.error('Error removing visitor:', err);
    }
  };

  // Initialize visitor tracking
  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    // Initial presence registration and count fetch
    updatePresence();
    fetchVisitorCount();

    // Set up interval for updating presence
    presenceIntervalRef.current = setInterval(updatePresence, updateInterval * 1000);

    // Set up interval for fetching visitor count (less frequent)
    intervalRef.current = setInterval(fetchVisitorCount, (updateInterval + 10) * 1000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (presenceIntervalRef.current) {
        clearInterval(presenceIntervalRef.current);
      }
      removeVisitor();
    };
  }, [roomId, updateInterval, enabled]);

  // Handle page visibility change
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, consider removing visitor after a delay
        setTimeout(() => {
          if (document.hidden) {
            removeVisitor();
          }
        }, 5000); // 5 second delay
      } else {
        // Page is visible again, re-register presence
        updatePresence();
        fetchVisitorCount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  // Handle page unload
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      removeVisitor();
    };

    // Use both beforeunload and pagehide for better coverage
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, [enabled]);

  return {
    visitorCount: visitorData.count,
    visitors: visitorData.visitors,
    isLoading,
    error,
    sessionId: sessionIdRef.current,
    updatePresence,
    fetchVisitorCount,
  };
} 