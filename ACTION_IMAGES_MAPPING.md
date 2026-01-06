# Action Overlay - Image Assets Mapping

## 📁 Asset Directory Structure

```
frontend/src/assets/img/
├── background/
│   └── background event.png          ← Overlay background
├── Action/
│   ├── chainsaw gun.png              ← use chainsaw effect
│   ├── go solo.png                   ← use solo effect
│   ├── còng tay.jpeg                 ← use handcuff effect
│   ├── hit fake.png                  ← attack fake effect
│   ├── gun hit.png
│   ├── Hit.png
│   └── use.png
├── Gun/
│   └── gun2d(no bg).png              ← Gun 2D (for attack fake & fire actions)
├── avatar/
│   ├── black.png
│   ├── blue.png
│   ├── brow.png
│   ├── gray.png
│   ├── green.png
│   ├── purple.png
│   ├── red.png
│   ├── tim.png
│   └── yellow.png
├── item/
│   ├── Beer.png
│   ├── bullet.png
│   ├── chainsaw.png
│   ├── glass.png
│   └── ...
└── effect/
    ├── handcuffed.jpg
    ├── soloing.jpg
    └── ...
```

---

## 🎮 Pattern 1: Two-Sided Actions (Actor + Target)

### **Action 1: attack real


---

### **Action 2: use solo**
- **Location:** `left: 2701px`
- **Actor Avatar:** (left: 50px, top: 49px, 281×369px)
- **Target Avatar:** (left: 1287px, top: 474px, 356×474px, rotated 180°)
- **Effect Image:** `frontend/src/assets/img/Action/go solo.png`
  - Dimensions: 896×896px
  - Position: left: 189px, top: -165px
  - Z-index: Between actors

**Data:**
```typescript
{
  actionType: 'use solo',
  layout: 'two-sided',
  effectImage: '/assets/img/Action/go solo.png',
  effectSize: { width: 896, height: 896 },
  effectPosition: { left: 189, top: -165 },
}
```

---

### **Action 3: use handcuff**
- **Location:** `left: 7349px`
- **Actor Avatar:** (left: 50px, top: 49px, 281×369px)
- **Target Avatar:** (left: 1287px, top: 474px, 356×474px, rotated 180°)
- **Effect Image:** `frontend/src/assets/img/Action/còng tay.jpeg`
  - Dimensions: 504×382px
  - Position: left: 398px, top: 49px
  - Z-index: Between actors

**Data:**
```typescript
{
  actionType: 'use handcuff',
  layout: 'two-sided',
  effectImage: '/assets/img/Action/còng tay.jpeg',
  effectSize: { width: 504, height: 382 },
  effectPosition: { left: 398, top: 49 },
}
```

---

### **Action 4: attack fake**
- **Location:** `left: 4303px`
- **Actor Avatar:** (left: 50px, top: 49px, 281×369px)
- **Target Avatar:** (left: 1287px, top: 474px, 356×474px, rotated 180°)
- **Effect Image:** `frontend/src/assets/img/Action/hit fake.png`
  - Dimensions: 703×689.38px
  - Position: left: -106px, top: -108.73px
- **Gun Image:** `frontend/src/assets/img/Gun/gun2d(no bg).png`
  - Dimensions: 455×518.99px
  - Position: left: 951px, top: 531.32px
  - Transform: rotate(180deg)

**Data:**
```typescript
{
  actionType: 'attack fake',
  layout: 'two-sided',
  effectImage: '/assets/img/Action/hit fake.png',
  effectSize: { width: 703, height: 689.38 },
  effectPosition: { left: -106, top: -108.73 },
  gunImage: '/assets/img/Gun/gun2d(no bg).png',
  gunSize: { width: 455, height: 518.99 },
  gunPosition: { left: 951, top: 531.32 },
  gunRotation: 180,
}
```

---

## 🎮 Pattern 2: Self-Only Actions (Actor Only)

### **Action 5: use beer**
- **Location:** `left: 1360px`
- **Actor Avatar:** (left: 981px, top: 504px, 356×474px, rotated 180°)
- **Item Image:** `frontend/src/assets/img/item/Beer .png`
  - Dimensions: 313×313px
  - Position: left: 381px, top: 154px

---

### **Action 6: use bullet**
- **Location:** `left: 5747px`
- **Actor Avatar:** (left: 981px, top: 504px, 356×474px, rotated 180°)
- **Item Image:** `frontend/src/assets/img/item/bullet.png`
  - Dimensions: 313×313px
  - Position: left: 381px, top: 154px

---

### **Action 7: use glass**
- **Location:** `left: 8997px`
- **Actor Avatar:** (left: 981px, top: 504px, 356×474px, rotated 180°)
- **Item Image:** `frontend/src/assets/img/item/glass.png`
  - Dimensions: 313×313px
  - Position: left: 396px, top: 81px

---

### **Action 8: use chainsaw**
- **Location:** `left: 10358px`
- **Actor Avatar:** (left: 981px, top: 504px, 356×474px, rotated 180°)
- **Item Image:** `frontend/src/assets/img/Action/chainsaw gun.png`
  - Dimensions: 453.26×453.26px
  - Position: left: 319.48px, top: 128px
  - Transform: rotate(13deg)

---

### **Action 9: use medicine** (Cigarette/Vigor)
- **Location:** `left: 11781px`
- **Actor Avatar:** (left: 981px, top: 504px, 356×474px, rotated 180°)
- **Item Image:** `frontend/src/assets/img/item/vigerate.png`
  - Dimensions: 453.26×453.26px
  - Position: left: 325.12px, top: 104px
  - Transform: rotate(1deg)

---

### **Action 10: fire yourself real**
- **Location:** `left: 13231px`
- **Actor Avatar:** (left: 981px, top: 504px, 356×474px, rotated 180°)
- **Gun Image:** `frontend/src/assets/img/Gun/gun2d(no bg).png`
  - Dimensions: 385.44×385.44px
  - Position: left: 206px, top: 402.1px
  - Transform: rotate(-44deg)
- **Fire Effect:** `frontend/src/assets/img/effect/hited/hit3.png`
  - Dimensions: 453.53×388.19px
  - Position: left: 1049.71px, top: 170.37px
  - Transform: rotate(141deg)

---

### **Action 11: fire yourself fake**
- **Location:** `left: 14847px`
- **Actor Avatar:** (left: 981px, top: 504px, 356×474px, rotated 180°)
- **Gun Image:** `frontend/src/assets/img/Gun/gun2d(no bg).png`
  - Dimensions: 407.04×407.04px
  - Position: left: 227px, top: 391.24px
  - Transform: rotate(-44deg)
- **Fire Effect:** `frontend/src/assets/img/Action/khói.png`
  - Dimensions: 605.9×464.67px
  - Position: left: 1064.58px, top: 400.51px
  - Transform: rotate(179deg)

---

## 🎮 Pattern 3: Attack Actions (Gun-based)

### **Common Gun Image for Attacks**
- **Gun Source:** `frontend/src/assets/img/Gun/gun2d(no bg).png`

### **Action 4: attack real** (if exists)
- **Effect Image:** `frontend/src/assets/img/Action/gun hit.png`
  - Dimensions: 703×689.38px (standard)
  - Position: left: -106px, top: -108.73px

### **Action: attack fake**
- **Effect Image:** `frontend/src/assets/img/Action/hit fake.png`
  - Dimensions: 703×689.38px (standard)
  - Position: left: -106px, top: -108.73px
- **Gun Image:** `frontend/src/assets/img/Gun/gun2d(no bg).png`
  - Dimensions: 455×518.99px
  - Position: left: 951px, top: 531.32px
  - Transform: rotate(180deg)

---

## 🎬 Overlay Container

### **Background Layer**
```
Size: 1920×1080px (full screen)
Background Image: frontend/src/assets/img/background/background event.png
Background Color: rgba(55.17, 55.17, 55.17, 0.65) (semi-transparent dark)
```

---

## 💾 Complete Action Mapping Table

| # | Action Type | Location | Layout | Effect/Item Image | Gun Image | Actor Avatar | Target Avatar |
|---|---|---|---|---|---|---|---|
| 1 |attack real
| 2 | use solo | 2701px | Two-sided | go solo.png | - | ✅ | ✅ |
| 3 | use handcuff | 7349px | Two-sided | còng tay.jpeg | - | ✅ | ✅ |
| 4 | attack fake | 4303px | Two-sided | hit fake.png | gun2d.png | ✅ | ✅ |
| 5 | use beer | 1360px | Self-only | Beer .png | - | ✅ | ❌ |
| 6 | use bullet | 5747px | Self-only | bullet.png | - | ✅ | ❌ |
| 7 | use glass | 8997px | Self-only | glass.png | - | ✅ | ❌ |
| 8 | use chainsaw | 10358px | Self-only | chainsaw gun.png | - | ✅ | ❌ |
| 9 | use medicine | 11781px | Self-only | vigerate.png | - | ✅ | ❌ |
| 10 | fire yourself real | 13231px | Self-only | hit3.png | gun2d.png | ✅ | ❌ |
| 11 | fire yourself fake | 14847px | Self-only | khói.png | gun2d.png | ✅ | ❌ |

---

## 🛠️ Implementation Guide

### **Import Images in React**
```typescript
// Background
import backgroundEventImg from '@/assets/img/background/background event.png';

// Pattern 1 - Two-sided actions
import chainsawGunImg from '@/assets/img/Action/chainsaw gun.png';
import goSoloImg from '@/assets/img/Action/go solo.png';
import handcuffImg from '@/assets/img/Action/còng tay.jpeg';
import hitFakeImg from '@/assets/img/Action/hit fake.png';

// Pattern 2 - Self-only item actions
import beerImg from '@/assets/img/item/Beer .png';
import bulletImg from '@/assets/img/item/bullet.png';
import glassImg from '@/assets/img/item/glass.png';
import vigerateImg from '@/assets/img/item/vigerate.png';

// Pattern 2 - Fire actions (self-cast)
import hit3Img from '@/assets/img/effect/hited/hit3.png';
import khoiImg from '@/assets/img/Action/khói.png';

// Pattern 3 - Gun & Attack effects
import gun2dImg from '@/assets/img/Gun/gun2d(no bg).png';
import gunHitImg from '@/assets/img/Action/gun hit.png';

// Avatars
import { AVATAR_MAP } from '@/utils/avatarMap';
```

### **Action Configuration**
```typescript
const actionConfig = {
  // ========== PATTERN 1: Two-Sided Actions ==========
  //Thay use chainsaw thành attack real do trước đó ghi nầm
  'use chainsaw': {
    type: 'two-sided',
    background: backgroundEventImg,
    effect: {
      image: chainsawGunImg,
      width: 703,
      height: 689.38,
      left: -106,
      top: -108.73,
    },
  },
  'use solo': {
    type: 'two-sided',
    background: backgroundEventImg,
    effect: {
      image: goSoloImg,
      width: 896,
      height: 896,
      left: 189,
      top: -165,
    },
  },
  'use handcuff': {
    type: 'two-sided',
    background: backgroundEventImg,
    effect: {
      image: handcuffImg,
      width: 504,
      height: 382,
      left: 398,
      top: 49,
    },
  },
  'attack fake': {
    type: 'two-sided',
    background: backgroundEventImg,
    effect: {
      image: hitFakeImg,
      width: 703,
      height: 689.38,
      left: -106,
      top: -108.73,
    },
    gun: {
      image: gun2dImg,
      width: 455,
      height: 518.99,
      left: 951,
      top: 531.32,
      rotation: 180,
    },
  },
  
  // ========== PATTERN 2: Self-Only Actions (Items) ==========
  'use beer': {
    type: 'self-only',
    background: backgroundEventImg,
    item: {
      image: beerImg,
      width: 313,
      height: 313,
      left: 381,
      top: 154,
    },
  },
  'use bullet': {
    type: 'self-only',
    background: backgroundEventImg,
    item: {
      image: bulletImg,
      width: 313,
      height: 313,
      left: 381,
      top: 154,
    },
  },
  'use glass': {
    type: 'self-only',
    background: backgroundEventImg,
    item: {
      image: glassImg,
      width: 313,
      height: 313,
      left: 396,
      top: 81,
    },
  },
  'use chainsaw (self)': {
    type: 'self-only',
    background: backgroundEventImg,
    item: {
      image: chainsawGunImg,
      width: 453.26,
      height: 453.26,
      left: 319.48,
      top: 128,
      rotation: 13,
    },
  },
  'use medicine': {
    type: 'self-only',
    background: backgroundEventImg,
    item: {
      image: vigerateImg,
      width: 453.26,
      height: 453.26,
      left: 325.12,
      top: 104,
      rotation: 1,
    },
  },
  
  // ========== PATTERN 2: Self-Only Actions (Fire) ==========
  'fire yourself real': {
    type: 'self-only',
    background: backgroundEventImg,
    gun: {
      image: gun2dImg,
      width: 385.44,
      height: 385.44,
      left: 206,
      top: 402.1,
      rotation: -44,
    },
    effect: {
      image: hit3Img,
      width: 453.53,
      height: 388.19,
      left: 1049.71,
      top: 170.37,
      rotation: 141,
    },
  },
  'fire yourself fake': {
    type: 'self-only',
    background: backgroundEventImg,
    gun: {
      image: gun2dImg,
      width: 407.04,
      height: 407.04,
      left: 227,
      top: 391.24,
      rotation: -44,
    },
    effect: {
      image: khoiImg,
      width: 605.9,
      height: 464.67,
      left: 1064.58,
      top: 400.51,
      rotation: 179,
    },
  },
};
```

---

## ✅ Checklist for Implementation

- [ ] Verify all image files exist in correct directories
- [ ] Update ActionOverlay component with image imports
- [ ] Create action configuration mapping
- [ ] Test rendering for each of 11 actions
- [ ] Verify image scaling on different screen sizes
- [ ] Test animation transitions
- [ ] Verify overlay background rendering
- [ ] Test avatar positioning (both sides)
- [ ] Verify gun + effect positioning
- [ ] Check z-index layering
- [ ] Test on mobile/tablet responsive sizes


