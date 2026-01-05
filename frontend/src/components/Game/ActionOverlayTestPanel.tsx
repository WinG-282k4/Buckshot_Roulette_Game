import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';

interface TestAction {
  name: string;
  actionType: string;
  hasTarget: boolean;
}

const testActions: TestAction[] = [
  // Pattern 1: Two-Sided
  { name: 'use chainsaw', actionType: 'use chainsaw', hasTarget: true },
  { name: 'use solo', actionType: 'use solo', hasTarget: true },
  { name: 'use handcuff', actionType: 'use handcuff', hasTarget: true },
  { name: 'attack fake', actionType: 'attack fake', hasTarget: true },

  // Pattern 2: Items
  { name: 'use beer', actionType: 'use beer', hasTarget: false },
  { name: 'use bullet', actionType: 'use bullet', hasTarget: false },
  { name: 'use glass', actionType: 'use glass', hasTarget: false },
  { name: 'use chainsaw (self)', actionType: 'use chainsaw (self)', hasTarget: false },
  { name: 'use medicine', actionType: 'use medicine', hasTarget: false },

  // Pattern 2: Fire
  { name: 'fire yourself real', actionType: 'fire yourself real', hasTarget: false },
  { name: 'fire yourself fake', actionType: 'fire yourself fake', hasTarget: false },
];

const avatarColors = ['black', 'blue', 'brow', 'gray', 'green', 'purple', 'red', 'tim', 'yellow'];

/**
 * ActionOverlay Test Panel Component
 * ===================================
 * Thêm component này vào GameBoard.tsx để test
 */
export const ActionOverlayTestPanel: React.FC = () => {
  const { setRoomStatus, roomStatus } = useGameStore();
  const [selectedAction, setSelectedAction] = useState<string>('use beer');
  const [selectedActor, setSelectedActor] = useState<string>('blue');
  const [isAutoTesting, setIsAutoTesting] = useState(false);

  const triggerAction = (actionType: string) => {
    const testAction = testActions.find(a => a.actionType === actionType);
    if (!testAction) {
      console.warn(`Action ${actionType} not found`);
      return;
    }

    const actorNames = ['Alice', 'Bob', 'Charlie', 'Diana'];

    const mockActionResponse = {
      action: actionType,
      actor: {
        ID: 'test_actor_1',
        name: actorNames[Math.floor(Math.random() * actorNames.length)],
        URLavatar: `/assets/img/avatar/${selectedActor}.png`,
      },
      targetid: testAction.hasTarget ? 'test_target_1' : null,
    };

    // Update roomStatus with action response
    setRoomStatus({
      ...roomStatus,
      actionResponse: mockActionResponse,
    } as Parameters<typeof setRoomStatus>[0]);

    console.log(`✅ Triggered: ${actionType}`, mockActionResponse);
  };

  const runAutoTest = async () => {
    setIsAutoTesting(true);

    for (const action of testActions) {
      triggerAction(action.actionType);
      await new Promise(resolve => setTimeout(resolve, 5300)); // Wait for animation (5s + 0.3s fade)
    }

    setIsAutoTesting(false);
    console.log('✅ Auto test completed!');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 8888,
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid #8a38f5',
        borderRadius: '8px',
        padding: '15px',
        color: '#fff',
        fontFamily: 'monospace',
        maxWidth: '400px',
        maxHeight: '600px',
        overflowY: 'auto',
      }}
    >
      <div style={{ marginBottom: '15px', borderBottom: '1px solid #8a38f5', paddingBottom: '10px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>🧪 ActionOverlay Test</h3>
        <small>Testing all 11 actions</small>
      </div>

      {/* Quick Test Buttons */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#ffaa00' }}>Quick Test:</label>
        <button
          onClick={() => triggerAction('use beer')}
          style={{
            width: '100%',
            padding: '6px',
            marginBottom: '5px',
            background: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          ▶️ Test use beer
        </button>
        <button
          onClick={() => triggerAction('use chainsaw')}
          style={{
            width: '100%',
            padding: '6px',
            marginBottom: '5px',
            background: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          ▶️ Test use chainsaw
        </button>
        <button
          onClick={() => triggerAction('fire yourself real')}
          style={{
            width: '100%',
            padding: '6px',
            marginBottom: '10px',
            background: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          ▶️ Test fire yourself real
        </button>
      </div>

      {/* Action Selector */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: '#ffaa00' }}>Select Action:</label>
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          style={{
            width: '100%',
            padding: '6px',
            marginBottom: '8px',
            background: '#222',
            color: '#fff',
            border: '1px solid #8a38f5',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {testActions.map((action) => (
            <option key={action.actionType} value={action.actionType}>
              {action.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => triggerAction(selectedAction)}
          style={{
            width: '100%',
            padding: '8px',
            background: '#00aa00',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px',
          }}
        >
          Trigger Selected Action
        </button>
      </div>

      {/* Avatar Selector */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: '#ffaa00' }}>Actor Avatar:</label>
        <select
          value={selectedActor}
          onChange={(e) => setSelectedActor(e.target.value)}
          style={{
            width: '100%',
            padding: '6px',
            background: '#222',
            color: '#fff',
            border: '1px solid #8a38f5',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {avatarColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      {/* Auto Test */}
      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={runAutoTest}
          disabled={isAutoTesting}
          style={{
            width: '100%',
            padding: '8px',
            background: isAutoTesting ? '#666' : '#ff6600',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isAutoTesting ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '12px',
          }}
        >
          {isAutoTesting ? '⏳ Testing All 11 Actions...' : '▶️ Test All Actions'}
        </button>
      </div>

      {/* Info */}
      <div style={{ fontSize: '11px', color: '#aaa', borderTop: '1px solid #8a38f5', paddingTop: '10px' }}>
        <p style={{ margin: '5px 0' }}>✅ Component ready for testing</p>
        <p style={{ margin: '5px 0' }}>Each action: 5s display + 0.3s fade out</p>
        <p style={{ margin: '5px 0' }}>Open DevTools (F12) → Console to see logs</p>
      </div>
    </div>
  );
};


