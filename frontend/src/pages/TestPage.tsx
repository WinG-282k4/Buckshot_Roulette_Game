import { useState } from 'react';
import ActionOverlay from '../components/Game/ActionOverlay';
import './TestPage.css';

// Import avatar
import purpleAvatar from '@/assets/img/avatar/purple.png';

interface Player {
  ID: string;
  name: string;
  URLavatar: string;
}

export default function TestPage() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const mockActor: Player = {
    ID: 'player1',
    name: 'Player 1',
    URLavatar: purpleAvatar,
  };

  const mockTarget: Player = {
    ID: 'player2',
    name: 'Player 2',
    URLavatar: purpleAvatar,
  };

  const testActions = [
    // Pattern 1: Two-Sided Actions
    {
      id: 'attack_real',
      label: 'Attack Real',
      action: 'attack real'
    },
    {
      id: 'use_solo',
      label: 'Use Solo',
      action: 'use solo'
    },
    {
      id: 'use_handcuff',
      label: 'Use Handcuff',
      action: 'use handcuff'
    },
    {
      id: 'attack_fake',
      label: 'Attack Fake',
      action: 'attack fake'
    },

    // Pattern 2: Self-Only Actions (Items)
    {
      id: 'use_beer',
      label: 'Use Beer',
      action: 'use beer'
    },
    {
      id: 'use_bullet',
      label: 'Use Bullet',
      action: 'use bullet'
    },
    {
      id: 'use_glass',
      label: 'Use Glass',
      action: 'use glass'
    },
    {
      id: 'use_chainsaw',
      label: 'Use Chainsaw',
      action: 'use chainsaw'
    },
    {
      id: 'use_medicine',
      label: 'Use Medicine',
      action: 'use medicine'
    },

    // Pattern 2: Self-Only Actions (Fire)
    {
      id: 'fire_yourself_real',
      label: 'Fire Yourself Real',
      action: 'fire yourseft real'
    },
    {
      id: 'fire_yourself_fake',
      label: 'Fire Yourself Fake',
      action: 'fire yourseft fake'
    },
  ];

  const handleActionTest = (action: string) => {
    setSelectedAction(action);
    setIsOverlayVisible(true);
  };

  const handleOverlayComplete = () => {
    setIsOverlayVisible(false);
    setTimeout(() => setSelectedAction(null), 300);
  };

  const handleHidePanel = () => {
    setIsPanelVisible(false);
  };

  const handleShowPanel = () => {
    setIsPanelVisible(true);
  };

  return (
    <div className="test-page">
      {isPanelVisible ? (
        <div className="test-container">
          <h1>Action Overlay Test</h1>

          <div className="test-panel">
            <h2>Select an action to test:</h2>
            <div className="action-buttons">
              {testActions.map((action) => (
                <button
                  key={action.id}
                  className={`action-btn ${selectedAction === action.action ? 'active' : ''}`}
                  onClick={() => handleActionTest(action.action)}
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div className="info-box">
              <h3>Current Action:</h3>
              <p>{selectedAction || 'None selected'}</p>
            </div>

            <button
              className="close-btn"
              onClick={handleOverlayComplete}
              disabled={!selectedAction}
            >
              Close Overlay
            </button>

            <button
              className="hide-btn"
              onClick={handleHidePanel}
            >
              Hide Panel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="show-btn"
          onClick={handleShowPanel}
        >
          Show Panel
        </button>
      )}

      {/* Action Overlay */}
      <ActionOverlay
        actionType={selectedAction || undefined}
        actor={mockActor}
        target={mockTarget}
        isVisible={isOverlayVisible}
        onAnimationComplete={handleOverlayComplete}
      />
    </div>
  );
}

