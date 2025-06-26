import type { Theme } from '../../../lib/types';

export const amberTheme: Theme = {
  id: 'amber',
  name: 'Retro Amber Terminal',
  story: 'UNIX Workstation - Circa 1985. A nostalgic recreation of classic UNIX workstations used in research labs.',
  colors: {
    primary: '#FFB000',
    secondary: '#FFA500',
    accent: '#FFCC33',
    background: '#1A0F00',
    text: '#FFA500',
    border: '#CC8800',
    glow: 'rgba(255, 176, 0, 0.4)',
    muted: 'rgba(255, 165, 0, 0.6)'
  },
  fonts: {
    primary: 'IBM Plex Mono',
    fallback: ['Anonymous Pro', 'Courier New', 'Monaco', 'monospace']
  },
  effects: {
    scanlines: true,
    glow: true,
    animations: ['phosphor', 'flicker']
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
      '║                       UNIX WORKSTATION v3.2 - AMBER MODE                    ║',
      '╚═══════════════════════════════════════════════════════════════════════════════╝'
    ],
    footer: '◆ LOFI RADIO TERMINAL ◆ UNIX MODE ◆ RESEARCH STATION ALPHA ◆'
  }
}; 