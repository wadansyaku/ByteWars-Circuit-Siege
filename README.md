# ByteWars: Circuit Siege

A 2D horizontal scrolling base defense game built with Next.js, TypeScript, and HTML Canvas.

![Game Preview](https://via.placeholder.com/800x300/0F172A/FFFFFF?text=ByteWars:+Circuit+Siege)

## 🎮 Overview

ByteWars: Circuit Siege is a browser-based strategy game where you deploy digital units to destroy the enemy base while defending your own. Manage your energy, time your unit deployments, and crush the opposition!

### Features

- **6 Unique Units** - Each with different stats, abilities, and strategies
- **3 Progressive Stages** - Increasing difficulty with new enemy types
- **Energy System** - Strategic resource management
- **Cooldown Mechanics** - Timing and planning required
- **Cross-platform** - Works on PC and mobile (touch controls)
- **Progress Saving** - Stage unlock progress saved locally
- **Responsive Design** - Adapts to any screen size

## 🎯 Game Rules

### Objective
- Destroy the enemy base (right side) before they destroy yours (left side)

### Resources
- **Energy**: Regenerates 1 per second, max 10
- Each unit costs energy to deploy
- Each unit has a cooldown after deployment

### Unit Types

| Unit | Cost | Type | Special |
|------|------|------|---------|
| ⚡ ByteRunner | 2 | Light Melee | Fast, cheap scout |
| 🛡️ ShieldGolem | 5 | Heavy Tank | High HP, slow |
| 🎯 ArcSlinger | 3 | Ranged | Attacks from distance |
| 💥 NovaBurst | 6 | Area Attack | Damages multiple enemies |
| 📡 SyncDrone | 4 | Support | Boosts ally attack speed |
| 🔥 HexBit | 5 | Summon | High DPS, short-lived |

### Win/Lose Conditions
- **Victory**: Reduce enemy base HP to 0
- **Defeat**: Your base HP reaches 0

## 🎮 Controls

### PC
- **Mouse**: Click unit buttons to deploy
- **Keys 1-6**: Deploy units (1=ByteRunner, 2=ShieldGolem, etc.)
- **P / Escape**: Pause/Resume game

### Mobile
- **Touch**: Tap unit buttons to deploy
- **Pause Button**: Tap to pause

## 🚀 Local Development

### Prerequisites
- Node.js 18+ 
- npm 9+

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd TheFight

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run tests
npm run format   # Format code with Prettier
```

## 📦 Deployment

### Cloudflare Pages (Recommended - Free & Unlimited Bandwidth)

This project is configured for static export, optimized for Cloudflare Pages.

#### Option 1: Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select **Workers & Pages** → **Create** → **Pages**
3. Connect your GitHub account
4. Select the **ByteWars-Circuit-Siege** repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
6. Click **Save and Deploy**

#### Option 2: Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm run build

# Deploy
wrangler pages deploy out --project-name=bytewars
```

### Vercel (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (will auto-detect Next.js)
vercel
```

Note: For Vercel, you may want to remove `output: 'export'` from `next.config.ts` to use SSR features.

### Manual Deployment

```bash
npm run build
# Deploy the 'out' folder to any static hosting provider
```

## 📁 Project Structure

```
TheFight/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Title screen
│   │   ├── globals.css         # Global styles
│   │   └── play/
│   │       └── page.tsx        # Game page
│   ├── components/
│   │   ├── GameCanvas.tsx      # Canvas rendering component
│   │   ├── HUD.tsx             # Game UI overlay
│   │   └── ResultModal.tsx     # Win/lose modal
│   ├── game/
│   │   ├── engine/
│   │   │   ├── GameLoop.ts     # requestAnimationFrame loop
│   │   │   └── GameState.ts    # Central game state
│   │   ├── entities/
│   │   │   └── Entity.ts       # Unit and Base classes
│   │   ├── data/
│   │   │   ├── config.ts       # Game configuration
│   │   │   ├── units.ts        # Player unit definitions
│   │   │   ├── enemies.ts      # Enemy definitions
│   │   │   └── stages.ts       # Stage configurations
│   │   └── renderer/
│   │       └── CanvasRenderer.ts  # Canvas drawing
│   ├── utils/
│   │   └── storage.ts          # localStorage utilities
│   └── __tests__/
│       └── game.test.ts        # Unit tests
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── jest.config.js
├── LICENSE
└── README.md
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

Tests cover:
- Unit creation and stats
- Combat damage calculations
- Enemy selection logic
- Data integrity checks

## 🔧 Technical Details

### Architecture
- **Game Core**: Pure TypeScript classes (no React dependencies)
- **Rendering**: HTML Canvas with requestAnimationFrame
- **UI Layer**: React components for HUD and menus
- **State Sync**: Game state exposed via `useRef`, minimal React state updates

### Performance Optimizations
- Fixed timestep game loop (60 FPS logic)
- DPR-aware canvas rendering
- Minimal state updates to React
- Efficient collision detection (1D distance checks)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚧 Known Limitations & Future Improvements

### Current Limitations
- No sound effects (MVP scope)
- Single lane only (no vertical movement)
- Simple geometric graphics

### Planned Improvements
- [ ] Sound effects and background music
- [ ] Additional stages (6+)
- [ ] Unit upgrade system
- [ ] Multiple lanes
- [ ] Boss battles
- [ ] Achievements
- [ ] Online leaderboards
- [ ] Animated sprite graphics

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 🙏 Credits

- Game Design & Development: ByteWars Team
- Built with [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/)

---

Made with ⚡ by ByteWars Team | © 2026
