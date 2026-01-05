import React, { useState } from 'react';
import ActionOverlay from '../components/Game/ActionOverlay';

interface OverlayData {
  actionType: string;
  actor: {
    ID: string;
    name: string;
    URLavatar: string;
    color: string;
  };
  target?: {
    ID: string;
    name: string;
    URLavatar: string;
    color: string;
  } | null;
}

const avatarMap: Record<string, string> = {
  black: '/assets/img/avatar/black.png',
  blue: '/assets/img/avatar/blue.png',
  brow: '/assets/img/avatar/brow.png',
  gray: '/assets/img/avatar/gray.png',
  green: '/assets/img/avatar/green.png',
  purple: '/assets/img/avatar/purple.png',
  red: '/assets/img/avatar/red.png',
  tim: '/assets/img/avatar/tim.png',
  yellow: '/assets/img/avatar/yellow.png',
};

/**
 * Test Page for ActionOverlay
 * URL: /test/
 *
 * Using official design from dynamic-event.html and overlay.html
 * All images paths configured as specified
 */
const TestPage: React.FC = () => {
  const [showActionOverlay, setShowActionOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState<OverlayData | null>(null);

  const triggerAction = (
    actionType: string,
    actorName: string,
    actorColor: string,
    targetName?: string,
    targetColor?: string
  ) => {
    setOverlayData({
      actionType,
      actor: {
        ID: 'test_actor',
        name: actorName,
        URLavatar: avatarMap[actorColor] || avatarMap['purple'],
        color: actorColor,
      },
      target: targetName ? {
        ID: 'test_target',
        name: targetName,
        URLavatar: avatarMap[targetColor || 'red'] || avatarMap['red'],
        color: targetColor || 'red',
      } : null,
    });
    setShowActionOverlay(true);

    console.log(`✅ Triggered: ${actionType}`, { actorName, targetName });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        color: 'white',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '10px',
          }}>
            🧪 ActionOverlay Test Page
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#e0e7ff',
          }}>
            Test ActionOverlay using official design
          </p>
        </div>

        {/* Test Buttons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginBottom: '40px',
        }}>
          {/* Pattern 1: Two-Sided */}
          <button
            onClick={() => triggerAction('use chainsaw', 'Alice', 'blue', 'Bob', 'red')}
            style={{
              padding: '15px 20px',
              background: '#ff6b6b',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ⚔️ Use Chainsaw
          </button>

          <button
            onClick={() => triggerAction('use solo', 'Alice', 'blue', 'Bob', 'red')}
            style={{
              padding: '15px 20px',
              background: '#ff6b6b',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🎯 Use Solo
          </button>

          <button
            onClick={() => triggerAction('use handcuff', 'Alice', 'blue', 'Bob', 'red')}
            style={{
              padding: '15px 20px',
              background: '#ff6b6b',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🔗 Use Handcuff
          </button>

          <button
            onClick={() => triggerAction('attack fake', 'Alice', 'blue', 'Bob', 'red')}
            style={{
              padding: '15px 20px',
              background: '#ff6b6b',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            💥 Attack Fake
          </button>

          {/* Pattern 2: Self-only Items */}
          <button
            onClick={() => triggerAction('use beer', 'Charlie', 'green')}
            style={{
              padding: '15px 20px',
              background: '#4ecdc4',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🍺 Use Beer
          </button>

          <button
            onClick={() => triggerAction('use bullet', 'Charlie', 'green')}
            style={{
              padding: '15px 20px',
              background: '#4ecdc4',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🔫 Use Bullet
          </button>

          <button
            onClick={() => triggerAction('use glass', 'Charlie', 'green')}
            style={{
              padding: '15px 20px',
              background: '#4ecdc4',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🔍 Use Glass
          </button>

          <button
            onClick={() => triggerAction('use chainsaw (self)', 'Charlie', 'green')}
            style={{
              padding: '15px 20px',
              background: '#4ecdc4',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ⚔️ Prepare Chainsaw
          </button>

          <button
            onClick={() => triggerAction('use medicine', 'Charlie', 'green')}
            style={{
              padding: '15px 20px',
              background: '#4ecdc4',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🚬 Use Medicine
          </button>

          {/* Pattern 3: Fire */}
          <button
            onClick={() => triggerAction('fire yourself real', 'Diana', 'yellow')}
            style={{
              padding: '15px 20px',
              background: '#95e1d3',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🔫 Fire Yourself Real
          </button>

          <button
            onClick={() => triggerAction('fire yourself fake', 'Diana', 'yellow')}
            style={{
              padding: '15px 20px',
              background: '#95e1d3',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🔫 Fire Yourself Fake
          </button>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '40px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '24px' }}>ℹ️ Thông Tin</h2>
          <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Sử dụng design chính thức từ Figma (dynamic-event.html)</li>
            <li>Tất cả image paths đã được configure đúng</li>
            <li>Overlay sẽ hiển thị 5 giây rồi tự động ẩn</li>
            <li>Mở DevTools (F12) → Console để xem logs</li>
            <li>Hiện tại: <strong>{overlayData ? 'Overlay Active' : 'No Overlay'}</strong></li>
          </ul>
        </div>

        {/* Current State */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          fontFamily: 'monospace',
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Current State:</h3>
          <pre style={{
            margin: 0,
            overflow: 'auto',
            fontSize: '12px',
          }}>
{JSON.stringify({
  showActionOverlay,
  overlayData: overlayData ? {
    actionType: overlayData.actionType,
    actor: overlayData.actor?.name,
    target: overlayData.target?.name || 'None',
  } : null,
}, null, 2)}
          </pre>
        </div>
      </div>

      {/* ActionOverlay - Using official design */}
      {overlayData && (
        <ActionOverlay
          actionType={overlayData.actionType}
          actor={overlayData.actor}
          target={overlayData.target}
          isVisible={showActionOverlay}
          onAnimationComplete={() => {
            console.log('✅ Animation completed');
            setShowActionOverlay(false);
            setOverlayData(null);
          }}
        />
      )}
    </div>
  );
};

export default TestPage;

