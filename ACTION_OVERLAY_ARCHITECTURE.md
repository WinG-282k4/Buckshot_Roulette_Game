# Action Overlay Architecture - Buckshot Roulette

## 📋 Tổng Quan

2 file HTML này định nghĩa cấu trúc giao diện **Action Overlay** - các hiệu ứng trực quan hiển thị khi player sử dụng item hoặc bắn súng.

- **overlay.html** - Template cơ bản cho 1 action
- **dynamic-event.html** - Container chứa tất cả 11 action types với horizontal scroll layout

---

## 📁 File Structure

### **overlay.html** - Single Action Template

```html
<div data-layer="Overlay">
  ├─ background layer (darkened overlay)
  ├─ Notify action (text notification)
  └─ Dynamic_Action_Structure (main action content)
      ├─ Avatar_Slot (left - actor avatar)
      ├─ Actor (text - tên người thực hiện)
      ├─ Target (text - tên người bị tác động)
      ├─ Fire image (hiệu ứng bắn)
      ├─ Frame 19 (frame animation)
      └─ Avatar_Slot (right - target avatar, flipped)
```

**Dimensions:**
- Overlay: `1920px × 1080px` (Full screen)
- Dynamic_Action_Structure: `1299px × 621px`
- Background: `2218px × 1070px` (Cho phép overflow effect)

**Styling:**
- Background: `rgba(55.17, 55.17, 55.17, 0.65)` (Semi-transparent dark)
- Position: `absolute` for all elements
- Overflow: `hidden`

---

### **dynamic-event.html** - All Actions Container

```html
<div class="DynamicActionStructure">
  <!-- Width: 18642px (horizontal scroll) -->
  <!-- 11 action sections × ~1299px each -->
  ├─ Action Type=use hchainsaw (left: 0px)
  ├─ Action Type=use beer (left: 1360px)
  ├─ Action Type=Attack fake (left: 4303px)
  ├─ Action Type=use solo (left: 2701px)
  ├─ Action Type=use bullet (left: 5747px)
  ├─ Action Type=use handcuff (left: 7349px)
  ├─ Action Type=use glass (left: 8997px)
  ├─ Action Type=use chainsaw (left: 10358px)
  ├─ Action Type=use medicine (left: 11781px)
  ├─ Action Type=fire yourseft real (left: 13231px)
  └─ Action Type=fire yourseft fake (left: 14847px)
</div>
```

**Dimensions:**
- Container: `18642px × 621px`
- Each section: `1299px × 621px`
- Overflow: `hidden` → Horizontal scroll effect
- Border: `1px #8a38f5 solid` (Purple)

---

## 🎮 Action Types (11 Total)

### **Category 1: Item Usage Actions (8 types)**

#### 1️⃣ **use hchainsaw** (left: 0px)
- **Người thực hiện:** Actor (name)
- **Mục tiêu:** Target (name)
- **Hiệu ứng:**
  - Actor avatar (left)
  - "Fire" image effect
  - Frame 19 animation (rotated 180°)
  - Target avatar (right, flipped)
- **Layout:** Two-sided avatar display

**HTML Structure:**
```html
<div data-layer="Action Type=use hchainsaw" data-action-type="use hchainsaw">
  <!-- Left side: Actor -->
  <img class="AvatarSlot" src="" style="left: 50px; top: 49px; w: 281px; h: 369px;"/>
  <div class="Actor" style="left: 901px; top: 457.34px;">actor</div>
  
  <!-- Center: Fire effect -->
  <img class="Fire" src="" style="left: -106px; top: -108.73px; w: 703px; h: 689.38px;"/>
  
  <!-- Right side: Target -->
  <img class="Frame19" src="" style="left: 951px; top: 531.32px; transform: rotate(180deg);"/>
  <img class="AvatarSlot" src="" style="left: 1287px; top: 474px; transform: rotate(180deg);"/>
  
  <div class="Target">target</div>
</div>
```

---

#### 2️⃣ **use solo** (left: 2701px)
- **Mục tiêu:** 1 opponent (kéo vào solo mode)
- **Hiệu ứng:**
  - Actor avatar (left)
  - "go solo 1" image (large)
  - Target avatar (right, flipped)
  
**Unique Features:**
- `data-action-type="use solo"`
- Actor text ở giữa
- Không có "fire" effect, thay bằng "go solo 1" animation

---

#### 3️⃣ **use beer** (left: 1360px)
- **Mục tiêu:** Self (rút đạn)
- **Hiệu ứng:**
  - Actor avatar (right, flipped)
  - "Beer" item image (center)
  - Actor name
  
**Unique Features:**
- Chỉ có 1 avatar (self-action)
- No target display
- Item image ở giữa (313×313px)

---

#### 4️⃣ **use bullet** (left: 5747px)
- **Mục tiêu:** Self (thêm đạn)
- **Hiệu ứng:**
  - Actor avatar (right)
  - Bullet/item image
  
**Similar to:** use beer
- Self-only action
- No target needed

---

#### 5️⃣ **use glass** (left: 8997px)
- **Mục tiêu:** Self (xem đạn)
- **Hiệu ứng:**
  - Actor avatar
  - Glass/item image (313×313px)
  
**Similar to:** use beer
- Self-only action

---

#### 6️⃣ **use chainsaw** (left: 10358px)
- **Mục tiêu:** Self (chuẩn bị sát thương x2)
- **Hiệu ứng:**
  - Actor avatar
  - Chainsaw image (453.26×453.26px)
  - Rotated 13 degrees
  
**Unique:**
- Larger item image (453.26px)
- Transform: rotate(13deg)

---

#### 7️⃣ **use medicine** (left: 11781px)
- **Mục tiêu:** Self (hồi phục HP)
- **Hiệu ứng:**
  - Actor avatar
  - Medicine/cigarette image (453.26×453.26px)
  - Rotated 1 degree
  
**Similar to:** use chainsaw
- Large item image (453.26px)
- Transform: rotate(1deg)

---

#### 8️⃣ **use handcuff** (left: 7349px)
- **Mục tiêu:** 1 opponent (khóa)
- **Hiệu ứng:**
  - Actor avatar (left)
  - Actor name
  - "go solo 1" image (công cụ khóa)
  - Target avatar (right)
  
**Similar to:** use solo
- Target-based action
- "go solo 1" image for restraint effect

---

### **Category 2: Fire Actions (2 types)**

#### 9️⃣ **fire yourself real** (left: 13231px)
- **Mục tiêu:** Self (bắn vào mình - đạn thật)
- **Hiệu ứng:**
  - Actor avatar (right, flipped)
  - Gun image (385.44×385.44px, rotated -44°)
  - Fire effect (453.53×388.19px, rotated 141°)
  
**Unique:**
- Gun + Fire effect combo
- Different rotation angles
- Self-only action

---

#### 🔟 **fire yourself fake** (left: 14847px)
- **Mục tiêu:** Self (bắn vào mình - đạn giả)
- **Hiệu ứng:**
  - Actor avatar (right)
  - Gun image (407.04×407.04px, rotated -44°)
  - Fire effect (605.9×464.67px, rotated 179°)
  
**Similar to:** fire yourself real
- Different gun/fire size
- Different fire rotation (179°)

---

### **Category 3: Attack Actions (1 type)**

#### 1️⃣1️⃣ **Attack fake** (left: 4303px)
- **Mục tiêu:** 1 opponent (tấn công với đạn giả)
- **Hiệu ứng:**
  - Actor avatar (left)
  - Actor name
  - Fire/attack effect (without gun)
  - Target avatar (right)
  
**Similar to:** use hchainsaw
- Two-sided avatar
- No gun image (pure attack effect)

---

## 🎨 Visual Components

### **Avatar Slots**

**Left Avatar (Actor):**
```css
width: 281px;
height: 369px;
left: 50px;
top: 49px;
position: absolute;
```

**Right Avatar (Target):**
```css
width: 356px;
height: 474px;
left: 1287px;
top: 474px;
position: absolute;
transform: rotate(180deg);      /* Flipped */
transform-origin: top left;
```

---

### **Text Elements**

**Actor Text:**
```css
color: white;
font-size: 150px;
font-family: Inter;
font-weight: 400;
position: absolute;
left: 901px;
top: 457.34px;
width: 368px;
height: 204.01px;
```

**Target Text:**
```css
color: white;
font-size: 150px;
left: 0px;
top: 416.99px;
width: 426px;
height: 204.01px;
```

---

### **Effect Images**

#### Fire Effect
```css
width: 703px;
height: 689.38px;
left: -106px;
top: -108.73px;
position: absolute;
```

#### Gun Image
```css
width: 385.44px;
height: 385.44px;
left: 206px;
top: 402.1px;
transform: rotate(-44deg);
transform-origin: top left;
```

#### Item Images (Beer, Glass, etc.)
```css
width: 313px;
height: 313px;
left: 381px;
top: 154px;
position: absolute;
```

#### Large Item Images (Chainsaw, Medicine)
```css
width: 453.26px;
height: 453.26px;
left: 319.48px; /* or similar */
top: 128px;     /* or similar */
transform: rotate(13deg);       /* Varies per item */
transform-origin: top left;
```

---

## 📊 Layout Breakdown

### **Single Action Section Dimensions**
```
┌─────────────────────────────────┐
│        1299px width             │
│       621px height              │
│                                 │
│  Avatar (L)         Avatar (R)  │
│    281×369            356×474   │
│                                 │
│  Actor Name    [Effect]  Target │
│                                 │
└─────────────────────────────────┘
```

### **Dynamic Event Container**
```
◄─── 18642px total width ─────────────────────────────────►

│ use chainsaw │ use beer │ attack │ use solo │ ... │ fire fake │
│   (0px)      │ (1360px) │(4303px)│(2701px)  │     │(14847px)  │
│   1299px     │  1299px  │ 1299px │  1299px  │     │  1299px   │
```

---

## 🔄 Implementation Approach

### **Option 1: Static HTML Overlay**
```typescript
// Render overlay.html on top of GameLayout
// Replace src="" attributes with actual image paths
// Update actor/target text dynamically
// Show/hide based on action type
```

### **Option 2: Dynamic Scroll in dynamic-event.html**
```typescript
// Use dynamic-event.html as reference template
// Calculate scroll position based on action type
// Scroll to corresponding section using CSS transform
// Animation: transition: transform 0.3s ease

const actionOffsets = {
  'use hchainsaw': 0,
  'use beer': 1360,
  'attack fake': 4303,
  'use solo': 2701,
  'use bullet': 5747,
  'use handcuff': 7349,
  'use glass': 8997,
  'use chainsaw': 10358,
  'use medicine': 11781,
  'fire yourself real': 13231,
  'fire yourself fake': 14847,
};

// CSS Transform
container.style.transform = `translateX(-${actionOffsets[actionType]}px)`;
```

### **Option 3: React Component-based**
```typescript
// Convert overlay.html to React component
// Create <ActionOverlay /> component
// Props: actionType, actor, target, images
// Use Tailwind CSS for positioning instead of inline styles

<ActionOverlay
  actionType="use chainsaw"
  actor={{ name: "Alice", avatar: blueAvatar }}
  target={{ name: "Bob", avatar: redAvatar }}
/>
```

---

## 🎯 Data Mapping

### **Action Type to Layout**
```typescript
const actionLayoutMap = {
  // Two-sided (actor + target)
  'use hchainsaw': 'two-sided',
  'use solo': 'two-sided',
  'use handcuff': 'two-sided',
  'attack fake': 'two-sided',
  
  // Self-only (actor only)
  'use beer': 'self-only',
  'use bullet': 'self-only',
  'use glass': 'self-only',
  'use chainsaw': 'self-only',
  'use medicine': 'self-only',
  'fire yourself real': 'self-only',
  'fire yourself fake': 'self-only',
};
```

### **Item Image Mapping**
```typescript
const itemImageMap = {
  'Beer': { src: beerImg, size: '313×313', rotation: 0 },
  'Bullet': { src: bulletImg, size: '313×313', rotation: 0 },
  'Glass': { src: glassImg, size: '313×313', rotation: 0 },
  'Chainsaw': { src: chainsawImg, size: '453.26×453.26', rotation: 13 },
  'Cigarette': { src: medicineImg, size: '453.26×453.26', rotation: 1 },
  'Handcuffs': { src: handcuffsImg, size: '504×382', rotation: 0 },
};
```

### **Fire Effect Mapping**
```typescript
const fireEffectMap = {
  'fire yourself real': {
    gunSize: '385.44×385.44',
    gunRotation: -44,
    fireSize: '453.53×388.19',
    fireRotation: 141,
  },
  'fire yourself fake': {
    gunSize: '407.04×407.04',
    gunRotation: -44,
    fireSize: '605.9×464.67',
    fireRotation: 179,
  },
};
```

---

## 🎬 Animation Suggestions

### **Overlay Fade-in**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.Overlay {
  animation: fadeIn 0.3s ease-in;
}
```

### **Avatar Entrance**
```css
@keyframes slideInLeft {
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.AvatarSlot:first-of-type {
  animation: slideInLeft 0.4s ease-out;
}
```

### **Fire Effect Explosion**
```css
@keyframes fireExplosion {
  0% { opacity: 0; transform: scale(0.5) rotate(0deg); }
  50% { opacity: 1; }
  100% { opacity: 1; transform: scale(1) rotate(var(--rotation)); }
}

.Fire {
  animation: fireExplosion 0.6s ease-out;
}
```

### **Item Spin**
```css
@keyframes itemSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ItemImage {
  animation: itemSpin 1s ease-in-out;
}
```

---

## 🔗 Integration with GameLayout

### **Overlay Positioning**
```typescript
// In GameLayout.tsx
<div style={{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
}}>
  <ActionOverlay
    actionType={actionResponse?.action}
    actor={actionResponse?.actor}
    target={actionResponse?.targetId}
  />
</div>
```

### **Trigger Conditions**
```typescript
// Show overlay when action response received
if (actionResponse && actionResponse.action) {
  showActionOverlay(actionResponse.action, {
    actor: actionResponse.actor,
    target: actionResponse.targetId,
  });
  
  // Hide after 2-3 seconds
  setTimeout(() => hideActionOverlay(), 2500);
}
```

---

## 📱 Responsive Adaptation

### **Desktop (1920×1080)**
- Full-sized overlay
- All elements scaled to 100%

### **Tablet (1366×768)**
- Scale factor: 0.71
- All dimensions proportionally reduced

### **Mobile (768×1024)**
- Simplified overlay
- Larger text for readability
- Stacked layout instead of side-by-side

---

## 🛠️ Implementation Checklist

- [ ] Extract image paths from assets
- [ ] Create ActionOverlay React component
- [ ] Map action types to layout templates
- [ ] Implement avatar image loading
- [ ] Add CSS animations
- [ ] Integrate with GameLayout
- [ ] Handle overlay timing (auto-hide)
- [ ] Add sound effects (optional)
- [ ] Test all 11 action types
- [ ] Responsive design testing

---

## 📖 References

**File Locations:**
- Template: `frontend/src/assets/img/Example/overlay.html`
- All actions: `frontend/src/assets/img/Example/dynamic-event.html`
- Assets: `frontend/src/assets/img/`

**Related Components:**
- GameLayout.tsx
- GameBoard.tsx
- websocket.service.ts (for action responses)


