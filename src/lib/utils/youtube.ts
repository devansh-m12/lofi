// YouTube API utilities for synchronized playback

// Reference time for global synchronization (January 1, 2025)
const SYNC_ORIGIN_TIME = new Date('2025-01-01T00:00:00Z').getTime()

/**
 * Calculate the current timestamp that all users should be synchronized to
 * Based on elapsed time since the origin point
 */
export function calculateCurrentTimestamp(videoDuration: number): number {
  const now = Date.now()
  const elapsedSinceOrigin = (now - SYNC_ORIGIN_TIME) / 1000 // Convert to seconds
  const currentPosition = elapsedSinceOrigin % videoDuration
  return currentPosition
}

/**
 * Load the YouTube IFrame API
 * Returns a promise that resolves when the API is ready
 */
export function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      resolve()
      return
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error('YouTube API loading timeout'))
      }, 10000)
      return
    }

    // Create script tag
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    
    // Set up global callback
    window.onYouTubeIframeAPIReady = () => {
      resolve()
    }
    
    script.onerror = () => {
      reject(new Error('Failed to load YouTube API'))
    }
    
    document.head.appendChild(script)
  })
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
} 