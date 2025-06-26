"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Station, StationWithDuration, PlayerState } from "./types"
import { calculateCurrentTimestamp, loadYouTubeAPI } from "./utils/youtube"
import { STATIONS } from "./constants"

export function useYouTubePlayer(initialStation: Station) {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    volume: 70,
    isMuted: false,
    isLoading: true,
  })

  const [currentStation, setCurrentStation] = useState<StationWithDuration>({
    ...initialStation,
    duration: 86400 // Default 24 hours until we get real duration
  })
  const playerRef = useRef<any>(null)
  const [isAPIReady, setIsAPIReady] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const errorCountRef = useRef<number>(0)
  const lastErrorStationRef = useRef<string>("")
  const triedStationsRef = useRef<Set<string>>(new Set())
  const [isSkipping, setIsSkipping] = useState(false)

  // Helper function to check if player has required methods
  const isPlayerValid = useCallback(() => {
    return (
      playerRef.current &&
      typeof playerRef.current.playVideo === "function" &&
      typeof playerRef.current.pauseVideo === "function" &&
      typeof playerRef.current.seekTo === "function" &&
      typeof playerRef.current.setVolume === "function"
    )
  }, [])

  // Get video duration from YouTube API
  const getVideoDuration = useCallback(async (videoId: string): Promise<number> => {
    try {
      if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
        const duration = playerRef.current.getDuration()
        if (duration && duration > 0) {
          return duration
        }
      }
      // Fallback to 24 hours for live streams or if duration unavailable
      return 86400
    } catch (error) {
      console.warn('Could not get video duration, using default 24h')
      return 86400
    }
  }, [])

  // Auto-skip to next station if current one fails
  const skipToNextStation = useCallback(async (isAutoSkip = false) => {
    if (isAutoSkip && triedStationsRef.current.size >= STATIONS.length) {
      console.error('All stations failed, resetting and trying again...')
      triedStationsRef.current.clear()
    }

    const currentIndex = STATIONS.findIndex(station => station.id === currentStation.id)
    let nextIndex = (currentIndex + 1) % STATIONS.length
    let nextStation = STATIONS[nextIndex]

    // If auto-skipping, find a station we haven't tried yet
    if (isAutoSkip) {
      let attempts = 0
      while (triedStationsRef.current.has(nextStation.id) && attempts < STATIONS.length) {
        nextIndex = (nextIndex + 1) % STATIONS.length
        nextStation = STATIONS[nextIndex]
        attempts++
      }
    }
    
    console.log(`🎵 Skipping from ${currentStation.name} to ${nextStation.name}`)
    setIsSkipping(true)
    
    // Get duration and update station
    const duration = await getVideoDuration(nextStation.videoId)
    const stationWithDuration: StationWithDuration = {
      ...nextStation,
      duration
    }
    
    setCurrentStation(stationWithDuration)
    
    // Reset error count for new station
    errorCountRef.current = 0
    lastErrorStationRef.current = nextStation.id
    
    if (isAutoSkip) {
      triedStationsRef.current.add(nextStation.id)
    } else {
      // Manual skip resets the tried stations
      triedStationsRef.current.clear()
      triedStationsRef.current.add(nextStation.id)
    }
    
    setTimeout(() => setIsSkipping(false), 1000)
  }, [currentStation.id, currentStation.name, getVideoDuration])

  // Handle player errors with auto-skip
  const handlePlayerError = useCallback((errorCode: number) => {
    const errorMessages: { [key: number]: string } = {
      2: "Invalid video ID",
      5: "HTML5 player error", 
      100: "Video not found or private",
      101: "Video unavailable in your region",
      150: "Video unavailable or restricted"
    }
    
    const errorMsg = errorMessages[errorCode] || `Unknown error (${errorCode})`
    console.warn(`🎵 Station "${currentStation.name}" unavailable: ${errorMsg}`)
    
    // Only auto-skip if this is a new error for this station
    if (lastErrorStationRef.current !== currentStation.id) {
      errorCountRef.current = 0
      lastErrorStationRef.current = currentStation.id
    }
    
    errorCountRef.current++
    
    // Skip immediately for known "video unavailable" errors, or after 1 retry for others
    const shouldSkipImmediately = [100, 101, 150].includes(errorCode)
    const skipThreshold = shouldSkipImmediately ? 1 : 2
    
    if (errorCountRef.current >= skipThreshold) {
      console.log(`🎵 Auto-skipping to next station...`)
      setTimeout(() => {
        skipToNextStation(true) // Mark as auto-skip
      }, 500) // Even shorter delay for auto-skip
    }
    
    setPlayerState((prev: PlayerState) => ({ ...prev, isLoading: false }))
  }, [currentStation.id, currentStation.name, skipToNextStation])

  // Load YouTube API
  useEffect(() => {
    loadYouTubeAPI()
      .then(() => {
        console.log("YouTube API loaded successfully")
        setIsAPIReady(true)
      })
      .catch((error: Error) => {
        console.error("Failed to load YouTube API:", error)
        setPlayerState((prev: PlayerState) => ({ ...prev, isLoading: false }))
      })
  }, [])

  // Initialize player
  useEffect(() => {
    if (!isAPIReady) return

    const syncTime = calculateCurrentTimestamp(currentStation.duration)
    console.log("Initializing player with sync time:", syncTime)

    try {
      // Clean up existing player
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy()
      }

      playerRef.current = new (window as any).YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: currentStation.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          start: Math.floor(syncTime),
        },
        events: {
          onReady: (event: any) => {
            console.log("Player ready event fired")
            setIsPlayerReady(true)

            // Wait a bit more to ensure all methods are available
            setTimeout(() => {
              if (isPlayerValid()) {
                try {
                  playerRef.current.seekTo(syncTime, true)
                  playerRef.current.setVolume(playerState.volume)
                  
                  // Get and update duration from API
                  setTimeout(async () => {
                    try {
                      const duration = await getVideoDuration(currentStation.videoId)
                      setCurrentStation(prev => ({ ...prev, duration }))
                    } catch (error) {
                      console.warn('Could not update duration:', error)
                    }
                  }, 2000)
                  
                  setPlayerState((prev: PlayerState) => ({ ...prev, currentTime: syncTime, isLoading: false }))
                  console.log("Player initialized successfully")
                  
                  // Mark this station as working
                  triedStationsRef.current.add(currentStation.id)
                } catch (error) {
                  console.error("Error in onReady callback:", error)
                }
              } else {
                console.error("Player methods not available after ready event")
              }
            }, 500)
          },
          onStateChange: (event: any) => {
            const YT = (window as any).YT
            console.log("Player state changed:", event.data)

            if (event.data === YT.PlayerState.PLAYING) {
              setPlayerState((prev: PlayerState) => ({ ...prev, isPlaying: true, isLoading: false }))
            } else if (event.data === YT.PlayerState.PAUSED) {
              setPlayerState((prev: PlayerState) => ({ ...prev, isPlaying: false }))
            } else if (event.data === YT.PlayerState.BUFFERING) {
              setPlayerState((prev: PlayerState) => ({ ...prev, isLoading: true }))
            } else if (event.data === YT.PlayerState.CUED) {
              setPlayerState((prev: PlayerState) => ({ ...prev, isLoading: false }))
            }
          },
          onError: (event: any) => {
            handlePlayerError(event.data)
          },
        },
      })
    } catch (error) {
      console.error("Error initializing YouTube player:", error)
      setPlayerState((prev: PlayerState) => ({ ...prev, isLoading: false }))
    }

    // Cleanup function
    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy()
        } catch (error) {
          console.error("Error destroying player:", error)
        }
      }
    }
  }, [isAPIReady, currentStation.videoId, isPlayerValid])

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlayerValid() && playerState.isPlaying && isPlayerReady) {
        try {
          const time = playerRef.current.getCurrentTime()
          if (typeof time === "number" && !isNaN(time)) {
            setPlayerState((prev: PlayerState) => ({ ...prev, currentTime: time }))
          }
        } catch (error) {
          console.error("Error getting current time:", error)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [playerState.isPlaying, isPlayerReady, isPlayerValid])

  const play = useCallback(() => {
    if (!isPlayerValid() || !isPlayerReady) {
      console.log("Player not ready for play")
      return
    }

    try {
      // Resync when playing
      const syncTime = calculateCurrentTimestamp(currentStation.duration)
      playerRef.current.seekTo(syncTime, true)
      playerRef.current.playVideo()
      console.log("Play command executed")
    } catch (error) {
      console.error("Error playing video:", error)
    }
  }, [currentStation.duration, isPlayerReady, isPlayerValid])

  const pause = useCallback(() => {
    if (!isPlayerValid() || !isPlayerReady) {
      console.log("Player not ready for pause")
      return
    }

    try {
      playerRef.current.pauseVideo()
      console.log("Pause command executed")
    } catch (error) {
      console.error("Error pausing video:", error)
    }
  }, [isPlayerReady, isPlayerValid])

  const togglePlay = useCallback(() => {
    if (playerState.isPlaying) {
      pause()
    } else {
      play()
    }
  }, [playerState.isPlaying, play, pause])

  const setVolume = useCallback(
    (volume: number) => {
      if (!isPlayerValid() || !isPlayerReady) {
        console.log("Player not ready for volume change")
        return
      }

      try {
        playerRef.current.setVolume(volume)
        setPlayerState((prev: PlayerState) => ({ ...prev, volume }))
        console.log("Volume set to:", volume)
      } catch (error) {
        console.error("Error setting volume:", error)
      }
    },
    [isPlayerReady, isPlayerValid],
  )

  const toggleMute = useCallback(() => {
    if (!isPlayerValid() || !isPlayerReady) {
      console.log("Player not ready for mute toggle")
      return
    }

    try {
      if (playerState.isMuted) {
        if (typeof playerRef.current.unMute === "function") {
          playerRef.current.unMute()
          playerRef.current.setVolume(playerState.volume)
        }
      } else {
        if (typeof playerRef.current.mute === "function") {
          playerRef.current.mute()
        }
      }
      setPlayerState((prev: PlayerState) => ({ ...prev, isMuted: !prev.isMuted }))
      console.log("Mute toggled")
    } catch (error) {
      console.error("Error toggling mute:", error)
    }
  }, [playerState.isMuted, playerState.volume, isPlayerReady, isPlayerValid])

  const switchStation = useCallback(
    async (station: Station) => {
      if (station.id === currentStation.id) {
        console.log("Same station selected, ignoring")
        return
      }

      console.log("🎵 Switching to station:", station.name)
      setIsSkipping(true)
      
      // Get duration and create station with duration
      const duration = await getVideoDuration(station.videoId)
      const stationWithDuration: StationWithDuration = {
        ...station,
        duration
      }
      
      setCurrentStation(stationWithDuration)
      setPlayerState((prev: PlayerState) => ({ ...prev, isPlaying: false, isLoading: true }))
      
      // Reset error tracking
      errorCountRef.current = 0
      triedStationsRef.current.clear()
      triedStationsRef.current.add(station.id)
      
      setTimeout(() => setIsSkipping(false), 1000)

      // If player is not ready, the useEffect will handle initialization
      if (!isPlayerValid() || !isPlayerReady) {
        console.log("Player not ready, will initialize with new station")
        return
      }

      try {
        const syncTime = calculateCurrentTimestamp(stationWithDuration.duration)
        console.log("Loading new video with sync time:", syncTime)

        // Use loadVideoById if available, otherwise fall back to cueVideoById
        if (typeof playerRef.current.loadVideoById === "function") {
          playerRef.current.loadVideoById({
            videoId: stationWithDuration.videoId,
            startSeconds: Math.floor(syncTime),
          })
        } else if (typeof playerRef.current.cueVideoById === "function") {
          playerRef.current.cueVideoById({
            videoId: stationWithDuration.videoId,
            startSeconds: Math.floor(syncTime),
          })

          // Wait for the video to be cued, then seek
          setTimeout(() => {
            if (isPlayerValid()) {
              try {
                playerRef.current.seekTo(syncTime, true)
                setPlayerState((prev: PlayerState) => ({ ...prev, currentTime: syncTime, isLoading: false }))
              } catch (error) {
                console.error("Error seeking after cue:", error)
                setPlayerState((prev: PlayerState) => ({ ...prev, isLoading: false }))
              }
            }
          }, 1000)
        } else {
          console.error("No video loading methods available")
          setPlayerState((prev: PlayerState) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error("Error switching station:", error)
        setPlayerState((prev: PlayerState) => ({ ...prev, isLoading: false }))
      }
    },
    [currentStation.id, isPlayerReady, isPlayerValid, getVideoDuration],
  )

  // Manual station navigation
  const nextStation = useCallback(() => {
    skipToNextStation(false) // Manual skip
  }, [skipToNextStation])

  const previousStation = useCallback(async () => {
    const currentIndex = STATIONS.findIndex(station => station.id === currentStation.id)
    const prevIndex = currentIndex === 0 ? STATIONS.length - 1 : currentIndex - 1
    const prevStation = STATIONS[prevIndex]
    
    console.log(`🎵 Going back from ${currentStation.name} to ${prevStation.name}`)
    setIsSkipping(true)
    
    // Get duration and update station
    const duration = await getVideoDuration(prevStation.videoId)
    const stationWithDuration: StationWithDuration = {
      ...prevStation,
      duration
    }
    
    setCurrentStation(stationWithDuration)
    errorCountRef.current = 0
    triedStationsRef.current.clear()
    triedStationsRef.current.add(prevStation.id)
    
    setTimeout(() => setIsSkipping(false), 1000)
  }, [currentStation.id, currentStation.name, getVideoDuration])

  return {
    playerState,
    currentStation,
    togglePlay,
    play,
    pause,
    setVolume,
    toggleMute,
    switchStation,
    nextStation,
    previousStation,
    isSkipping,
    isAPIReady: isAPIReady && isPlayerReady,
  }
}
