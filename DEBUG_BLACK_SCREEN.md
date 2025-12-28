# 🐛 DEBUG: Vào phòng bị đen thui

## ❌ VẤN ĐỀ

Sau khi click "TẠO PHÒNG MỚI" hoặc "THAM GIA", trang chuyển sang room nhưng:
- ❌ Màn hình đen thui
- ❌ Không hiển thị gì
- ❌ Stuck ở màn hình loading

---

## ✅ ĐÃ THÊM DEBUG MODE

Tôi đã thêm **console logs** và **UI debug info** để giúp bạn tìm ra vấn đề.

### Files đã cập nhật:
1. ✅ `GameBoard.tsx` - Hiển thị debug info thay vì màn hình đen
2. ✅ `RoomPage.tsx` - Log chi tiết quá trình connect

---

## 🔍 CÁCH DEBUG

### Bước 1: Mở F12 Console

1. Refresh frontend (Ctrl + Shift + R)
2. Nhập tên → Click "TẠO PHÒNG MỚI"
3. **Mở F12** → Tab **Console**

---

### Bước 2: Xem Console Logs

Bạn sẽ thấy các logs theo thứ tự:

#### ✅ CASE 1: THÀNH CÔNG
```
🔄 Creating player: Player1
✅ Player created/verified: {ID: "...", name: "Player1"}
🔌 Setting up WebSocket callbacks...
🚀 Connecting to WebSocket...
[STOMP] Connecting...
✅ WebSocket connected! Joining room: 1
📨 Room update received: {status: "WAITING", players: [...]}
👤 Found my player: {ID: "...", name: "Player1"}
🎮 GameBoard render - roomStatus: {status: "WAITING", ...}
```

→ **UI sẽ hiển thị phòng chơi với danh sách players!**

---

#### ❌ CASE 2: Player không tạo được
```
🔄 Creating player: Player1
❌ Error creating player: TypeError: Failed to fetch
[ALERT] Không thể tạo người chơi...
```

**Nguyên nhân:** CORS hoặc backend không chạy.

**Giải pháp:**
- Restart backend (xem `FIX_CORS_ISSUE.md`)
- Kiểm tra backend chạy: `http://localhost:8080`

---

#### ❌ CASE 3: WebSocket không connect
```
✅ Player created/verified: {...}
🚀 Connecting to WebSocket...
[STOMP] Connecting...
❌ STOMP error: {...}
```

**Nguyên nhân:** WebSocket endpoint sai hoặc backend WebSocket không hoạt động.

**Giải pháp:**
- Kiểm tra backend log có lỗi không
- Verify endpoint: `/ws-game` có đúng không

---

#### ❌ CASE 4: Join room không nhận response
```
✅ WebSocket connected! Joining room: 1
(không có log "📨 Room update")
```

**Nguyên nhân:** Backend không broadcast room update hoặc player không được thêm vào room.

**Giải pháp:** Xem backend logs:
```
Received API: WebSocket /app/join/1 by player ...
```

Nếu không thấy log này → Backend không nhận message.

---

### Bước 3: Xem UI Debug Info

Nếu stuck ở loading, bạn sẽ thấy:

```
┌─────────────────────────────────────┐
│   🎯 BUCKSHOT ROULETTE              │
│                                     │
│   ⏳ Đang chờ dữ liệu từ server...  │
│                                     │
│   🔍 Debug Info:                    │
│   • roomStatus: NULL                │
│   • WebSocket: Kiểm tra F12 Console│
│   • Nếu không thấy log "📨 Room    │
│     update" → WebSocket chưa nhận   │
│                                     │
│   💡 Nếu bị stuck, reload (F5)      │
└─────────────────────────────────────┘
```

---

## 🔧 COMMON FIXES

### Fix 1: Backend chưa chạy

```powershell
# Kiểm tra port 8080
netstat -ano | findstr :8080

# Nếu không có → Start backend
cd "D:\Thanh\TÀO LAO\Buckshot_Roulette"
mvn spring-boot:run
```

---

### Fix 2: CORS chưa fix

Làm theo `FIX_CORS_ISSUE.md`:
1. Tạo file `CorsConfig.java`
2. Restart backend
3. Test lại

---

### Fix 3: WebSocket service bị lỗi

Kiểm tra file `websocket.service.ts` có đúng không:

```typescript
constructor(serverUrl: string = 'http://localhost:8080') {
  this.client = new Client({
    webSocketFactory: () => new SockJS(`${serverUrl}/ws-game`),
    // ...
  });
}
```

**Endpoint phải là:** `/ws-game` (KHÔNG có `/websocket` ở cuối)

---

### Fix 4: Clear cache & hard refresh

```
Ctrl + Shift + Delete → Clear cache
Ctrl + Shift + R → Hard refresh
```

---

## 📊 EXPECTED BEHAVIOR

### Timeline thành công:

```
0s:   User click "TẠO PHÒNG MỚI"
      ↓
0.1s: POST /user/create/Player1
      ← 200 OK {player object}
      ↓
0.2s: POST /api/createroom
      ← 200 OK "Room 1 created"
      ↓
0.3s: Navigate to /room/1?name=Player1
      ↓
0.4s: RoomPage render
      ↓
0.5s: Create player (verify)
      ↓
0.6s: WebSocket connect
      [STOMP] Connecting...
      ↓
0.8s: WebSocket connected
      ↓
0.9s: Send /app/join/1
      ↓
1.0s: Backend broadcast room update
      ← /topic/room/1: {status: "WAITING", players: [Player1]}
      ↓
1.1s: Frontend receive & update state
      ↓
1.2s: GameBoard render với roomStatus
      ✅ UI hiển thị phòng chơi!
```

**Total time:** ~1-2 giây

---

## 🎯 ACTION STEPS

### Bây giờ bạn làm:

1. **Refresh frontend** (Ctrl + Shift + R)
2. **Mở F12 Console** (quan trọng!)
3. Nhập tên → Click "TẠO PHÒNG"
4. **Xem console logs**
5. Screenshot và gửi cho tôi nếu vẫn lỗi

---

## 📸 SCREENSHOTS NẾU LỖI

Nếu vẫn bị đen thui, gửi cho tôi:

1. **Screenshot F12 Console** (toàn bộ logs)
2. **Screenshot F12 Network** (tab WebSocket nếu có)
3. **Backend terminal logs** (phần sau khi click "TẠO PHÒNG")

---

## 💡 QUICK TEST

Test trực tiếp trong F12 Console:

```javascript
// Test 1: Backend có chạy không?
fetch('http://localhost:8080/api/createroom', {method: 'POST'})
  .then(r => r.text())
  .then(console.log);

// Test 2: Tạo player có được không?
fetch('http://localhost:8080/user/create/Test', {
  method: 'POST',
  credentials: 'include'
})
.then(r => r.json())
.then(console.log);
```

Nếu cả 2 test đều **thành công** → Vấn đề là WebSocket.

---

**Status:** 🟡 Chờ bạn test và gửi console logs

**Last updated:** 2025-12-28

