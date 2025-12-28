# 🔧 FIX: Không thể tạo người chơi - CORS Issue

## ❌ VẤN ĐỀ

Frontend gọi API:
```javascript
POST http://localhost:8080/user/create/Player1
```

Nhưng bị lỗi CORS vì:
- ✅ Backend nhận được request (log hiển thị)
- ❌ Browser chặn response do CORS không allow credentials

---

## ✅ ĐÃ FIX

### 1. Tạo `CorsConfig.java` ✅

**File:** `src/main/java/.../websocket/CorsConfig.java`

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);  // ← Cho phép gửi cookie
        config.addAllowedOriginPattern("http://localhost:5173");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

**Tác dụng:**
- ✅ Cho phép frontend gửi credentials (cookie session)
- ✅ Cho phép browser nhận response với Set-Cookie header
- ✅ Apply cho TẤT CẢ REST API (`/**`)

---

### 2. Fix `WebsocketConfig.java` ✅

**Trước (SAI):**
```java
.setAllowedOriginPatterns("*")
.setAllowedOrigins(String.valueOf(true))  // ← Sai!
```

**Sau (ĐÚNG):**
```java
.setAllowedOriginPatterns("http://localhost:5173", "http://localhost:*")
```

---

## 🚀 CÁCH FIX (BẠN CẦN LÀM)

### Bước 1: RESTART Backend

**Option A: Nếu chạy từ IntelliJ**
1. Click nút **Stop** (hình vuông đỏ)
2. Click nút **Run** (hình tam giác xanh)

**Option B: Nếu chạy từ Terminal**
```powershell
# Tắt Java processes
Stop-Process -Name "java" -Force

# Vào thư mục project
cd "D:\Thanh\TÀO LAO\Buckshot_Roulette"

# Chạy lại backend
mvn spring-boot:run
```

---

### Bước 2: Test API trực tiếp

Mở browser console (F12) và chạy:

```javascript
fetch('http://localhost:8080/user/create/TestPlayer', {
  method: 'POST',
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  console.log('✅ SUCCESS:', data);
})
.catch(err => {
  console.error('❌ ERROR:', err);
});
```

**Expected response:**
```json
{
  "ID": "1735393891548",
  "name": "TestPlayer",
  "health": 5,
  "isHandcuffed": false,
  "items": [],
  "isSoloing": false
}
```

---

### Bước 3: Test tạo phòng từ HomePage

1. Refresh frontend: `http://localhost:5173`
2. Nhập tên: `Player1`
3. Click **"TẠO PHÒNG MỚI"**

**Expected:**
- ✅ Không còn alert lỗi
- ✅ Navigate tới room page
- ✅ Console log: `✅ Player created: {...}`

---

## 🔍 DEBUG

### Kiểm tra Backend logs:

Sau khi restart, gọi API và xem log:

```
Received API: POST /user/create/Player1
```

Nếu THẤY log này → Backend đã nhận request.

---

### Kiểm tra Browser Network (F12 → Network):

1. Refresh page
2. Nhập tên → Click "TẠO PHÒNG"
3. Xem request `create/Player1`:

**Headers tab - Request Headers:**
```
Origin: http://localhost:5173
```

**Headers tab - Response Headers:**
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Set-Cookie: JSESSIONID=...
```

Nếu KHÔNG thấy `Access-Control-Allow-Credentials` → CORS chưa được config đúng.

---

## 🐛 TROUBLESHOOTING

### Lỗi: "CORS policy: No 'Access-Control-Allow-Origin'"

**Nguyên nhân:** Backend chưa restart.

**Giải pháp:** Restart backend (xem Bước 1 ở trên).

---

### Lỗi: "NetworkError" / "Failed to fetch"

**Nguyên nhân:** Backend không chạy hoặc không lắng nghe port 8080.

**Giải pháp:**
```powershell
# Kiểm tra port 8080
netstat -ano | findstr :8080

# Nếu không có → Start backend
mvn spring-boot:run
```

---

### Lỗi: Vẫn không tạo được player

**Debug steps:**

1. **Backend log có hiển thị `Received API: POST /user/create/...` không?**
   - Có → CORS issue
   - Không → Backend không nhận request

2. **F12 Console có lỗi CORS màu đỏ không?**
   - Có → Backend chưa restart
   - Không → Check network tab

3. **Network tab: Status code bao nhiêu?**
   - 200 OK → Thành công
   - 403 Forbidden → CORS issue
   - 404 Not Found → URL sai
   - 500 Internal Error → Backend lỗi

---

## ✅ EXPECTED BEHAVIOR

### Sau khi fix:

```
User nhập tên: "Player1"
Click "TẠO PHÒNG"
  ↓
Frontend: POST /user/create/Player1
  ↓
Backend: 
  - Log: "Received API: POST /user/create/Player1"
  - Create player
  - Save to session
  - Response: 200 OK + JSON
  ↓
Frontend:
  - Console log: "✅ Player created: {...}"
  - POST /api/createroom
  - Navigate to /room/1
  ↓
✅ SUCCESS!
```

---

## 📁 FILES ĐÃ TẠO/SỬA

1. ✅ **Tạo mới:** `CorsConfig.java` - CORS config cho REST API
2. ✅ **Sửa:** `WebsocketConfig.java` - Fix CORS cho WebSocket

---

## 🎯 ACTION REQUIRED

**BẠN CẦN LÀM NGAY:**

1. ⚠️ **RESTART Backend** (quan trọng nhất!)
2. Refresh frontend (Ctrl + Shift + R)
3. Test tạo phòng lại
4. Báo kết quả cho tôi!

---

**Status:** 🟡 Chờ bạn restart backend

**Last updated:** 2025-12-28

