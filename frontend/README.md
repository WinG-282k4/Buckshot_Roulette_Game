# Buckshot Roulette - Frontend

React + TypeScript frontend cho game Buckshot Roulette multiplayer.

## 🚀 Bắt đầu

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 📡 Kết nối Backend

Đảm bảo backend Spring Boot đang chạy tại `http://localhost:8080`

```bash
# Terminal khác - Chạy backend
cd ..
mvn spring-boot:run
```

## 🎮 Cách chơi

1. Mở `http://localhost:5173`
2. Nhập tên người chơi
3. **Tạo phòng mới** hoặc **Nhập Room ID** để join
4. Chờ người chơi khác vào phòng
5. Nhấn "BẮT ĐẦU GAME"
6. Chơi game theo lượt:
   - Bắn súng vào mục tiêu
   - Nạp đạn mới
   - Sử dụng items

## 🏗️ Cấu trúc Project

```
src/
├── components/
│   ├── Game/
│   │   ├── GameBoard.tsx       # Main game component
│   │   ├── GunDisplay.tsx      # Hiển thị súng & đạn
│   │   ├── PlayerList.tsx      # Danh sách người chơi
│   │   ├── ItemSlots.tsx       # Items của player
│   │   └── ActionButtons.tsx   # Nút bắn, reload
│   └── UI/
├── pages/
│   ├── HomePage.tsx            # Trang chủ
│   └── RoomPage.tsx            # Phòng game
├── services/
│   └── websocket.service.ts    # WebSocket/STOMP service
├── stores/
│   └── gameStore.ts            # Zustand state management
├── types/
│   ├── player.types.ts
│   ├── room.types.ts
│   └── item.types.ts
└── App.tsx                     # React Router
```

## 🔌 WebSocket Endpoints

### Subscribe (Nhận updates)
- `/topic/room/{roomId}` - Room status updates

### Publish (Gửi actions)
- `/app/join/{roomId}` - Join room
- `/app/room/{roomId}/startgame` - Start game
- `/app/room/{roomId}/fire/{targetId}` - Fire at player
- `/app/room/{roomId}/reload` - Reload gun
- `/app/room/{roomId}/use-item` - Use item

## 🎯 Items trong game

1. 🍺 **Beer** - Eject viên đạn hiện tại
2. 🔫 **Bullet** - Thêm đạn vào súng
3. 🪚 **Chainsaw** - Tăng damage x2 lần bắn tiếp
4. 🚬 **Cigarette** - Hồi 1 HP
5. 🔍 **Glass** - Xem viên đạn hiện tại
6. 🔗 **Handcuffs** - Còng tay mục tiêu (skip turn)
7. 🔭 **Viewfinder** - Xem viên đạn kế tiếp

## 🛠️ Tech Stack

- **React 18** + TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **STOMP.js** + SockJS - WebSocket client

## 📦 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Lint code
```

## 🐛 Troubleshooting

### WebSocket không kết nối?
- Kiểm tra backend đang chạy: `http://localhost:8080`
- Check CORS config trong `WebsocketConfig.java`

### Không nhận được room updates?
- Mở Console (F12) xem WebSocket logs
- Verify subscription topic: `/topic/room/{roomId}`

### Player ID không sync?
- Check backend session attributes
- Verify player được tạo trong handshake

## 📝 TODO / Enhancements

- [ ] Sound effects (gunshot, reload, items)
- [ ] Animations (Framer Motion)
- [ ] Game over screen
- [ ] Player statistics
- [ ] Chat trong phòng
- [ ] Mobile responsive improvements
- [ ] Dark/Light theme toggle
- [ ] Replay/Spectate mode

---

Developed with ❤️ for Buckshot Roulette

