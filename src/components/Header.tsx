'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useVisitorTracking } from '@/lib/useVisitorTracking';

const Header = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  // Visitor tracking
  const { visitorCount, isLoading: visitorLoading, error: visitorError } = useVisitorTracking({
    roomId: 'general',
    updateInterval: 30,
    enabled: true
  });

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
        {/* Left side - Logo and visitor count */}
        <div className="flex items-center space-x-3">
          <Image
            src="/bluesky.svg"
            alt="Bluesky"
            width={24}
            height={24}
            className="transition-all duration-300 bg-white"
          />
          
          {/* Visitor Counter - simple text */}
          <div className="text-white/80 text-sm font-mono">
            {visitorLoading ? (
              <span>connecting<span className="animate-pulse">•••</span></span>
            ) : visitorError ? (
              <span>offline<span className="animate-pulse">•••</span></span>
            ) : (
              <span>listening now {visitorCount + 5}<span className="animate-pulse">•••</span></span>
            )}
          </div>

          </div>


          <div className="flex items-center space-x-6">
          {/* Digital Clock */}
          <div className="digital-clock">
            <span className="time-display">
              {currentTime}
            </span>
          </div>
        </div>

        {/* Right side - Icon buttons */}
        <div className="flex items-center space-x-4">

          {/* Product Hunt Badge */}
          <div className="flex items-center">
          <a href="https://www.producthunt.com/products/lofi-radio?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-lofi&#0045;radio&#0045;3" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=984786&theme=dark&t=1751028798186" alt="Lofi&#0032;Radio - Retro&#0032;terminal&#0032;with&#0032;lofi&#0032;beats&#0032;&#0043;&#0032;live&#0032;chat&#0032;community | Product Hunt" style={{width: '250px', height: '37px'}} width="250" height="37" /></a>
          </div>
          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:scale-110 transition-transform duration-300 group"
            title="Toggle Fullscreen"
          >
            <Image
              src="/expand.svg"
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
              src="/github.svg"
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
              src="/x.svg"
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