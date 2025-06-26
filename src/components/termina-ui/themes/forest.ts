import type { Theme } from '../../../lib/types';

export const forestTheme: Theme = {
  id: 'forest',
  name: 'Terminal Forest',
  story: 'Eco-Hacker Collective - Frequency: Nature.fm',
  colors: {
    primary: '#228B22',
    secondary: '#7CFC00',
    accent: '#8B4513',
    background: '#0F1B0F',
    text: '#90EE90',
    border: '#228B22',
    glow: 'rgba(34, 139, 34, 0.4)',
    muted: 'rgba(34, 139, 34, 0.6)'
  },
  fonts: {
    primary: 'Source Code Pro',
    fallback: ['Ubuntu Mono', 'Courier New', 'monospace']
  },
  effects: {
    scanlines: true,
    glow: true,
    animations: ['leaf-particle', 'organic-growth']
  },
  ascii: {
    header: [
      '╔═══════════════════════════════════════════════════════════════════════════════╗',
      '║🌲 ██       ██████  ███████ ██     ██████   █████  ██████  ██  ██████  🍃║',
      '║🍃 ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ 🌿║',
      '║🌿 ██      ██    ██ █████   ██     ██████  ███████ ██   ██ ██ ██    ██ 🌲║',
      '║🌲 ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ 🍃║',
      '║🍃 ███████  ██████  ██      ██     ██   ██ ██   ██ ██████  ██  ██████  🌿║',
      '╠═══════════════════════════════════════════════════════════════════════════════╣',
      '║                      ECO-HACKER COLLECTIVE FM                               ║',
      '╚═══════════════════════════════════════════════════════════════════════════════╝'
    ],
    footer: '🌱 LOFI RADIO TERMINAL 🌱 FOREST MODE 🌱 NATURE FREQUENCY 🌱'
  }
}; 