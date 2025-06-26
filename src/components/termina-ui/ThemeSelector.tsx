'use client';

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';

export function ThemeSelector() {
  const { currentTheme, availableThemes, switchTheme } = useTheme();
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className="theme-selector">
      <div className="selector-header">
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="theme-toggle-btn"
        >
          {showSelector ? '▲ HIDE THEMES' : '▼ SHOW THEMES'}
        </button>
      </div>
      
      {showSelector && (
        <div className="theme-list">
          {availableThemes.map((theme, index) => (
            <div key={theme.id} className="theme-item">
              <div className="theme-line">
                <button
                  onClick={() => {
                    switchTheme(theme.id);
                    setShowSelector(false);
                  }}
                  className={`theme-btn ${currentTheme.id === theme.id ? 'active' : ''}`}
                >
                  [{index + 1}] {theme.name.toUpperCase()}
                </button>
                <div className="theme-story">
                  {theme.story}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .theme-selector {
          margin: 0;
          padding: 0;
          width: 100%;
          position: relative;
        }

        .selector-header {
          margin: 0 0 5px 0;
          text-align: center;
        }

        .theme-toggle-btn {
          background: rgba(0, 0, 0, 0.9);
          color: var(--theme-text, #00ff00);
          border: 1px solid var(--theme-border, #00ff00);
          padding: 4px 8px;
          font-family: var(--theme-font, 'Courier New', monospace);
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s;
          text-shadow: 0 0 5px var(--theme-primary, #00ff00);
          width: 100%;
        }

        .theme-toggle-btn:hover {
          background: var(--theme-primary, #00ff00);
          color: var(--theme-background, #000000);
          text-shadow: none;
        }

        .theme-list {
          margin: 5px 0 0 0;
          max-height: 300px;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid var(--theme-border, #00ff00);
          padding: 5px;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 100;
          box-shadow: 0 0 10px var(--theme-glow, rgba(0, 255, 0, 0.3));
        }

        .theme-item {
          margin: 3px 0;
        }

        .theme-line {
          margin: 2px 0;
          display: flex;
          flex-direction: column;
        }

        .theme-btn {
          background: rgba(0, 0, 0, 0.8);
          color: var(--theme-text, #00ff00);
          border: 1px solid var(--theme-border, #00ff00);
          padding: 6px 10px;
          margin: 0 0 3px 0;
          font-family: var(--theme-font, 'Courier New', monospace);
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s;
          text-shadow: 0 0 5px var(--theme-primary, #00ff00);
          box-shadow: 0 0 5px var(--theme-glow, rgba(0, 255, 0, 0.3));
          width: 100%;
          text-align: left;
        }

        .theme-btn:hover {
          background: var(--theme-primary, #00ff00);
          color: var(--theme-background, #000000);
          text-shadow: none;
          box-shadow: 0 0 10px var(--theme-glow, rgba(0, 255, 0, 0.6));
        }

        .theme-btn.active {
          background: var(--theme-primary, #00ff00);
          color: var(--theme-background, #000000);
          text-shadow: none;
          box-shadow: 0 0 10px var(--theme-glow, rgba(0, 255, 0, 0.6));
        }

        .theme-story {
          font-size: 9px;
          opacity: 0.7;
          margin: 0 0 0 5px;
          line-height: 1.1;
          font-style: italic;
        }
      `}</style>
    </div>
  );
} 