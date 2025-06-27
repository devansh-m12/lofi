# 🎧 Lofi Terminal

> *A nostalgic journey through retro computing while enjoying the smoothest lofi beats*

Transform your browser into a vintage computer terminal and immerse yourself in carefully curated lofi radio stations. Experience computing like it's 1985, but with today's streaming technology.

---

## 🌟 What Makes This Special

**Termina UI** - Not just another music player. This is a fully immersive retro computing experience that transports you to the golden age of terminal interfaces while streaming modern lofi content.

- **🖥️ Authentic Terminal Experience** - Real CRT effects, scanlines, and phosphor glow
- **🎵 Curated Lofi Stations** - Hand-picked YouTube streams for the perfect vibe
- **🎨 Multiple Era Themes** - From 80s Matrix green to cyberpunk neon
- **⚡ Modern Performance** - Built with Next.js 15 and React 19
- **📱 Works Everywhere** - Responsive design for all devices

---

## 🚀 Quick Start

```bash
# Clone and enter the terminal
git clone https://github.com/yourusername/lofi.git
cd lofi

# Initialize the system
npm install

# Boot up the terminal
npm run dev

# Access at http://localhost:3000
```

**That's it!** Your retro terminal is now live and ready to stream lofi beats.

---

## 🎨 Terminal Themes

Switch between different computing eras with our theme system:

### 🟢 Matrix Classic
*The original green screen experience*
- Classic terminal green (#00ff00)
- Authentic CRT scanlines
- Perfect for coding sessions

### 🔵 Cyberpunk 2087
*Neo-Tokyo underground radio*
- Electric cyan and hot pink
- Holographic effects
- Future noir aesthetic

### 🟡 UNIX Amber
*University lab workstation vibes*
- Warm amber phosphor (#ffb000)
- Vintage 1985 aesthetic
- Gentle afterglow effects

### 🚀 Space Command
*Deep space exploration vessel*
- NASA mission control blue
- Starfield backgrounds
- Radar sweep animations

### 🌸 Synthwave FM
*Late night 80s drive*
- Magenta and cyan gradients
- VHS glitch effects
- Retrowave styling

### 🌿 Forest Terminal
*Eco-hacker collective*
- Earth tones and forest greens
- Organic animations
- Nature-inspired design

---

## 🎮 Terminal Commands

Navigate your lofi terminal like a pro:

| Command | Action |
|---------|--------|
| `SPACE` | Play/Pause current station |
| `T` | Toggle theme selector |
| `M` | Mute/unmute audio |
| `?` | Display help menu |
| `ESC` | Close modals |

---

## 🛠️ Built With

Modern technology meets retro aesthetics:

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[React Player](https://github.com/cookpete/react-player)** - YouTube streaming
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Supabase](https://supabase.com/)** - Real-time features (optional)

---

## 📁 Project Architecture

```
lofi/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles
│   │   └── api/            # API routes
│   ├── components/
│   │   ├── Header.tsx      # Navigation
│   │   └── termina-ui/     # Terminal interface
│   │       ├── index.tsx   # Main terminal
│   │       ├── ChatCard.tsx
│   │       ├── ThemeProvider.tsx
│   │       ├── ThemeSelector.tsx
│   │       └── themes/     # Theme definitions
│   └── lib/
│       ├── types.ts        # TypeScript definitions
│       ├── constants.ts    # App constants
│       ├── useChat.ts      # Chat functionality
│       ├── useYoutubePlayer.ts
│       └── utils/
├── public/
│   └── icons/              # Extensive icon collection
└── docs.md                 # Detailed documentation
```

---

## 🎵 Adding Radio Stations

Expand your lofi collection by adding new YouTube streams:

1. Find a lofi radio stream on YouTube
2. Copy the video ID or full URL
3. Add to `src/lib/constants.ts`:

```typescript
export const RADIO_STATIONS = [
  {
    id: 'your-station-id',
    name: 'Chill Beats Radio',
    url: 'https://youtube.com/watch?v=your-video-id',
    genre: 'lofi',
    description: 'Perfect for late night coding'
  }
];
```

---

## 🎨 Creating Custom Themes

Design your own terminal aesthetic:

```typescript
// src/components/termina-ui/themes/mytheme.ts
export const myTheme: Theme = {
  name: 'My Custom Theme',
  story: 'Your theme description',
  colors: {
    primary: '#your-primary-color',
    secondary: '#your-secondary-color',
    background: '#your-background',
    text: '#your-text-color',
    border: '#your-border-color',
    glow: 'rgba(your, glow, color, 0.4)'
  },
  fonts: {
    primary: 'Your Font',
    fallback: ['Courier New', 'monospace']
  },
  effects: {
    scanlines: true,
    glow: true,
    animations: ['pulse', 'flicker']
  }
};
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Deploy instantly with zero configuration

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

Help make the ultimate lofi terminal experience:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin amazing-feature`
5. **Open** a Pull Request

### Contribution Ideas
- 🎨 New terminal themes
- 🎵 Additional radio stations
- 🔧 Performance improvements
- 📱 Mobile optimizations
- 🎮 Keyboard shortcuts
- 🌐 Internationalization

---

## 📜 License

Open source under the [MIT License](LICENSE) - build, modify, and share freely.

---

## 🙏 Credits

- **Terminal Aesthetics** - Inspired by vintage computing and CRT displays
- **Lofi Community** - For the incredible music that powers this experience  
- **Open Source** - Built on the shoulders of amazing open source projects
- **Retro Computing** - Honoring the pioneers of personal computing

---

## 📚 Learn More

- 📖 **[Detailed Documentation](docs.md)** - Theme system, architecture, and guides
- 🎨 **[Theme Gallery](docs.md#proposed-themes-5-variations)** - Explore all available themes
- 🛠️ **[Development Guide](docs.md#development-roadmap)** - Contributing and customization

---

<div align="center">

**🎧 Built with ❤️ for the lofi community 🎧**

*Experience computing nostalgia while enjoying the future of lofi*

</div> 