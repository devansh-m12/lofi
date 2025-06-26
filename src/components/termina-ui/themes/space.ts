import type { Theme } from '../../../lib/types';

export const spaceTheme: Theme = {
  id: 'space',
  name: 'Space Station Command',
  story: 'Deep Space Radio Array - Stardate 2387.4',
  colors: {
    primary: '#0080FF',
    secondary: '#C0C0C0',
    accent: '#00FF80',
    background: '#000510',
    text: '#E0E8FF',
    border: '#0080FF',
    glow: 'rgba(0, 128, 255, 0.4)',
    muted: 'rgba(0, 128, 255, 0.6)'
  },
  fonts: {
    primary: 'Space Mono',
    fallback: ['Nova Mono', 'Courier New', 'monospace']
  },
  effects: {
    scanlines: true,
    glow: true,
    animations: ['radar-sweep', 'star-particle']
  },
  ascii: {
    header: [
      '╔═══════════════════════════════════════════════════════════════════════════════╗',
      '║ ✦  ██       ██████  ███████ ██     ██████   █████  ██████  ██  ██████  ★ ║',
      '║ ★  ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ ✧ ║',
      '║ ✧  ██      ██    ██ █████   ██     ██████  ███████ ██   ██ ██ ██    ██ ☄ ║',
      '║ ☄  ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ ✦ ║',
      '║ ✦  ███████  ██████  ██      ██     ██   ██ ██   ██ ██████  ██  ██████  ★ ║',
      '╠═══════════════════════════════════════════════════════════════════════════════╣',
      '║                       DEEP SPACE RADIO ARRAY v2387                          ║',
      '╚═══════════════════════════════════════════════════════════════════════════════╝'
    ],
    footer: '☄ LOFI RADIO TERMINAL ☄ SPACE COMMAND ☄ SIGNAL ACROSS THE VOID ☄'
  }
}; 