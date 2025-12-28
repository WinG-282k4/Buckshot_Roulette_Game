# 🚀 QUICK REFERENCE - Buckshot Roulette

## ⚡ CHẠY NHANH

### Backend
```powershell
mvn spring-boot:run
```
→ `http://localhost:8080`

### Frontend
```powershell
cd frontend
npm run dev
```
→ `http://localhost:5173`

---

## 🔌 API ENDPOINTS

### REST
```
POST /api/createroom → Tạo phòng mới
```

### WebSocket
```
WS   /ws-game         → Connect
SUB  /topic/room/{id} → Room updates
PUB  /app/join/{id}   → Join room
PUB  /app/room/{id}/startgame → Start
PUB  /app/room/{id}/fire/{targetId} → Bắn
PUB  /app/room/{id}/reload → Reload
PUB  /app/room/{id}/use-item → Use item
```

---

## 🎮 ITEMS

| Icon | Name | Effect |
|------|------|--------|
| 🍺 | Beer | Eject bullet |
| 🔫 | Bullet | Add bullet |
| 🪚 | Chainsaw | 2x damage |
| 🚬 | Cigarette | +1 HP |
| 🔍 | Glass | See bullet |
| 🔗 | Handcuffs | Skip turn |
| 🔭 | Viewfinder | Peek next |

---

## 📁 FILES

```
Backend:
  controller/gameController.java
  model/Player.java, Room.java, Gun.java
  websocket/WebsocketConfig.java

Frontend:
  pages/HomePage.tsx, RoomPage.tsx
  components/Game/GameBoard.tsx
  services/websocket.service.ts
  stores/gameStore.ts
```

---

## 🔧 COMMANDS

### Build
```powershell
mvn clean package           # Backend
cd frontend && npm run build # Frontend
```

### Test
```powershell
mvn test                    # Backend tests
cd frontend && npm run lint # Frontend lint
```

### Clean
```powershell
mvn clean                   # Backend
cd frontend && rm -rf node_modules dist # Frontend
```

---

## 🐛 DEBUG

### Backend logs
```
Terminal running mvn spring-boot:run
```

### Frontend logs
```
Browser Console (F12)
```

### WebSocket
```
Chrome DevTools → Network → WS → Messages
```

---

## 📚 DOCS

- `SETUP_GUIDE.md` - Full setup
- `INTELLIJ_SETUP.md` - IDE config
- `FRONTEND_IMPLEMENTATION_GUIDE.md` - Frontend details
- `PROJECT_CHECKLIST.md` - What's done

---

## 🎯 TEST FLOW

1. Start backend
2. Start frontend
3. Open `localhost:5173`
4. Create room (Player 1)
5. Join room in new tab (Player 2)
6. Start game
7. Play!

---

## ⚙️ CONFIG

**Backend:** `src/main/resources/application.properties`  
**Frontend:** `frontend/vite.config.ts`  
**Styles:** `frontend/tailwind.config.js`

---

## 🔑 KEY SHORTCUTS (IntelliJ)

| Action | Mac | Windows |
|--------|-----|---------|
| Run | Ctrl+R | Shift+F10 |
| Debug | Ctrl+D | Shift+F9 |
| Terminal | Opt+F12 | Alt+F12 |
| Search | Cmd+Shift+F | Ctrl+Shift+F |
| Format | Cmd+Opt+L | Ctrl+Alt+L |

---

**Quick Links:**
- Backend: http://localhost:8080
- Frontend: http://localhost:5173
- GitHub Copilot: Ask me anything! 💬

