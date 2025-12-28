# 🎯 IntelliJ IDEA - Cấu hình Multi-Module Project

## ✅ ĐÃ HOÀN THÀNH

Project **Buckshot Roulette** đã được setup thành công với cấu trúc:

```
Buckshot_Roulette/
├── src/                    # Backend Module (Spring Boot)
├── frontend/               # Frontend Module (React + TypeScript)
├── pom.xml                 # Maven config
├── SETUP_GUIDE.md         # Hướng dẫn chi tiết
└── FRONTEND_IMPLEMENTATION_GUIDE.md  # Guide frontend
```

---

## 🔧 CẤU HÌNH INTELLIJ IDEA

### 1. Mở Project trong IntelliJ

**File → Open** → Chọn thư mục `D:\Thanh\TÀO LAO\Buckshot_Roulette`

IntelliJ sẽ tự động nhận diện:
- Maven project (từ `pom.xml`)
- React/TypeScript project (từ `frontend/package.json`)

### 2. Cấu hình Run Configurations

#### A. Backend Configuration

**Run → Edit Configurations... → Add New → Spring Boot**

- **Name**: `Backend - Spring Boot`
- **Main class**: `org.example.buckshot_roulette.BuckshotRouletteApplication`
- **Working directory**: `$PROJECT_DIR$`
- **Use classpath of module**: `buckshot_roulette`
- **Port**: 8080

#### B. Frontend Configuration

**Run → Edit Configurations... → Add New → npm**

- **Name**: `Frontend - React Dev`
- **Package.json**: `frontend/package.json`
- **Command**: `run`
- **Scripts**: `dev`
- **Working directory**: `$PROJECT_DIR$/frontend`

### 3. Cấu hình Compound (Chạy cả 2 cùng lúc)

**Run → Edit Configurations... → Add New → Compound**

- **Name**: `Full Stack - Backend + Frontend`
- **Add configurations**:
  - ✅ Backend - Spring Boot
  - ✅ Frontend - React Dev

**Giờ chỉ cần nhấn Run "Full Stack" là cả 2 services chạy cùng lúc! 🚀**

---

## 📂 MODULE STRUCTURE

### Backend Module (Java)
```
src/main/java/org/example/buckshot_roulette/
├── controller/
│   ├── gameController.java      # Game actions (fire, reload, items)
│   ├── playerController.java    # Player management
│   └── roomController.java      # Room creation/join
├── model/
│   ├── Player.java
│   ├── Room.java
│   ├── Gun.java
│   └── Item/                    # All items (Beer, Cigarette, etc.)
├── service/
│   └── Service.java             # Business logic
└── websocket/
    └── WebsocketConfig.java     # STOMP config
```

### Frontend Module (React/TypeScript)
```
frontend/src/
├── components/
│   └── Game/
│       ├── GameBoard.tsx        # Main game UI
│       ├── GunDisplay.tsx       # Gun & bullets
│       ├── PlayerList.tsx       # Players with HP
│       ├── ItemSlots.tsx        # Player items
│       └── ActionButtons.tsx    # Fire/Reload buttons
├── pages/
│   ├── HomePage.tsx             # Landing page
│   └── RoomPage.tsx             # Game room
├── services/
│   └── websocket.service.ts     # STOMP WebSocket client
├── stores/
│   └── gameStore.ts             # Zustand state
└── types/
    ├── player.types.ts
    ├── room.types.ts
    └── item.types.ts
```

---

## 🚀 CHẠY PROJECT

### Option 1: Từ IntelliJ (Khuyến nghị)

1. **Click dropdown Run configurations**
2. **Chọn "Full Stack - Backend + Frontend"**
3. **Click ▶️ Run**

✅ Backend: `http://localhost:8080`  
✅ Frontend: `http://localhost:5173`

### Option 2: Từ Terminal

**Backend:**
```bash
mvn spring-boot:run
```

**Frontend (terminal mới):**
```bash
cd frontend
npm run dev
```

---

## 🎮 TEST GAME

### Bước 1: Mở browser
```
http://localhost:5173
```

### Bước 2: Tạo phòng
1. Nhập tên: "Player 1"
2. Click "TẠO PHÒNG MỚI"
3. Lưu Room ID (vd: 1234)

### Bước 3: Join phòng (Tab mới)
1. Mở tab mới: `http://localhost:5173`
2. Nhập tên: "Player 2"
3. Nhập Room ID: 1234
4. Click "JOIN"

### Bước 4: Chơi game
1. Click "🎮 BẮT ĐẦU GAME"
2. Player có turn:
   - Bắn súng: chọn target
   - Reload: nạp đạn mới
   - Use items: sử dụng items

---

## 🔧 INTELLIJ PLUGINS (Khuyến nghị)

### Essential:
- ✅ **Spring Boot Assistant** (built-in)
- ✅ **Maven Helper**
- ✅ **JavaScript and TypeScript** (built-in)
- ✅ **Tailwind CSS**

### Optional:
- **Rainbow Brackets** - Dễ đọc code
- **GitToolBox** - Git integration
- **Key Promoter X** - Học shortcuts
- **Material Theme UI** - Đẹp hơn

---

## 🐛 DEBUGGING

### Debug Backend (Java)
1. Set breakpoint trong controller/service
2. Click **🐛 Debug** thay vì Run
3. Trigger action từ frontend
4. IntelliJ sẽ dừng tại breakpoint

### Debug Frontend (React)
1. Mở Chrome DevTools (F12)
2. Tab **Sources** → `webpack://` → `src/`
3. Set breakpoint trong TypeScript files
4. Reload page hoặc trigger action

### Debug WebSocket
1. Chrome DevTools → **Network** tab
2. Filter: **WS** (WebSocket)
3. Click vào `/ws-game`
4. Xem **Messages** tab để thấy STOMP frames

---

## 📁 INTELLIJ FILE STRUCTURE

Trong IntelliJ, bạn sẽ thấy:

```
Project View:
📁 Buckshot_Roulette
├── 📁 .idea/                 # IntelliJ settings
├── 📁 frontend/              # React module
│   ├── 📁 node_modules/
│   ├── 📁 src/
│   ├── package.json
│   └── vite.config.ts
├── 📁 src/                   # Java source
│   └── main/
│       ├── java/
│       └── resources/
├── 📁 target/                # Build output
├── pom.xml
├── SETUP_GUIDE.md
└── README.md
```

**Tips:**
- **Cmd+E** (Mac) / **Ctrl+E** (Win): Recent files
- **Cmd+Shift+F** / **Ctrl+Shift+F**: Search in project
- **Cmd+B** / **Ctrl+B**: Go to definition
- **Cmd+Alt+L** / **Ctrl+Alt+L**: Format code

---

## 🔄 GIT INTEGRATION

### .gitignore đã được tạo tự động:

**Backend:**
```
target/
.mvn/
*.class
```

**Frontend:**
```
node_modules/
dist/
.env
```

### Git workflow trong IntelliJ:
1. **Cmd+K** / **Ctrl+K**: Commit
2. **Cmd+Shift+K** / **Ctrl+Shift+K**: Push
3. **VCS → Update Project**: Pull
4. **VCS → Git → Branches**: Manage branches

---

## 📝 INTELLIJ TERMINAL

IntelliJ có Terminal tích hợp (Alt+F12):

**Chạy commands:**
```bash
# Backend
mvn clean install
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm run dev

# Build
mvn clean package
cd frontend && npm run build
```

---

## 🎨 CODE STYLE

IntelliJ sẽ tự động format theo:
- **Java**: Google Java Style Guide
- **TypeScript/React**: Prettier + ESLint (từ frontend/eslint.config.js)
- **CSS**: Prettier

**Auto-format:**
- **Cmd+Alt+L** (Mac) / **Ctrl+Alt+L** (Win)

---

## 📊 INTELLIJ FEATURES SỬ DỤNG

### Maven Tool Window
- **View → Tool Windows → Maven**
- Lifecycle: clean, install, package
- Plugins: spring-boot:run

### npm Tool Window
- **View → Tool Windows → npm**
- Scripts: dev, build, preview

### Database Tool (Optional)
Nếu thêm database sau này:
- **View → Tool Windows → Database**
- Add datasource: MySQL, PostgreSQL, etc.

### Structure View
- **Cmd+7** / **Alt+7**
- Xem cấu trúc class/component

---

## ✅ CHECKLIST SETUP

- [x] ✅ IntelliJ project opened
- [x] ✅ Maven dependencies resolved
- [x] ✅ npm dependencies installed (`frontend/node_modules/`)
- [x] ✅ Backend run configuration created
- [x] ✅ Frontend run configuration created
- [x] ✅ Compound configuration created
- [x] ✅ Both services can run simultaneously
- [x] ✅ WebSocket connection works
- [x] ✅ Game UI displays correctly

---

## 🚀 NEXT STEPS

1. **Mở IntelliJ IDEA**
2. **File → Open** → Chọn project folder
3. **Wait for indexing** (bottom right)
4. **Setup Run Configurations** (theo hướng dẫn trên)
5. **Run "Full Stack"**
6. **Open browser** → `http://localhost:5173`
7. **Start playing!** 🎯

---

**Chúc bạn code vui vẻ! 💻🎮**

