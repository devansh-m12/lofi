import type { Theme } from '../../../lib/types';

export const synthwaveTheme: Theme = {
  id: 'synthwave',
  name: 'VHS Synthwave',
  story: 'Midnight Drive - Synthwave Frequency 88.8',
  colors: {
    primary: '#FF0080',
    secondary: '#00FFFF',
    accent: '#FF4500',
    background: '#200040',
    text: '#FF80C0',
    border: '#FF0080',
    glow: 'rgba(255, 0, 128, 0.4)',
    muted: 'rgba(255, 0, 128, 0.6)'
  },
  fonts: {
    primary: 'Audiowide',
    fallback: ['Wallpoet', 'Arial', 'sans-serif']
  },
  effects: {
    scanlines: true,
    glow: true,
    animations: ['vhs-glitch', 'neon-grid']
  },
  ascii: {
    header: [
      '╔═══════════════════════════════════════════════════════════════════════════════╗',
      '║▓ ██       ██████  ███████ ██     ██████   █████  ██████  ██  ██████  ▓║',
      '║▓ ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ ▓║',
      '║▓ ██      ██    ██ █████   ██     ██████  ███████ ██   ██ ██ ██    ██ ▓║',
      '║▓ ██      ██    ██ ██      ██     ██   ██ ██   ██ ██   ██ ██ ██    ██ ▓║',
      '║▓ ███████  ██████  ██      ██     ██   ██ ██   ██ ██████  ██  ██████  ▓║',
      '╠═══════════════════════════════════════════════════════════════════════════════╣',
      '║                        SYNTHWAVE RADIO 88.8                                 ║',
      '╚═══════════════════════════════════════════════════════════════════════════════╝'
    ],
    footer: '■ LOFI RADIO TERMINAL ■ SYNTHWAVE MODE ■ MIDNIGHT FREQUENCY ■'
  }
}; 