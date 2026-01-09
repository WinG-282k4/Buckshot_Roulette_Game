// 🧪 Test ActionOverlay - Test Script
// Chạy trong Browser Console (F12)

/**
 * TEST 1: Test Single Action
 * ===========================
 */
function testSingleAction(actionType = 'use beer') {
  console.log(`🎬 Testing: ${actionType}`);

  // Simulate action response
  const mockActionResponse = {
    action: actionType,
    actor: {
      ID: 'test_actor_1',
      name: actionType.includes('solo') || actionType.includes('handcuff') || actionType.includes('chainsaw') && actionType !== 'use chainsaw (self)' || actionType === 'attack fake'
        ? 'Alice'
        : actionType.includes('fire')
        ? 'Bob'
        : 'Charlie',
      URLavatar: '/assets/img/avatar/blue.png'
    },
    targetid: (actionType.includes('solo') || actionType.includes('handcuff') || actionType === 'attack fake' || (actionType.includes('chainsaw') && actionType !== 'use chainsaw (self)'))
      ? 'test_target_1'
      : null,
  };

  // Update Zustand store
  try {
    // Method 1: Direct window reference
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).__gameStoreInstance) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__gameStoreInstance.setRoomStatus({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(window as any).__gameStoreInstance.roomStatus,
        actionResponse: mockActionResponse
      });
      console.log('✅ Action triggered via window reference');
      return;
    }

    // Method 2: Try to access from React DevTools
    const stores = Object.keys(window).filter(k => k.includes('store') || k.includes('zustand'));
    console.log('Available stores:', stores);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * TEST 2: Test All 11 Actions Sequentially
 * ==========================================
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testAllActions() {
  const allActions = [
    // Pattern 1: Two-Sided
    { name: 'use chainsaw', delay: 3500 },
    { name: 'use solo', delay: 3500 },
    { name: 'use handcuff', delay: 3500 },
    { name: 'attack fake', delay: 3500 },

    // Pattern 2: Items
    { name: 'use beer', delay: 3500 },
    { name: 'use bullet', delay: 3500 },
    { name: 'use glass', delay: 3500 },
    { name: 'use chainsaw (self)', delay: 3500 },
    { name: 'use medicine', delay: 3500 },

    // Pattern 2: Fire
    { name: 'fire yourself real', delay: 3500 },
    { name: 'fire yourself fake', delay: 3500 },
  ];

  let index = 0;

  function triggerNext() {
    if (index >= allActions.length) {
      console.log('✅ Test Complete! All 11 actions tested.');
      return;
    }

    const action = allActions[index];
    console.log(`\n📍 ${index + 1}/11: Testing "${action.name}"`);
    testSingleAction(action.name);

    index++;
    setTimeout(triggerNext, action.delay);
  }

  triggerNext();
}

/**
 * TEST 3: Test with Target Player
 * ================================
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testActionWithTarget(actionType = 'use solo') {
  console.log(`🎬 Testing: ${actionType} with target`);

  const mockActionResponse = {
    action: actionType,
    actor: {
      ID: 'player_1',
      name: 'Alice',
      URLavatar: '/assets/img/avatar/blue.png'
    },
    targetid: 'player_2',
  };

  // This should trigger GameBoard useEffect
  console.log('Mock response:', mockActionResponse);
}

/**
 * TEST 4: Performance Test
 * ========================
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testPerformance() {
  console.log('📊 Starting performance test...');

  const startTime = performance.now();

  // Trigger multiple actions
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      testSingleAction('use beer');
    }, i * 3000);
  }

  setTimeout(() => {
    const endTime = performance.now();
    console.log(`⏱️ Performance test completed in ${(endTime - startTime).toFixed(2)}ms`);
  }, 5 * 3000);
}

/**
 * TEST 5: Check Component Mounted
 * ================================
 */
function checkComponentStatus() {
  console.log('\n🔍 Checking component status...');

  // Check if ActionOverlay component exists
  const overlay = document.querySelector('[style*="position: fixed"][style*="z-index: 9999"]');

  if (overlay) {
    console.log('✅ ActionOverlay component is mounted');
    console.log('   - Position: fixed');
    console.log('   - Z-Index: 9999');
  } else {
    console.log('❌ ActionOverlay component not found in DOM');
  }

  // Check for avatars
  const avatars = document.querySelectorAll('img[alt="Actor"], img[alt="Target"]');
  console.log(`✅ Found ${avatars.length} avatar images`);

  // Check for animations
  const animatedElements = document.querySelectorAll('[style*="animation"]');
  console.log(`✅ Found ${animatedElements.length} animated elements`);
}

/**
 * TEST 6: Test Avatar Images
 * ===========================
 */
function testAvatarImages() {
  console.log('\n🖼️ Testing avatar images...');

  const avatarColors = ['black', 'blue', 'brow', 'gray', 'green', 'purple', 'red', 'tim', 'yellow'];

  avatarColors.forEach(color => {
    const img = new Image();
    const path = `/assets/img/avatar/${color}.png`;

    img.onload = () => console.log(`✅ ${color}.png loaded successfully`);
    img.onerror = () => console.error(`❌ Failed to load ${color}.png`);

    img.src = path;
  });
}

/**
 * TEST 7: Test Effect Images
 * ===========================
 */
function testEffectImages() {
  console.log('\n⚡ Testing effect images...');

  const effects = [
    '/assets/img/Action/chainsaw gun.png',
    '/assets/img/Action/go solo.png',
    '/assets/img/Action/còng tay.jpeg',
    '/assets/img/Action/hit fake.png',
    '/assets/img/Action/khói.png',
    '/assets/img/Gun/gun2d(no bg).png',
    '/assets/img/effect/hited/hit3.png',
    '/assets/img/background/background event.png',
  ];

  effects.forEach(path => {
    const img = new Image();
    img.onload = () => console.log(`✅ ${path.split('/').pop()} loaded`);
    img.onerror = () => console.error(`❌ Failed to load ${path.split('/').pop()}`);
    img.src = path;
  });
}

/**
 * TEST 8: Test Store Integration
 * ===============================
 */
function testStoreIntegration() {
  console.log('\n🏪 Testing Zustand store...');

  try {
    // Try to find store in window
    const storeKeys = Object.keys(window).filter(key =>
      key.toLowerCase().includes('store') ||
      key.toLowerCase().includes('zustand')
    );

    if (storeKeys.length > 0) {
      console.log('Found store references:', storeKeys);
    } else {
      console.warn('⚠️ No store references found in window object');
      console.log('   Try accessing store from React DevTools');
    }
  } catch (error) {
    console.error('Error checking store:', error);
  }
}

/**
 * COMPREHENSIVE TEST SUITE
 * =========================
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runFullTestSuite() {
  // console.clear();
  // console.log('🚀 ActionOverlay Full Test Suite\n');

  // console.log('=== TEST 1: Component Status ===');
  checkComponentStatus();

  // console.log('\n=== TEST 2: Avatar Images ===');
  testAvatarImages();

  // console.log('\n=== TEST 3: Effect Images ===');
  testEffectImages();

  // console.log('\n=== TEST 4: Store Integration ===');
  testStoreIntegration();

  // console.log('\n=== TEST 5: Single Action ===');
  // console.log('Testing "use beer"...');
  testSingleAction('use beer');

  // console.log('\n✅ Test suite completed!');
  // console.log('\nAvailable test functions:');
  // console.log('  testSingleAction(actionType) - Test one action');
  // console.log('  testAllActions() - Test all 11 actions');
  // console.log('  testActionWithTarget(actionType) - Test with target');
  // console.log('  testPerformance() - Performance test');
  // console.log('  checkComponentStatus() - Check component mounted');
  // console.log('  testAvatarImages() - Test avatar image loading');
  // console.log('  testEffectImages() - Test effect image loading');
  // console.log('  testStoreIntegration() - Check store integration');
  // console.log('  runFullTestSuite() - Run all tests');
}

// Auto-run on load
// console.log('%c🧪 ActionOverlay Test Script Ready', 'color: #00ff00; font-size: 16px; font-weight: bold;');
// console.log('%cAvailable commands:', 'color: #ffaa00; font-weight: bold;');
// console.log('  runFullTestSuite() - Run comprehensive tests');
// console.log('  testSingleAction("action_name") - Test one action');
// console.log('  testAllActions() - Test all 11 actions sequentially');
// console.log('  checkComponentStatus() - Verify component is mounted');

