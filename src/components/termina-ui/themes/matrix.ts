import type { Theme } from '../../../lib/types';

export const matrixTheme: Theme = {
  id: 'matrix',
  name: 'Classic Matrix Green',
  story: 'The original terminal aesthetic from the golden age of green phosphor monitors',
  colors: {
    primary: '#00ff00',
    secondary: '#00cc00',
    accent: '#ffffff',
    background: '#000000',
    text: '#00ff00',
    border: '#00ff00',
    glow: 'rgba(0, 255, 0, 0.3)',
    muted: 'rgba(0, 255, 0, 0.5)'
  },
  fonts: {
    primary: 'Courier New',
    fallback: ['Monaco', 'Menlo', 'Consolas', 'monospace']
  },
  effects: {
    scanlines: true,
    glow: true,
    animations: ['blink', 'scanline']
  },
  ascii: {
    header: [
      '┌─────────────────────────────────────────────────────────────────────────────┐',
      '│  ██       ██████  ███████ ██     ██████   █████  ██████  ██  ██████  │',
      '│  ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ │',
      '│  ██      ██    ██ █████   ██     ██████  ███████ ██   ██ ██ ██    ██ │',
      '│  ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ │',
      '│  ███████  ██████  ██      ██     ██   ██ ██   ██ ██████  ██  ██████  │',
      '├─────────────────────────────────────────────────────────────────────────────┤',
      '│                            MATRIX TERMINAL v1.0                            │',
      '└─────────────────────────────────────────────────────────────────────────────┘'
    ],
    footer: '● LOFI RADIO TERMINAL ● MATRIX MODE ● SIGNAL LOCKED ●'
  }
}; 