'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const Header = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
    };

    // Update time immediately
    updateTime();
    
    // Update time every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const handleGitHub = () => {
    window.open('https://github.com/devansh-m12/lofi');
  };

  const handleTwitter = () => {
    window.open('https://x.com/DazzzyBoi');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="flex justify-between items-center p-4">
          <Image
            src="/icons/SVG/brands/bluesky.svg"
            alt="Bluesky"
            width={24}
            height={24}
            className="transition-all duration-300 bg-white"
          />

          {/* Left side - Logo/Title with digital clock */}
        <div className="flex items-center space-x-3">
          {/* Digital Clock */}
          <div className="digital-clock">
            <span className="time-display">
              {currentTime}
            </span>
          </div>
        </div>

        {/* Right side - Icon buttons */}
        <div className="flex items-center space-x-4">
          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:scale-110 transition-transform duration-300 group"
            title="Toggle Fullscreen"
          >
            <Image
              src="/icons/SVG/regular/expand.svg"
              alt="Fullscreen"
              width={24}
              height={24}
              className="transition-all duration-300"
              style={{
                filter: 'invert(1) sepia(1) saturate(5) hue-rotate(90deg) brightness(1)',
              }}
            />
          </button>

          {/* GitHub button */}
          <button
            onClick={handleGitHub}
            className="p-2 hover:scale-110 transition-transform duration-300 group"
            title="Visit GitHub"
          >
            <Image
              src="/icons/SVG/brands/github.svg"
              alt="GitHub"
              width={24}
              height={24}
              className="transition-all duration-300"
              style={{
                filter: 'invert(1) sepia(1) saturate(5) hue-rotate(90deg) brightness(1)',
              }}
            />
          </button>

          {/* Twitter/X button */}
          <button
            onClick={handleTwitter}
            className="p-2 hover:scale-110 transition-transform duration-300 group"
            title="Visit Twitter"
          >
            <Image
              src="/icons/SVG/brands/x.svg"
              alt="Twitter/X"
              width={24}
              height={24}
              className="transition-all duration-300"
              style={{
                filter: 'invert(1) sepia(1) saturate(5) hue-rotate(90deg) brightness(1)',
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 