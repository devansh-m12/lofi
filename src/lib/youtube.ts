import { SYNC_START_TIME } from "@/lib/constants"

export function calculateCurrentTimestamp(duration: number): number {
  const now = Date.now()
  const elapsed = (now - SYNC_START_TIME) / 1000 // Convert to seconds
  return elapsed % duration
}

export function getYouTubeThumbnail(
  videoId: string,
  quality: "default" | "medium" | "high" | "standard" | "maxres" = "maxres",
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if API is already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      resolve()
      return
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      // Wait for the API to be ready
      const checkAPI = () => {
        if ((window as any).YT && (window as any).YT.Player) {
          resolve()
        } else {
          setTimeout(checkAPI, 100)
        }
      }
      checkAPI()
      return
    }

    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    tag.onerror = () => reject(new Error("Failed to load YouTube API"))

    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    ;(window as any).onYouTubeIframeAPIReady = () => {
      resolve()
    }

    // Fallback timeout
    setTimeout(() => {
      if (!(window as any).YT || !(window as any).YT.Player) {
        reject(new Error("YouTube API failed to load within timeout"))
      }
    }, 10000)
  })
}
