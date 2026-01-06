# 🎮 Buckshot Roulette - Frontend

> Modern React + TypeScript frontend for multiplayer Buckshot Roulette game with real-time WebSocket updates

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4+-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4+-38B2AC?logo=tailwind-css)

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Pages & Components](#pages--components)
- [Services & State Management](#services--state-management)
- [WebSocket Integration](#websocket-integration)
- [Game Items](#game-items)
- [Development](#development)
- [Building & Deployment](#building--deployment)
- [Troubleshooting](#troubleshooting)
- [Screen Resolution Notes](#screen-resolution-notes)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm 9+** (comes with Node.js)
- **Backend running** on `http://localhost:8080`

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Backend Connection

Ensure backend is running in another terminal:
```bash
cd ..
mvn spring-boot:run
```

Backend should be accessible at: `http://localhost:8080`

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Game/
│   │   │   ├── GameBoard.tsx              # Main game interface
│   │   │   ├── GameLayout.tsx             # Game layout wrapper
│   │   │   ├── ActionOverlay.tsx          # Action result display
│   │   │   ├── ActionOverlayTestPanel.tsx # Test utilities
│   │   │   └── TestOverlay.tsx            # Testing overlay
│   │   └── UI/
│   │       └── (UI components)
│   │
│   ├── pages/
│   │   ├── HomePage.tsx                   # Welcome/Login page
│   │   ├── GuidePage.tsx                  # Game rules & guide ⭐ UPDATED
│   │   ├── LobbyPage.tsx                  # Room list & creation
│   │   ├── RoomPage.tsx                   # Room waiting area
│   │   └── TestPage.tsx                   # Testing page
│   │
│   ├── services/
│   │   └── websocket.service.ts           # WebSocket/STOMP client
│   │
│   ├── stores/
│   │   └── gameStore.ts                   # Zustand state management
│   │
│   ├── types/
│   │   ├── player.types.ts                # Player interfaces
│   │   ├── room.types.ts                  # Room/Game interfaces
│   │   └── item.types.ts                  # Item interfaces
│   │
│   ├── utils/
│   │   ├── avatarMap.ts                   # Avatar mapping utilities
│   │   └── testActionOverlay.ts           # Testing functions
│   │
│   ├── assets/
│   │   ├── img/
│   │   │   ├── avatar/                    # Player avatars (8 colors)
│   │   │   ├── item/                      # Item images
│   │   │   ├── Action/                    # Action effect images
│   │   │   ├── Gun/                       # Gun graphics
│   │   │   ├── effect/                    # Visual effects
│   │   │   ├── background/                # Background images
│   │   │   ├── UI/                        # UI elements
│   │   │   └── ...
│   │   └── audio/
│   │       ├── fire event.mp3             # Fire sound
│   │       ├── hit real.mp3               # Hit sound
│   │       ├── hit fake.mp3               # Fake bullet sound
│   │       ├── use-item.mp3               # Item usage sound
│   │       ├── use glass.mp3              # Glass peek sound
│   │       └── tiếng sấm sét.mp3          # Thunder sound
│   │
│   ├── App.tsx                            # Main app & router
│   ├── main.tsx                           # React entry point
│   ├── index.css                          # Global styles
│   └── vite-env.d.ts                      # Vite types
│
├── public/
│   └── assets/
│
├── vite.config.ts                         # Vite configuration
├── tailwind.config.js                     # Tailwind CSS config
├── postcss.config.js                      # PostCSS config
├── tsconfig.json                          # TypeScript config
├── tsconfig.app.json                      # App TypeScript config
├── tsconfig.node.json                     # Node TypeScript config
├── eslint.config.js                       # ESLint configuration
├── package.json                           # Dependencies
├── package-lock.json
├── README.md                              # This file
└── ...
```

---

## 🎨 Pages & Components

### Pages

| Page | Route | Description |
|------|-------|-------------|
| **HomePage** | `/` | Login page - Enter player name |
| **GuidePage** | `/guide` | Complete game guide with rules & tips |
| **LobbyPage** | `/lobby` | Browse/create rooms |
| **RoomPage** | `/room` | Wait for game to start |
| **GameBoard** | (in Room) | Main gameplay interface |
| **TestPage** | `/test` | Testing utilities & debug tools |

### Key Components

**GameBoard.tsx** - Main Game Interface
- Displays 2-4 player avatars with HP bars
- Rotating gun targeting system
- Real/fake bullet visualization
- Item inventory with drag-select
- Action feedback overlay
- Turn indicator

**ActionOverlay.tsx** - Action Result Display
- Animated action notifications
- Actor avatar with action name
- Target indication
- Result animation (2-3 seconds)

**GuidePage.tsx** - Game Guide ⭐ NEW
- **Welcome section** with game introduction
- **Resolution Note**: Important advice for < 2K screens (zoom to 80%)
- Game interface explanation
- Rules & mechanics
- 7 item descriptions
- Strategy tips

---

## 🔌 Services & State Management

### WebSocket Service (`websocket.service.ts`)

**Features:**
- Auto-connecting STOMP client over SockJS
- Auto-reconnection with 5s delay
- Heartbeat monitoring (4s)
- Session persistence across reloads
- Message timeout detection (20s)
- Room subscription management

**Key Methods:**
```typescript
connect()                           // Connect to WebSocket
disconnect()                        // Disconnect gracefully
joinRoom(roomId, playerName)       // Join game room
fire(targetPlayerId)               // Fire at target
reload()                           // Reload gun
selectTarget(targetId, angle)      // Select targeting
useItem(itemType, targetId?)       // Use inventory item
leaveRoom(roomId)                  // Leave game
```

### State Management (`gameStore.ts`)

**Zustand Store with:**
- `roomStatus` - Current game state
- `currentPlayer` - Local player info
- `maxAmmo` - Track ammo for current round
- `isMyTurn()` - Check if it's player's turn
- `myPlayer()` - Get current player from room

---

## 📡 WebSocket Integration

### Connection Flow

```
Client (React)
    ↓
    ├─→ Connect to: ws://localhost:8080/ws-game (via SockJS)
    ├─→ Establish STOMP connection
    ├─→ Subscribe: /topic/room/{roomId}
    └─→ Ready to publish/receive
```

### Event Publishing (Client → Server)

| Action | Destination | Body |
|--------|------------|------|
| **Join Room** | `/app/join/{roomId}` | `{ name: "PlayerName" }` |
| **Start Game** | `/app/room/{roomId}/startgame` | `{}` |
| **Fire** | `/app/room/{roomId}/fire/{targetId}` | `{}` |
| **Select Target** | `/app/room/{roomId}/target/{targetId}` | `{}` |
| **Use Item** | `/app/room/{roomId}/use-item` | `{ typeitem: "1", targetid: "..." }` |
| **Reload** | `/app/room/{roomId}/reload` | `{}` |
| **Leave** | `/app/leave/{roomId}` | `{}` |

### Event Subscription (Server → Client)

```typescript
// Subscribe to room updates
/topic/room/{roomId}

// Receive:
{
  roomid: number,
  status: "Waiting" | "Playing" | "Ended",
  players: Player[],
  gun: [realCount, fakeCount],
  nextPlayer: Player,
  actionResponse: {
    action: string,
    actor: Player,
    targetid?: string,
    result?: string
  }
}
```

---

## 🎯 Game Items

### 7 Unique Items

| Item | Icon | Effect | Strategy |
|------|------|--------|----------|
| **Beer** 🍺 | Bottle | Remove next bullet from gun | Scout bullets safely |
| **Bullet** 📍 | Ammo | Add random bullet to gun | Increase unpredictability |
| **Chainsaw** 🪚 | Saw | 2x damage on next shot | Burst damage weakened foes |
| **Cigarette** 🚬 | Smoke | Restore 1 HP | Emergency healing |
| **Glass** 🥃 | Glass | Peek at next bullet type | Know if real/fake |
| **Handcuffs** 🔗 | Cuffs | Lock target (skip turn) | Disable strong players |
| **Go Solo** ⚔️ | Sword | 1v1 duel mode | High risk/reward play |

### Item Usage
- Max 7 items displayed at once
- Click item to use before shooting
- Some items consume item, others add effects
- Handcuffs prevent target from taking turn
- Solo creates special game state within room

---

## 🛠️ Development

### Available Scripts

```bash
# Development with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

### Development Features

✅ **Hot Module Replacement (HMR)** - Changes auto-reload  
✅ **TypeScript** - Type-safe development  
✅ **ESLint** - Code quality enforcement  
✅ **Tailwind CSS** - Rapid UI development  
✅ **Source Maps** - Easy debugging  

### Making Changes

1. **Backend changes** → Restart backend server
2. **Frontend changes** → Auto-reload via Vite HMR
3. **Type changes** → TypeScript will show errors
4. **Style changes** → Tailwind hot-reload

---

## 📦 Building & Deployment

### Production Build

```bash
npm run build
```

Output: `frontend/dist/`

### Build Output
```
dist/
├── index.html          # Main entry point
├── assets/
│   ├── index-xxxxx.js  # Bundled JavaScript
│   ├── index-xxxxx.css # Bundled styles
│   ├── ...
│   └── img/            # Optimized images
└── ...
```

### Server Configuration

Backend (Spring Boot) serves the frontend build:
```properties
# Backend serves dist/ as static files
spring.web.resources.static-locations=classpath:/static/
```

---

## 📱 Screen Resolution Notes

### ⚠️ Important for Small Screens

**If your screen resolution is less than 2K (2560x1440):**

1. **Browser Zoom to 80%**
   - **Windows/Linux**: `Ctrl + Minus (−)`
   - **Mac**: `Cmd + Minus (−)`
   - **Reset to 100%**: `Ctrl/Cmd + 0`

2. **Why?**
   - Game UI is optimized for 2K+ displays
   - Components may overflow on smaller screens
   - 80% zoom provides better UX
   - All text remains readable

3. **Alternative**
   - Use fullscreen mode (F11)
   - Adjust browser window size
   - Recommended: Laptop/Desktop with 1080p+ minimum

---

## 🐛 Troubleshooting

### WebSocket Connection Issues

**Problem**: "WebSocket connection failed"
```
Solution:
1. Verify backend is running: http://localhost:8080
2. Check firewall allows WebSocket
3. Open DevTools (F12) → Console tab
4. Look for WebSocket error messages
5. Ensure CORS is configured in backend
```

**Problem**: "Cannot join room - connection timeout"
```
Solution:
1. Check network connection
2. Verify backend accessible: curl http://localhost:8080
3. Check browser WebSocket support (F12 → Network)
4. Try refresh page (F5)
5. Check if session expired (30 minutes timeout)
```

### State Management Issues

**Problem**: "Room state not updating"
```
Solution:
1. Open DevTools (F12) → Console
2. Check for JavaScript errors
3. Verify WebSocket subscription active
4. Check: wsService.roomStatus in console
5. Try leaving and rejoining room
```

**Problem**: "Items not showing"
```
Solution:
1. Max 7 items can display
2. Open action log to verify items
3. Check player HP is > 0
4. Try using an item
5. Refresh page if stuck
```

### Player & Avatar Issues

**Problem**: "Wrong avatar showing"
```
Solution:
1. Check avatarMap.ts has correct mapping
2. Verify player color is valid
3. Check image path in assets/img/avatar/
4. Use browser DevTools to inspect img element
```

**Problem**: "Player names not syncing"
```
Solution:
1. Verify player name in HomePage input
2. Check room participants list in RoomPage
3. Look at backend logs for player creation
4. Try creating new room with different name
```

### UI & Display Issues

**Problem**: "UI too big/small on my screen"
```
Solution:
1. Adjust browser zoom (see Screen Resolution Notes)
2. For < 2K screens: Use 80% zoom
3. For 4K screens: Use 120-125% zoom
4. Fullscreen mode may help (F11)
```

**Problem**: "Text is blurry or hard to read"
```
Solution:
1. Check monitor DPI settings
2. Adjust browser zoom (Ctrl/Cmd ±)
3. Update graphics drivers
4. Try different browser (Chrome/Firefox/Safari)
```

---

## 🔧 Configuration Files

### `vite.config.ts`
```typescript
export default {
  plugins: [react()],
  server: {
    port: 5173,
    // Backend proxy if needed
  }
}
```

### `tailwind.config.js`
- Custom colors matching game theme
- Responsive breakpoints
- Animation utilities

### `tsconfig.json`
- Strict type checking enabled
- ES2020 target
- Path aliases for imports

### `package.json`
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

---

## 📚 Type Definitions

### Player Type
```typescript
interface Player {
  ID: string;
  name: string;
  hp: number;
  items: number[];
  effects: string[];
  URLavatar: string;
}
```

### Room Type
```typescript
interface RoomStatusResponse {
  roomid: number;
  status: "Waiting" | "Playing" | "Ended";
  players: Player[];
  gun: [number, number]; // [real, fake]
  nextPlayer: Player;
  actionResponse?: ActionResponse;
}
```

---

## 🎓 Best Practices

### Performance
- Lazy load components where possible
- Memoize expensive calculations
- Optimize re-renders with React.memo
- Use Zustand selectors efficiently

### Code Quality
- Always use TypeScript types
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic

### WebSocket Usage
- Always unsubscribe on unmount
- Handle reconnection gracefully
- Implement timeout detection
- Log WebSocket errors

---

## 📝 Console Logs

✅ **All console.log statements have been commented out** for cleaner development experience.

To enable debug logging:
1. Open `websocket.service.ts`
2. Uncomment `// console.log(...)` statements
3. Or use browser DevTools Console filter

---

## 🚢 Deployment Checklist

- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Backend API verified
- [ ] WebSocket endpoint correct
- [ ] Environment variables set
- [ ] Images optimized
- [ ] CSS minified
- [ ] No console errors in DevTools

---

## 📞 Support Resources

- **Main README**: See `../README.md` for full documentation
- **Backend Setup**: See `../SETUP_GUIDE.md`
- **IDE Setup**: See `../INTELLIJ_SETUP.md`
- **Common Issues**: See troubleshooting section above

---

## 🎮 Game Flow

```
Home Page (Enter name)
    ↓
Guide Page (Read rules) ⭐ NEW
    ↓
Lobby Page (Create/Join room)
    ↓
Room Page (Wait for players)
    ↓
Game Board (Play game)
    ├─→ Select Target
    ├─→ Use Item (optional)
    ├─→ Fire
    ├─→ See Result
    └─→ Next Turn
    ↓
Game Over / Back to Lobby
```

---

## 💡 Tips for Players

1. **Read the Guide** - GuidePage has all information
2. **Adjust Zoom** - Use 80% on < 2K screens
3. **Watch Ammo** - Track real/fake bullets
4. **Use Items Wisely** - Each item has strategic use
5. **Monitor HP** - Keep track of health bars
6. **Check Turn Order** - Know who's next
7. **Use Handcuffs** - Lock strong opponents
8. **Team Strategy** - Coordinate with other players

---

## 🔗 Links

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand Store](https://github.com/pmndrs/zustand)
- [STOMP.js](https://stomp-js.github.io/)

---

## 📄 License

Same as main project. See LICENSE file.

---

**Developed with ❤️ for Buckshot Roulette** 🎮

Last Updated: January 2026

