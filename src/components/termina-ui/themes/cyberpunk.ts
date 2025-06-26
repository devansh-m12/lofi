import type { Theme } from '../../../lib/types';

export const cyberpunkTheme: Theme = {
  id: 'cyberpunk',
  name: 'Cyberpunk Neon',
  story: 'Neo-Tokyo 2087 - Underground neural network radio broadcasts',
  colors: {
    primary: '#00FFFF',
    secondary: '#FF1493',
    accent: '#9D00FF',
    background: '#0a0a0f',
    text: '#E0E0FF',
    border: '#00FFFF',
    glow: 'rgba(0, 255, 255, 0.4)',
    muted: 'rgba(0, 255, 255, 0.6)'
  },
  fonts: {
    primary: 'Orbitron',
    fallback: ['Rajdhani', 'Arial', 'sans-serif']
  },
  effects: {
    scanlines: true,
    glow: true,
    animations: ['neon-pulse', 'data-stream']
  },
  ascii: {
    header: [
      '╔═══════════════════════════════════════════════════════════════════════════════╗',
      '║  ██       ██████  ███████ ██     ██████   █████  ██████  ██  ██████  ║',
      '║  ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ ║',
      '║  ██      ██    ██ █████   ██     ██████  ███████ ██   ██ ██ ██    ██ ║',
      '║  ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ ║',
      '║  ███████  ██████  ██      ██     ██   ██ ██   ██ ██████  ██  ██████  ║',
      '╠═══════════════════════════════════════════════════════════════════════════════╣',
      '║                       CYBERPUNK NET RADIO v2087                              ║',
      '╚═══════════════════════════════════════════════════════════════════════════════╝'
    ],
    footer: '◇ LOFI RADIO TERMINAL ◇ NEURAL NET MODE ◇ NEO-TOKYO BROADCAST ◇'
  }
}; 