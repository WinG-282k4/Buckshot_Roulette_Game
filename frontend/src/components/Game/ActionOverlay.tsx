import React, { useState } from 'react';
import './ActionOverlay.css';

// Import all images with correct paths
import backgroundEventImg from '../../assets/img/background/background event.png';

// Pattern 1 - Two-sided actions
import chainsawGunImg from '../../assets/img/Action/chainsaw gun.png';
import goSoloImg from '../../assets/img/Action/go solo.png';
import handcuffImg from '../../assets/img/Action/còng tay.jpeg';
import hitFakeImg from '../../assets/img/Action/hit fake.png';
import gunHitImg from '../../assets/img/Action/gun hit.png';

// Pattern 2 - Self-only item actions
import beerImg from '../../assets/img/item/Beer .png';
import bulletImg from '../../assets/img/item/bullet.png';
import glassImg from '../../assets/img/item/glass.png';
import chainsawItemImg from '../../assets/img/Action/chainsaw gun.png';
import vigerateImg from '../../assets/img/item/vigerate.png';

// Pattern 2 - Fire actions (self-cast)
import hit3Img from '../../assets/img/effect/hited/hit3.png';
import khoiImg from '../../assets/img/Action/khói.png';

// Pattern 3 - Gun & Attack effects
import gun2dImg from '../../assets/img/Gun/gun2d(no bg).png';

// Avatars
import purpleAvatarImg from '../../assets/img/avatar/purple.png';

interface Player {
  ID: string;
  name: string;
  URLavatar?: string;
  color?: string;
}

interface ActionOverlayProps {
  actionType?: string;
  actor?: Player | null;
  target?: Player | null;
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

interface ActionConfig {
  notifyText: string;
  pattern: 'two-sided' | 'self-only' | 'fire';
  background?: string;
  effect?: {
    image: string;
    width: number;
    height: number;
    left: number;
    top: number;
    rotation?: number;
    flipX?: boolean;
    flipY?: boolean;
  };
  gun?: {
    image: string;
    width: number;
    height: number;
    left: number;
    top: number;
    rotation: number;
    flipX?: boolean;
    flipY?: boolean;
  };
  item?: {
    image: string;
    width: number;
    height: number;
    left: number;
    top: number;
    rotation?: number;
  };
}

// Action configuration based on design
const actionConfig: Record<string, ActionConfig> = {
  'attack real': {
    notifyText: 'Attack Real',
    pattern: 'two-sided',
    gun: {
      image: gun2dImg,
      width: 650,
      height: 518.99,
      left: 450,
      top: 0,
      rotation: 0,
      flipX: true,
    },
    effect: {
      image: gunHitImg,
      width: 788,
      height: 741,
      left: -138,
      top: -138,
      flipX: true,
    },
  },
  'use solo': {
    notifyText: 'Use Solo',
    pattern: 'two-sided',
    effect: {
      image: goSoloImg,
      width: 896,
      height: 896,
      left: 189,
      top: -165,
    },
  },
  'use handcuff': {
    notifyText: 'Use Handcuff',
    pattern: 'two-sided',
    effect: {
      image: handcuffImg,
      width: 504,
      height: 382,
      left: 398,
      top: 49,
    },
  },
  'attack fake': {
    notifyText: 'Attack Fake',
    pattern: 'two-sided',
    effect: {
      image: hitFakeImg,
      width: 671,
      height: 647,
      left: 53,
      top: -229,
    },
    gun: {
      image: gun2dImg,
      width: 650,
      height: 518.99,
      left: 450,
      top: 0,
      rotation: 0,
      flipX: true,
    },
  },
  'use beer': {
    notifyText: 'Use Beer',
    pattern: 'self-only',
    item: {
      image: beerImg,
      width: 313,
      height: 313,
      left: 291,
      top: 154,
    },
  },
  'use bullet': {
    notifyText: 'Use Bullet',
    pattern: 'self-only',
    item: {
      image: bulletImg,
      width: 313,
      height: 313,
      left: 291,
      top: 154,
    },
  },
  'use glass': {
    notifyText: 'Use Glass',
    pattern: 'self-only',
    item: {
      image: glassImg,
      width: 313,
      height: 313,
      left: 306,
      top: 81,
    },
  },
  'use chainsaw': {
    notifyText: 'Prepare Chainsaw',
    pattern: 'self-only',
    item: {
      image: chainsawItemImg,
      width: 453.26,
      height: 453.26,
      left: 127,
      top: 128,
      rotation: 13.07,
    },
  },
  'use medicine': {
    notifyText: 'Use Medicine',
    pattern: 'self-only',
    item: {
      image: vigerateImg,
      width: 453,
      height: 453,
      left: 251,
      top: 104,
    },
  },
  'fire yourseft real': {
    notifyText: 'Fire Yourself Real',
    pattern: 'fire',
    gun: {
      image: gun2dImg,
      width: 385.44,
      height: 385.44,
      left: 200,
      top: 132,
      rotation: -44,
      flipX: false,
    },
    effect: {
      image: hit3Img,
      width: 453.53,
      height: 388.19,
      left: 453,
      top: -82,
      rotation: -141,
      flipY: true,
    },
  },
  'fire yourseft fake': {
    notifyText: 'Fire Yourself Fake',
    pattern: 'fire',
    gun: {
      image: gun2dImg,
      width: 385.44,
      height: 385.44,
      left: 200,
      top: 132,
      rotation: -44,
      flipX: false,
    },
    effect: {
      image: khoiImg,
      width: 605.9,
      height: 504.67,
      left: 397,
      top: -84,
      rotation: -179,
      flipX: false,
      flipY: true
    },
  },
};

const ActionOverlay: React.FC<ActionOverlayProps> = ({
  actionType,
  actor,
  target,
  isVisible,
  onAnimationComplete,
}) => {
  const [fadeOut, setFadeOut] = useState(false);

  // Reset fadeOut when isVisible changes
  React.useEffect(() => {
    setFadeOut(false);
  }, [isVisible]);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      onAnimationComplete?.();
    }, 300);
  };

  if (!isVisible || !actionType) {
    console.log('❌ ActionOverlay: Not rendering -', { isVisible, actionType });
    return null;
  }

  const config = actionConfig[actionType];
  if (!config) {
    console.warn(`❌ Action type "${actionType}" not configured in actionConfig`);
    return null;
  }

  // --- New helper: compute image style with proper flip handling ---
  const computeImageStyle = (
    obj?: { width: number; height: number; left: number; top: number; rotation?: number; flipX?: boolean; flipY?: boolean },
    animDelay = '0.15s'
  ): React.CSSProperties | undefined => {
    if (!obj) return undefined;
    const { width, height, left, top, rotation = 0, flipX, flipY } = obj;
    const transforms: string[] = [];

    if (rotation) transforms.push(`rotate(${rotation}deg)`);
    if (flipX) {
      // scaleX(-1) = lật ngang (flip horizontally)
      transforms.push('scaleX(-1)');
    }
    if (flipY) {
      // scaleY(-1) = lật dọc (flip vertically)
      transforms.push('scaleY(-1)');
    }

    return {
      width: `${width}px`,
      height: `${height}px`,
      left: `${left}px`,
      top: `${top}px`,
      position: 'absolute',
      transform: transforms.length ? transforms.join(' ') : undefined,
      transformOrigin: 'center center',
      animation: `fadeIn 0.6s ease-out ${animDelay} backwards`,
    };
  };
  // --- end helper ---

  console.log('✅ ActionOverlay: Rendering -', { isVisible, actionType, pattern: config.pattern });

  return (
    <div className={`overlay-wrapper ${fadeOut ? 'fade-out' : ''}`}>
      {/* Overlay Container */}
      <div className="overlay-container">
        {/* Background Layer */}
        <div
          className="background-layer"
          style={{
            backgroundImage: `url(${backgroundEventImg})`,
          }}
        >
          {/* Notify Action Text */}
          <div className="notify-action-text">
            {config.notifyText}
          </div>
        </div>

        {/* Dynamic Action Structure */}
        <div className="dynamic-action-structure">
          {/* Pattern 1: Two-Sided */}
          {config.pattern === 'two-sided' && (
            <>
              {/* Left Avatar */}
              <img
                className="avatar-left"
                src={actor?.URLavatar || ''}
                alt="Actor"
              />

              {/* Actor Name */}
              <div className="actor-name">
                {actor?.name}
              </div>

              {/* Target Name */}
              <div className="target-name">
                {target?.name}
              </div>

              {/* Effect Image */}
              {config.effect && (
                <img
                  className="effect-image"
                  style={computeImageStyle(config.effect, '0.15s')}
                  src={config.effect.image}
                  alt="Effect"
                />
              )}

              {/* Gun/Attack Image */}
              {config.gun && (
                <img
                  className="gun-image"
                  style={computeImageStyle(config.gun, '0.25s')}
                  src={config.gun.image}
                  alt="Gun"
                />
              )}

              {/* Right Avatar */}
              <img
                className="avatar-right"
                src={purpleAvatarImg}
                alt="Target"
              />
            </>
          )}

          {/* Pattern 2: Self-Only Items */}
          {config.pattern === 'self-only' && config.item && (
            <>
              {/* Item Image - Render first (appears behind) */}
              <img
                className="item-image"
                style={computeImageStyle(config.item, '0.15s')}
                src={config.item.image}
                alt="Item"
              />

              {/* Actor Name */}
              <div className="actor-name pattern-2">
                {actor?.name}
              </div>

              {/* Right Avatar - Render last (appears in front) */}
              <img
                className="avatar-right pattern-2"
                src={actor?.URLavatar || ''}
                alt="Actor"
              />
            </>
          )}

          {/* Pattern 3: Fire Actions */}
          {config.pattern === 'fire' && (
            <>
              {/* Actor Name */}
              <div className="actor-name pattern-3">
                {actor?.name}
              </div>

              {/* Gun Image */}
              {config.gun && (
                <img
                  className="gun-image pattern-3"
                  style={computeImageStyle(config.gun, '0.15s')}
                  src={config.gun.image}
                  alt="Gun"
                />
              )}

              {/* Right Avatar */}
              <img
                className="avatar-right pattern-3"
                src={actor?.URLavatar || ''}
                alt="Actor"
              />

              {/* Effect Image - Render after avatar to appear in front */}
              {config.effect && (
                <img
                  className="effect-image"
                  style={computeImageStyle(config.effect, '0.15s')}
                  src={config.effect.image}
                  alt="Effect"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Close Button */}
      <button
        className="overlay-close-button"
        onClick={handleClose}
      >
        Close
      </button>
    </div>
  );
};

export default ActionOverlay;

