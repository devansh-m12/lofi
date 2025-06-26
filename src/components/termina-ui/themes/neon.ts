import type { Theme } from '../../../lib/types';

export const neonTheme: Theme = {
  id: 'neon',
  name: 'Neon Purple',
  story: 'Electric Dreams - Neon club underground radio',
  colors: {
    primary: '#9D00FF',
    secondary: '#FF00FF',
    accent: '#00FFFF',
    background: '#1A0033',
    text: '#E0B3FF',
    border: '#9D00FF',
    glow: 'rgba(157, 0, 255, 0.4)',
    muted: 'rgba(157, 0, 255, 0.6)'
  },
  fonts: {
    primary: 'Orbitron',
    fallback: ['Space Mono', 'Courier New', 'monospace']
  },
  effects: {
    scanlines: true,
    glow: true,
    animations: ['electric-pulse', 'neon-flicker']
  },
  ascii: {
    header: [
      '╔═══════════════════════════════════════════════════════════════════════════════╗',
      '║⚡ ██       ██████  ███████ ██     ██████   █████  ██████  ██  ██████  ⚡║',
      '║◇ ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ ◇║',
      '║⚡ ██      ██    ██ █████   ██     ██████  ███████ ██   ██ ██ ██    ██ ⚡║',
      '║◇ ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ ◇║',
      '║⚡ ███████  ██████  ██      ██     ██   ██ ██   ██ ██████  ██  ██████  ⚡║',
      '╠═══════════════════════════════════════════════════════════════════════════════╣',
      '║                        ELECTRIC DREAMS RADIO                                ║',
      '╚═══════════════════════════════════════════════════════════════════════════════╝'
    ],
    footer: '⚡ LOFI RADIO TERMINAL ⚡ NEON MODE ⚡ ELECTRIC FREQUENCY ⚡'
  }
}; 