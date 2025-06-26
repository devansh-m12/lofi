export interface Station {
    id: string
    name: string
    videoId: string
    genre: string
    description: string
    color: string
  }

  export interface StationWithDuration extends Station {
    duration: number // Duration in seconds (fetched from API)
  }
  
  export interface PlayerState {
    isPlaying: boolean
    currentTime: number
    volume: number
    isMuted: boolean
    isLoading: boolean
  }
  
  export interface YouTubePlayer {
    playVideo: () => void
    pauseVideo: () => void
    seekTo: (seconds: number, allowSeekAhead: boolean) => void
    setVolume: (volume: number) => void
    mute: () => void
    unMute: () => void
    getCurrentTime: () => number
    loadVideoById: (options: { videoId: string; startSeconds: number }) => void
    getPlayerState: () => number
  }

  // Theme system types
  export interface Theme {
    id: string
    name: string
    story: string
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
      text: string
      border: string
      glow: string
      muted: string
    }
    fonts: {
      primary: string
      fallback: string[]
    }
    effects: {
      scanlines: boolean
      glow: boolean
      animations: string[]
    }
    ascii: {
      header: string[]
      footer: string
    }
  }
  