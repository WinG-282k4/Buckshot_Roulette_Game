# Avatar URL Debug Checklist ✅

## What Was Fixed

### 1. **Backend - Player.java** ✅
```java
this.URLavatar = "/assets/avatar/black.png";  // Correct web path
```

### 2. **Backend - Static Serve** ✅
Avatar images copied to: `src/main/resources/static/assets/avatar/`
Files:
- black.png
- blue.png
- brow.png
- gray.png
- green.png
- purple.png
- red.png
- tim.png
- yellow.png

### 3. **Frontend - GameLayout.tsx** ✅
```typescript
const getAvatarImage = (avatarUrl?: string, color?: string): string => {
  if (avatarUrl) {
    console.log('Using avatar URL from backend:', avatarUrl);
    return avatarUrl;  // Uses backend URL directly
  }
  // ... fallback logic
};
```

---

## Testing Steps

### Step 1: Start Backend
```bash
cd D:\Thanh\TÀO LAO\Buckshot_Roulette
mvn spring-boot:run
```

Should see:
```
Tomcat started on port 8080 (http)
```

### Step 2: Verify Avatar Static Files Served
In browser, go to:
```
http://localhost:8080/assets/avatar/black.png
```

Should download or display the image ✅

### Step 3: Start Frontend
```bash
cd D:\Thanh\TÀO LAO\Buckshot_Roulette\frontend
npm run dev
```

### Step 4: Open Game
1. Go to `http://localhost:5173`
2. Create player
3. Create/Join room
4. Watch console (F12)

### Step 5: Check Console Logs
Look for these logs:

**When receiving room update:**
```
📨 Room update received: { ... players: [{URLavatar: "/assets/avatar/black.png", ...}] }
👥 Players in room: {id: "...", name: "..."}
```

**When rendering avatar:**
```
Using avatar URL from backend: /assets/avatar/black.png
```

---

## Avatar URL Flow

### Backend → Frontend:
```
1. Player created with URLavatar = "/assets/avatar/black.png"
2. API response includes URLavatar field
3. Frontend receives Player object with URLavatar
4. GameLayout receives Player.URLavatar
5. getAvatarImage() gets "/assets/avatar/black.png"
6. <img src="/assets/avatar/black.png" /> 
7. Browser requests from http://localhost:8080/assets/avatar/black.png
8. Spring Boot serves from src/main/resources/static/assets/avatar/black.png ✅
```

---

## If Avatars Still Don't Show

### Check 1: Console Logs
Press F12 → Console tab
- Search for "Using avatar URL"
- If NOT found → URLavatar not being sent from backend

### Check 2: Network Tab
F12 → Network tab → Filter by "avatar"
- Should see requests to `/assets/avatar/*.png`
- Status should be 200 ✅
- Status 404 = file not found

### Check 3: Backend
Check console output when player joins room:
```
Player clone thanh (ID: ...) joined room 1
```

Look for player info to see if URLavatar is included.

### Check 4: Static Files
In IDE, check that files exist:
```
src/main/resources/static/assets/avatar/black.png
src/main/resources/static/assets/avatar/blue.png
... etc
```

---

## What Changed in This Session

| File | Change | Status |
|------|--------|--------|
| `Player.java` | URLavatar = "/assets/avatar/black.png" | ✅ |
| Static folder | Added avatar images | ✅ |
| `GameLayout.tsx` | Uses URLavatar from backend | ✅ |
| `RoomPage.tsx` | Proper cleanup on room leave | ✅ |
| `websocket.service.ts` | Proper subscription management | ✅ |

---

## Build Status

✅ **Backend**: Compiled successfully
✅ **Frontend**: Built successfully
✅ **Static files**: Avatar images in place
✅ **Type definitions**: Player.URLavatar added

---

## Expected Result

After these fixes:
1. ✅ Player avatar URL sent from backend
2. ✅ Avatar files served by Spring Boot
3. ✅ Frontend receives and displays avatar
4. ✅ All players show correct avatars in game
5. ✅ Player leaves room properly before joining new room

---

**Last Updated**: December 31, 2025
**Status**: READY FOR TESTING

