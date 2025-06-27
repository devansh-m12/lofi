'use client';

import { useState, useEffect } from 'react';
import { useYouTubePlayer } from '../../lib/useYoutubePlayer';
import { STATIONS } from '../../lib/constants';
import type { Station } from '../../lib/types';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { ThemeSelector } from './ThemeSelector';
import { ChatCard } from './ChatCard';

const DEFAULT_STATION = STATIONS[0];

function TerminalUI() {
  const { currentTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [showStations, setShowStations] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  const {
    playerState,
    currentStation,
    togglePlay,
    play,
    setVolume,
    toggleMute,
    switchStation,
    nextStation,
    previousStation,
    isSkipping,
    isAPIReady,
  } = useYouTubePlayer(DEFAULT_STATION);

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-play when ready
  useEffect(() => {
    if (isAPIReady && isMounted && !playerState.isPlaying) {
      setTimeout(() => {
        play();
      }, 1000);
    }
  }, [isAPIReady, isMounted, play, playerState.isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = event.key.toLowerCase();
      
      switch (key) {
        case 'p':
          event.preventDefault();
          if (isAPIReady) {
            console.log('Keyboard: P pressed - Toggle Play');
            togglePlay();
          }
          break;
        case 'n':
          event.preventDefault();
          if (isAPIReady && !isSkipping) {
            console.log('Keyboard: N pressed - Next Station');
            nextStation();
          }
          break;
        case 'b':
          event.preventDefault();
          if (isAPIReady && !isSkipping) {
            console.log('Keyboard: B pressed - Previous Station');
            previousStation();
          }
          break;
        case 'm':
          event.preventDefault();
          if (isAPIReady) {
            console.log('Keyboard: M pressed - Toggle Mute');
            toggleMute();
          }
          break;
        case 's':
          event.preventDefault();
          if (isAPIReady) {
            console.log('Keyboard: S pressed - Toggle Stations');
            setShowStations(!showStations);
          }
          break;
        case 't':
          event.preventDefault();
          if (isAPIReady) {
            console.log('Keyboard: T pressed - Toggle Themes');
            // Theme switching handled by ThemeSelector component
          }
          break;
        case 'q':
          event.preventDefault();
          if (isAPIReady && playerState.isPlaying) {
            console.log('Keyboard: Q pressed - Pause/Stop');
            togglePlay();
          }
          break;
        case '+':
        case '=':
          event.preventDefault();
          if (isAPIReady && playerState.volume < 100) {
            console.log('Keyboard: + pressed - Volume Up');
            setVolume(Math.min(100, playerState.volume + 10));
          }
          break;
        case '-':
          event.preventDefault();
          if (isAPIReady && playerState.volume > 0) {
            console.log('Keyboard: - pressed - Volume Down');
            setVolume(Math.max(0, playerState.volume - 10));
          }
          break;
        default:
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isAPIReady, isSkipping, showStations, playerState.isPlaying, playerState.volume, togglePlay, nextStation, previousStation, toggleMute, setVolume]);

  const getStatusLine = () => {
    if (!isMounted) return 'SYSTEM INITIALIZING...';
    if (isSkipping) return 'SWITCHING FREQUENCY...';
    if (!isAPIReady) return 'LOADING TRANSMITTER...';
    if (playerState.isPlaying) return 'SIGNAL LOCKED - BROADCASTING';
    return 'READY FOR TRANSMISSION';
  };

  const getVolumeBar = () => {
    const bars = Math.floor(playerState.volume / 10);
    return '[' + '█'.repeat(bars) + '░'.repeat(10 - bars) + ']';
  };

  return (
    <div className="app-container">
      {/* Hidden YouTube player */}
      {isMounted && (
        <div id="youtube-player" className="absolute top-0 left-0 opacity-0 pointer-events-none w-0 h-0"></div>
      )}

      {/* Background with video thumbnail */}
      <div className="background">
        <div 
          className="background-image"
          style={{
            backgroundImage: `url('https://img.youtube.com/vi/${currentStation.videoId}/maxresdefault.jpg')`
          }}
        ></div>
        <div className="background-overlay"></div>
        <div className="scanlines"></div>
      </div>

      {/* Terminal Card */}
      <div className="terminal-card">
        {/* Theme Control Panel - Top Right */}
        <div className="theme-control-panel">
          <div className="theme-info">
            <span className="theme-name">THEME: {currentTheme.name.toUpperCase()}</span>
            <span className="theme-shortcut">[T] TOGGLE</span>
          </div>
          <ThemeSelector />
        </div>

        {/* Terminal Header */}
        <div className="terminal-header">
          {currentTheme.ascii.header.map((line, index) => (
            <div key={index} className="header-line">
              {line}
            </div>
          ))}
        </div>

        {/* Main Terminal Window */}
        <div className="terminal-window">
          <div className="window-border">
            ┌─ SYSTEM STATUS ────────────────────────────────────────────────────────────┐
          </div>
          
          {/* Status Display */}
          <div className="status-section">
            <div className="status-line">
              │ TIME: {currentTime}     STATUS: {getStatusLine()}
            </div>
            <div className="status-line">
              │ FREQ: {currentStation.genre.toUpperCase()}     SIGNAL: {playerState.isPlaying ? '●●●●●' : '○○○○○'}
            </div>
            <div className="status-line">
              │ STATION: {currentStation.name.toUpperCase()}
            </div>
            <div className="status-line">
              │ API_READY: {isAPIReady ? 'YES' : 'NO'}     MOUNTED: {isMounted ? 'YES' : 'NO'}
            </div>
          </div>

          <div className="window-border">
            ├─ CONTROLS ────────────────────────────────────────────────────────────────┤
          </div>

          {/* Transport Controls */}
          <div className="controls-section">
            <div className="control-line">
              │ KEYBOARD: [P] PLAY/PAUSE  [N] NEXT  [B] PREV  [M] MUTE  [S] STATIONS
            </div>
            <div className="control-line">
              │ VOLUME: [+] UP  [-] DOWN  [T] THEMES  [Q] QUIT  MOUSE: CLICK BELOW
            </div>
            <div className="control-line">
              │ 
            </div>
            <div className="control-buttons">
              │ 
              <button
                onClick={() => {
                  console.log('Play button clicked, isAPIReady:', isAPIReady);
                  togglePlay();
                }}
                className="terminal-btn"
                disabled={!isAPIReady}
              >
                {playerState.isPlaying ? '[■] PAUSE' : '[►] PLAY'}
              </button>
              
              <button
                onClick={previousStation}
                className="terminal-btn"
                disabled={!isAPIReady || isSkipping}
              >
                [◄◄] PREV
              </button>
              
              <button
                onClick={nextStation}
                className="terminal-btn"
                disabled={!isAPIReady || isSkipping}
              >
                [►►] NEXT
              </button>
              
              <button
                onClick={toggleMute}
                className="terminal-btn"
                disabled={!isAPIReady}
              >
                {playerState.isMuted ? '[♪] UNMUTE' : '[♫] MUTE'}
              </button>
            </div>
          </div>

          <div className="window-border">
            ├─ AUDIO LEVELS ───────────────────────────────────────────────────────────┤
          </div>

          {/* Volume Control */}
          <div className="volume-section">
            <div className="volume-line">
              │ VOLUME: {playerState.volume.toString().padStart(3, ' ')}% {getVolumeBar()}
            </div>
            <div className="volume-controls">
              │ 
              <button
                onClick={() => {
                  console.log('Volume down clicked, isAPIReady:', isAPIReady, 'currentVolume:', playerState.volume);
                  setVolume(Math.max(0, playerState.volume - 10));
                }}
                className="terminal-btn"
                disabled={!isAPIReady || playerState.volume === 0}
              >
                [-] DOWN
              </button>
              
              <button
                onClick={() => setVolume(Math.min(100, playerState.volume + 10))}
                className="terminal-btn"
                disabled={!isAPIReady || playerState.volume === 100}
              >
                [+] UP
              </button>
            </div>
          </div>

          <div className="window-border">
            ├─ STATION SELECT ─────────────────────────────────────────────────────────┤
          </div>

          {/* Station Selector */}
          <div className="station-section">
            <div className="station-header">
              │ 
              <button
                onClick={() => setShowStations(!showStations)}
                className="terminal-btn"
                disabled={!isAPIReady}
              >
                [S] {showStations ? 'HIDE' : 'SHOW'} STATIONS
              </button>
            </div>
            
            {showStations && (
              <div className="station-list">
                {STATIONS.map((station, index) => (
                  <div key={station.id} className="station-item">
                    <div className="station-line">
                      │ [{index + 1}] 
                      <button
                        onClick={() => {
                          switchStation(station);
                          setShowStations(false);
                        }}
                        className={`station-btn ${currentStation.id === station.id ? 'active' : ''}`}
                        disabled={!isAPIReady}
                      >
                        {station.name.toUpperCase()} - {station.description.toUpperCase()}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="window-border">
            └───────────────────────────────────────────────────────────────────────────┘
          </div>
        </div>

        {/* Footer */}
        <div className="terminal-footer">
          <div className="footer-line">
            {currentTheme.ascii.footer}
          </div>
        </div>
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-x: auto;
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

        .background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .background-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: brightness(0.8) contrast(1.4) saturate(0.7);
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          image-rendering: -webkit-optimize-contrast;
        }

        .background-image::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 4px,
              rgba(0, 0, 0, 0.3) 4px,
              rgba(0, 0, 0, 0.3) 8px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 4px,
              rgba(0, 0, 0, 0.3) 4px,
              rgba(0, 0, 0, 0.3) 8px
            );
          pointer-events: none;
        }

        .background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(0, 255, 0, 0.05) 0%, transparent 50%);
        }

        .scanlines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 255, 0, 0.08) 1px,
              rgba(0, 255, 0, 0.08) 2px,
              transparent 2px,
              transparent 3px,
              rgba(0, 0, 0, 0.4) 3px,
              rgba(0, 0, 0, 0.4) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 0, 0.04) 2px,
              rgba(0, 255, 0, 0.04) 4px,
              transparent 4px,
              transparent 6px,
              rgba(0, 0, 0, 0.2) 6px,
              rgba(0, 0, 0, 0.2) 8px
            );
          animation: scanline 0.1s linear infinite;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          image-rendering: -webkit-optimize-contrast;
        }

        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        .terminal-card {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid var(--theme-border);
          border-radius: 0;
          padding: 20px;
          max-width: 900px;
          width: 100%;
          box-shadow: 
            0 0 20px var(--theme-glow),
            inset 0 0 20px var(--theme-glow);
          backdrop-filter: blur(2px);
          color: var(--theme-text);
          font-family: var(--theme-font);
          font-size: 14px;
          line-height: 1.2;
          position: relative;
        }

        .theme-control-panel {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid var(--theme-border);
          padding: 8px;
          font-size: 11px;
          z-index: 10;
          max-width: 300px;
        }

        .theme-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
          white-space: nowrap;
        }

        .theme-name {
          color: var(--theme-primary);
          font-weight: bold;
          text-shadow: 0 0 3px var(--theme-primary);
        }

        .theme-shortcut {
          color: var(--theme-muted);
          font-size: 9px;
          margin-left: 10px;
        }

        .terminal-header {
          margin-bottom: 20px;
        }

        .header-line {
          white-space: pre;
          margin: 2px 0;
          text-shadow: 0 0 5px var(--theme-primary);
        }

        .terminal-window {
          border: 1px solid var(--theme-border);
          margin-bottom: 20px;
          background: var(--theme-glow);
        }

        .window-border {
          white-space: pre;
          margin: 2px 0;
          text-shadow: 0 0 5px var(--theme-primary);
        }

        .status-section,
        .controls-section,
        .volume-section,
        .station-section {
          margin: 5px 0;
          padding: 0 5px;
        }

        .status-line,
        .control-line,
        .volume-line,
        .station-line {
          white-space: pre;
          margin: 2px 0;
        }

        .control-buttons,
        .volume-controls,
        .station-header {
          margin: 5px 0;
        }

        .terminal-btn,
        .station-btn {
          background: rgba(0, 0, 0, 0.8);
          color: var(--theme-text);
          border: 1px solid var(--theme-border);
          padding: 4px 8px;
          margin: 0 5px;
          font-family: var(--theme-font);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-shadow: 0 0 5px var(--theme-primary);
          box-shadow: 0 0 5px var(--theme-glow);
        }

        .terminal-btn:hover,
        .station-btn:hover {
          background: var(--theme-primary);
          color: var(--theme-background);
          text-shadow: none;
          box-shadow: 0 0 10px var(--theme-glow);
        }

        .terminal-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .terminal-btn:disabled:hover {
          background: rgba(0, 0, 0, 0.8);
          color: var(--theme-text);
          text-shadow: 0 0 5px var(--theme-primary);
          box-shadow: 0 0 5px var(--theme-glow);
        }

        .station-btn.active {
          background: var(--theme-primary);
          color: var(--theme-background);
          text-shadow: none;
        }

        .station-list {
          margin: 5px 0;
          max-height: 200px;
          overflow-y: auto;
        }

        .station-item {
          margin: 2px 0;
        }

        .terminal-footer {
          text-align: center;
          margin-top: 20px;
          opacity: 0.7;
        }

        .footer-line {
          animation: blink 2s infinite;
          text-shadow: 0 0 5px var(--theme-primary);
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--theme-primary);
          border-radius: 0;
          box-shadow: 0 0 5px var(--theme-glow);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--theme-accent);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .app-container {
            padding: 10px;
          }
          
          .terminal-card {
            padding: 15px;
            font-size: 12px;
          }
          
          .terminal-btn,
          .station-btn {
            padding: 2px 4px;
            font-size: 10px;
            margin: 0 2px;
          }

          .theme-control-panel {
            position: static;
            margin-bottom: 15px;
            max-width: 100%;
          }

          .theme-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .theme-shortcut {
            margin-left: 0;
            margin-top: 2px;
          }
        }
      `}</style>

      {/* Chat Card */}
      <ChatCard />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <TerminalUI />
    </ThemeProvider>
  );
}
