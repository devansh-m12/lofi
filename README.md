# 📻 Lofi Radio Player - Termina UI

A retro-futuristic terminal interface for streaming lofi radio stations. Experience nostalgic computing aesthetics while enjoying your favorite ambient beats.

![Terminal Interface](https://img.shields.io/badge/Interface-Terminal%20Style-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-19-61dafb)

## ✨ Features

- 🖥️ **Retro Terminal UI** - Authentic vintage computer terminal aesthetics
- 🎵 **YouTube Music Integration** - Stream lofi radio stations via YouTube
- 🎨 **Multiple Themes** - Switch between different terminal styles and eras
- ⚡ **Real-time Playback** - Seamless audio streaming with controls
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Immersive Experience** - CRT effects, scanlines, and retro animations

## 🎨 Available Themes

### 🟢 Classic Matrix (Default)
*"Welcome to the Matrix"*
- Bright green on black background
- Classic 1980s terminal aesthetic
- Scanlines and CRT glow effects

### 🔵 Cyberpunk Neon
*"Neo-Tokyo 2087"*
- Electric cyan and hot pink colors
- Futuristic hologram effects
- RGB color split animations

### 🟡 Retro Amber Terminal
*"UNIX Workstation - Circa 1985"*
- Warm amber phosphor display
- Classic monospaced fonts
- Gentle afterglow effects

### 🚀 Space Station Command
*"Deep Space Radio Array"*
- Electric blue with starfield
- NASA mission control aesthetic
- Radar sweep animations

### 🌸 VHS Synthwave
*"Midnight Drive FM"*
- Magenta and cyan gradients
- 80s retrowave styling
- VHS glitch effects

### 🌿 Terminal Forest
*"Eco-Hacker Collective"*
- Forest greens and earth tones
- Organic animations
- Nature-inspired design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lofi
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.3.4](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Media Player**: [React Player](https://github.com/cookpete/react-player)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Real-time**: [Socket.IO](https://socket.io/) (optional)

## 📁 Project Structure

```
lofi/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── termina-ui/        # Terminal UI components
│   │       ├── index.tsx      # Main component
│   │       ├── ThemeProvider.tsx
│   │       ├── ThemeSelector.tsx
│   │       └── themes/        # Theme definitions
│   │           ├── matrix.ts
│   │           ├── cyberpunk.ts
│   │           ├── amber.ts
│   │           ├── space.ts
│   │           ├── synthwave.ts
│   │           └── forest.ts
│   └── lib/                   # Utilities and hooks
│       ├── constants.ts
│       ├── types.ts
│       ├── youtube.ts
│       ├── useYoutubePlayer.ts
│       └── utils/
├── public/                    # Static assets
└── docs.md                   # Detailed documentation
```

## 🎮 Usage

### Basic Controls
- **Space Bar**: Play/Pause
- **Theme Selector**: Click to switch between themes
- **Volume Control**: Adjust audio levels
- **Station Browser**: Navigate through radio stations

### Keyboard Shortcuts
- `Space` - Toggle play/pause
- `M` - Mute/unmute
- `T` - Open theme selector
- `?` - Show help menu

## 🔧 Configuration

### Adding New Themes

1. Create a new theme file in `src/components/termina-ui/themes/`
2. Define your theme object following the `Theme` interface
3. Export and register in the theme system

Example theme structure:
```typescript
export const myTheme: Theme = {
  name: 'My Theme',
  story: 'Theme description',
  colors: {
    primary: '#ff0000',
    secondary: '#00ff00',
    // ... other colors
  },
  fonts: {
    primary: 'Monaco',
    fallback: ['Courier New', 'monospace']
  },
  effects: {
    scanlines: true,
    glow: true,
    animations: ['pulse', 'flicker']
  }
}
```

### Environment Variables

Create a `.env.local` file for configuration:
```bash
# YouTube API configuration (if needed)
YOUTUBE_API_KEY=your_api_key_here

# Socket.IO configuration (if using real-time features)
SOCKET_URL=ws://localhost:3001
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](docs.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by classic terminal interfaces and retro computing
- CRT and phosphor display aesthetics from vintage monitors
- Lofi hip-hop community for the amazing music
- Open source libraries that make this possible

## 📚 Documentation

For detailed theme documentation and implementation guides, see [docs.md](docs.md).

---

*Built with ❤️ for the lofi community*
