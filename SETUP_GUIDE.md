# 🎯 HƯỚNG DẪN SETUP BUCKSHOT ROULETTE - FULL STACK

## 📋 Tổng quan

Project gồm 2 phần:
- **Backend**: Spring Boot (Java) - Port 8080
- **Frontend**: React + TypeScript - Port 5173

---

## 🚀 SETUP VÀ CHẠY PROJECT

### Bước 1: Chạy Backend (Spring Boot)

```powershell
# Mở terminal tại thư mục root
cd "D:\Thanh\TÀO LAO\Buckshot_Roulette"

# Chạy backend
mvn spring-boot:run
```

✅ Backend sẽ chạy tại: `http://localhost:8080`

### Bước 2: Chạy Frontend (React)

**Mở terminal MỚI:**

```powershell
# Di chuyển vào thư mục frontend
cd "D:\Thanh\TÀO LAO\Buckshot_Roulette\frontend"

# Chạy development server
npm run dev
```

✅ Frontend sẽ chạy tại: `http://localhost:5173`

---

## 🎮 CÁCH CHƠI

### 1. Mở trình duyệt
Truy cập: `http://localhost:5173`

### 2. Tạo phòng hoặc Join phòng

**Option A: Tạo phòng mới**
1. Nhập tên người chơi
2. Click "TẠO PHÒNG MỚI"
3. Ghi nhớ Room ID để share cho bạn bè

**Option B: Join phòng có sẵn**
1. Nhập tên người chơi
2. Nhập Room ID
3. Click "JOIN"

### 3. Chơi game
1. Đợi đủ người chơi vào phòng
2. Click "🎮 BẮT ĐẦU GAME"
3. Theo lượt, mỗi người có thể:
   - **🔫 BẮN**: Chọn mục tiêu và bắn
   - **🔄 NẠP ĐẠN**: Reload súng mới
   - **🎒 ITEMS**: Sử dụng items đặc biệt

---

## 🎯 GAME MECHANICS

### Items trong game

| Icon | Tên | Chức năng |
|------|-----|-----------|
| 🍺 | Beer | Eject viên đạn hiện tại ra khỏi súng |
| 🔫 | Bullet | Thêm 1 viên đạn ngẫu nhiên vào súng |
| 🪚 | Chainsaw | Tăng damage x2 cho lần bắn tiếp theo |
| 🚬 | Cigarette | Hồi 1 HP |
| 🔍 | Glass | Xem viên đạn ở đầu nòng súng |
| 🔗 | Handcuffs | Còng tay mục tiêu (skip 1 lượt) |
| 🔭 | Viewfinder | Xem viên đạn kế tiếp |

### Luật chơi
- Mỗi người có **5 HP**
- Súng có **đạn thật** (gây damage) và **đạn giả** (không gây damage)
- Bắn vào người khác: -1 HP
- Bắn vào bản thân nếu đạn giả: được chơi tiếp
- Người cuối cùng còn sống thắng!

---

## 🏗️ CẤU TRÚC PROJECT

```
Buckshot_Roulette/
├── src/                          # Backend (Spring Boot)
│   └── main/
│       ├── java/
│       │   └── org/example/buckshot_roulette/
│       │       ├── controller/   # REST & WebSocket controllers
│       │       ├── model/        # Game entities
│       │       ├── service/      # Business logic
│       │       └── websocket/    # WebSocket config
│       └── resources/
│           └── application.properties
├── frontend/                     # Frontend (React)
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Pages (Home, Room)
│   │   ├── services/            # WebSocket service
│   │   ├── stores/              # State management
│   │   └── types/               # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── pom.xml                       # Maven config
└── SETUP_GUIDE.md               # This file
```

---

## 🔌 API & WEBSOCKET ENDPOINTS

### REST API
- `POST /api/createroom` - Tạo phòng mới

### WebSocket Endpoints
**Subscribe (nhận updates):**
- `/topic/room/{roomId}` - Room status updates

**Publish (gửi actions):**
- `/app/join/{roomId}` - Join phòng
- `/app/room/{roomId}/startgame` - Bắt đầu game
- `/app/room/{roomId}/fire/{targetId}` - Bắn vào mục tiêu
- `/app/room/{roomId}/reload` - Nạp đạn mới
- `/app/room/{roomId}/use-item` - Sử dụng item

---

## 🛠️ TECH STACK

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Spring WebSocket** + STOMP
- **Maven**

### Frontend
- **React 18** + TypeScript
- **Vite** (build tool)
- **TailwindCSS** (styling)
- **Zustand** (state management)
- **STOMP.js** + SockJS (WebSocket client)
- **React Router** (routing)

---

## 🐛 TROUBLESHOOTING

### Backend không chạy?
```powershell
# Kiểm tra Java version
java -version  # Cần Java 17+

# Clean và rebuild
mvn clean install
mvn spring-boot:run
```

### Frontend không connect WebSocket?
1. Kiểm tra backend đang chạy tại `http://localhost:8080`
2. Mở Console (F12) xem lỗi WebSocket
3. Check file `vite.config.ts` proxy config
4. Verify endpoint `/ws-game` trong backend

### Port đã được sử dụng?
**Backend (8080):**
```powershell
# Tìm process đang dùng port 8080
netstat -ano | findstr :8080
# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Frontend (5173):**
```powershell
# Tương tự với port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Lỗi CORS?
Backend đã config `setAllowedOriginPatterns("*")` trong `WebsocketConfig.java`

---

## 📝 TESTING FLOW

### Test 1: Tạo phòng và join
1. Mở 2 tab browser
2. Tab 1: Tạo phòng → Ghi nhớ Room ID
3. Tab 2: Join phòng với Room ID từ Tab 1
4. Verify cả 2 tab thấy danh sách 2 players

### Test 2: Start game
1. Tab 1: Click "BẮT ĐẦU GAME"
2. Verify cả 2 tab thấy:
   - Số đạn thật/giả
   - Turn indicator
   - Items của mỗi player

### Test 3: Game actions
1. Player có lượt: Click "🔫 BẮN"
2. Chọn target (bản thân hoặc đối thủ)
3. Verify:
   - HP giảm nếu đạn thật
   - Turn chuyển sang người kế
   - Gun counter cập nhật

### Test 4: Use items
1. Click vào item trong inventory
2. Chọn target nếu cần
3. Verify effect được apply

---

## 🎨 UI FEATURES

### Responsive Design
- **Desktop**: 3 columns layout
- **Tablet**: 2 columns
- **Mobile**: Stack layout

### Visual Feedback
- ⚡ Turn indicator với border vàng
- ❤️ Health bars với animation
- 🎯 Selected player highlight
- 🔗 Handcuffed status icon
- ⚔️ Solo mode indicator

### Color Scheme
- Primary: `#8B0000` (Dark Red)
- Accent: `#FFD700` (Gold)
- Background: Gradient từ gray-900 → red-950 → black

---

## 🚀 PRODUCTION BUILD

### Backend
```powershell
mvn clean package
java -jar target/buckshot_roulette-0.0.1-SNAPSHOT.jar
```

### Frontend
```powershell
cd frontend
npm run build
# Output: frontend/dist/
```

Serve static files từ Spring Boot hoặc deploy riêng (Vercel, Netlify).

---

## 📚 DOCUMENTATION

- [Spring Boot WebSocket Guide](https://spring.io/guides/gs/messaging-stomp-websocket/)
- [STOMP.js Documentation](https://stomp-js.github.io/)
- [React Router v6](https://reactrouter.com/)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [TailwindCSS](https://tailwindcss.com/)

---

## 📞 SUPPORT

Nếu gặp vấn đề:
1. Check logs trong Console (F12)
2. Verify cả backend và frontend đang chạy
3. Restart cả 2 services
4. Clear browser cache

---

## ✅ CHECKLIST HOÀN THÀNH

- [x] ✅ Backend Spring Boot setup
- [x] ✅ Frontend React + TypeScript setup
- [x] ✅ WebSocket integration (STOMP)
- [x] ✅ Game components (Gun, Players, Items)
- [x] ✅ Action handlers (Fire, Reload, Use Item)
- [x] ✅ Responsive UI với TailwindCSS
- [x] ✅ State management với Zustand
- [x] ✅ TypeScript types
- [ ] 🔲 Sound effects
- [ ] 🔲 Animations (Framer Motion)
- [ ] 🔲 Game over screen
- [ ] 🔲 Player statistics
- [ ] 🔲 Chat feature
- [ ] 🔲 Spectator mode

---

**Chúc bạn chơi game vui vẻ! 🎯🔫**

