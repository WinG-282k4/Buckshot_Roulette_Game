import React, { useEffect, useState } from 'react';

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
  };
  gun?: {
    image: string;
    width: number;
    height: number;
    left: number;
    top: number;
    rotation: number;
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
  'use chainsaw': {
    notifyText: 'Use Chainsaw',
    pattern: 'two-sided',
    effect: {
      image: chainsawGunImg,
      width: 703,
      height: 689.38,
      left: -106,
      top: -108.73,
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
      width: 703,
      height: 689.38,
      left: -106,
      top: -108.73,
    },
    gun: {
      image: gunHitImg,
      width: 455,
      height: 518.99,
      left: 951,
      top: 531.32,
      rotation: 180,
    },
  },
  'use beer': {
    notifyText: 'Use Beer',
    pattern: 'self-only',
    item: {
      image: beerImg,
      width: 313,
      height: 313,
      left: 381,
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
      left: 381,
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
      left: 396,
      top: 81,
    },
  },
  'use chainsaw (self)': {
    notifyText: 'Prepare Chainsaw',
    pattern: 'self-only',
    item: {
      image: chainsawItemImg,
      width: 453.26,
      height: 453.26,
      left: 319.48,
      top: 128,
      rotation: 13,
    },
  },
  'use medicine': {
    notifyText: 'Use Medicine',
    pattern: 'self-only',
    item: {
      image: vigerateImg,
      width: 453.26,
      height: 453.26,
      left: 325.12,
      top: 104,
      rotation: 1,
    },
  },
  'fire yourself real': {
    notifyText: 'Fire Yourself Real',
    pattern: 'fire',
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
    notifyText: 'Fire Yourself Fake',
    pattern: 'fire',
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

  // Auto-hide overlay after 5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          onAnimationComplete?.();
        }, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  if (!isVisible || !actionType) {
    console.log('❌ ActionOverlay: Not rendering -', { isVisible, actionType });
    return null;
  }

  const config = actionConfig[actionType];
  if (!config) {
    console.warn(`❌ Action type "${actionType}" not configured in actionConfig`);
    return null;
  }

  console.log('✅ ActionOverlay: Rendering -', { isVisible, actionType, pattern: config.pattern });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: fadeOut ? 'none' : 'auto',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {/* Overlay Container - Based on overlay.html */}
      <div
        style={{
          width: '1920px',
          height: '1080px',
          position: 'relative',
          background: 'rgba(55.17, 55.17, 55.17, 0.65)',
          overflow: 'hidden',
        }}
      >
        {/* Background Layer */}
        <div
          style={{
            width: '2218px',
            height: '1070px',
            left: '-180px',
            top: '-49px',
            position: 'absolute',
            overflow: 'hidden',
            backgroundImage: `url(${backgroundEventImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Notify Action Text */}
          <div
            style={{
              left: '927px',
              top: '140px',
              position: 'absolute',
              color: 'white',
              fontSize: '60px',
              fontFamily: 'Inter',
              fontWeight: '400',
              animation: 'fadeIn 0.6s ease-out',
            }}
          >
            {config.notifyText}
          </div>
        </div>

        {/* Dynamic Action Structure - Based on dynamic-event.html */}
        <div
          style={{
            width: '1299px',
            height: '621px',
            left: '280px',
            top: '230px',
            position: 'absolute',
            background: 'rgba(255, 255, 255, 0)',
            overflow: 'hidden',
            animation: 'slideIn 0.4s ease-out',
          }}
        >
          {/* Pattern 1: Two-Sided */}
          {config.pattern === 'two-sided' && (
            <>
              {/* Left Avatar */}
              <img
                style={{
                  width: '281px',
                  height: '369px',
                  left: '50px',
                  top: '49px',
                  position: 'absolute',
                }}
                src={actor?.URLavatar || ''}
                alt="Actor"
              />

              {/* Actor Name */}
              <div
                style={{
                  width: '368px',
                  height: '204.01px',
                  left: '901px',
                  top: '457.34px',
                  position: 'absolute',
                  color: 'white',
                  fontSize: '150px',
                  fontFamily: 'Inter',
                  fontWeight: '400',
                  wordWrap: 'break-word',
                  animation: 'fadeIn 0.6s ease-out 0.1s backwards',
                }}
              >
                {actor?.name}
              </div>

              {/* Target Name */}
              <div
                style={{
                  width: '426px',
                  height: '204.01px',
                  left: '0px',
                  top: '416.99px',
                  position: 'absolute',
                  color: 'white',
                  fontSize: '150px',
                  fontFamily: 'Inter',
                  fontWeight: '400',
                  wordWrap: 'break-word',
                  animation: 'fadeIn 0.6s ease-out 0.2s backwards',
                }}
              >
                {target?.name}
              </div>

              {/* Effect Image */}
              {config.effect && (
                <img
                  style={{
                    width: `${config.effect.width}px`,
                    height: `${config.effect.height}px`,
                    left: `${config.effect.left}px`,
                    top: `${config.effect.top}px`,
                    position: 'absolute',
                    animation: 'fadeIn 0.6s ease-out 0.15s backwards',
                  }}
                  src={config.effect.image}
                  alt="Effect"
                />
              )}

              {/* Gun/Attack Image */}
              {config.gun && (
                <img
                  style={{
                    width: `${config.gun.width}px`,
                    height: `${config.gun.height}px`,
                    left: `${config.gun.left}px`,
                    top: `${config.gun.top}px`,
                    position: 'absolute',
                    transform: `rotate(${config.gun.rotation}deg)`,
                    transformOrigin: 'top left',
                    animation: 'fadeIn 0.6s ease-out 0.25s backwards',
                  }}
                  src={config.gun.image}
                  alt="Gun"
                />
              )}

              {/* Right Avatar */}
              <img
                style={{
                  width: '356px',
                  height: '474px',
                  left: '1287px',
                  top: '474px',
                  position: 'absolute',
                  transform: 'rotate(180deg)',
                  transformOrigin: 'top left',
                }}
                src={target?.URLavatar || ''}
                alt="Target"
              />
            </>
          )}

          {/* Pattern 2: Self-Only Items */}
          {config.pattern === 'self-only' && config.item && (
            <>
              {/* Actor Name */}
              <div
                style={{
                  width: '368px',
                  height: '204.01px',
                  left: '587px',
                  top: '455px',
                  position: 'absolute',
                  color: 'white',
                  fontSize: '150px',
                  fontFamily: 'Inter',
                  fontWeight: '400',
                  wordWrap: 'break-word',
                  animation: 'fadeIn 0.6s ease-out 0.1s backwards',
                }}
              >
                {actor?.name}
              </div>

              {/* Item Image */}
              <img
                style={{
                  width: `${config.item.width}px`,
                  height: `${config.item.height}px`,
                  left: `${config.item.left}px`,
                  top: `${config.item.top}px`,
                  position: 'absolute',
                  transform: config.item.rotation ? `rotate(${config.item.rotation}deg)` : undefined,
                  transformOrigin: 'top left',
                  animation: 'fadeIn 0.6s ease-out 0.15s backwards',
                }}
                src={config.item.image}
                alt="Item"
              />

              {/* Right Avatar */}
              <img
                style={{
                  width: '356px',
                  height: '474px',
                  left: '981px',
                  top: '504px',
                  position: 'absolute',
                  transform: 'rotate(180deg)',
                  transformOrigin: 'top left',
                }}
                src={actor?.URLavatar || ''}
                alt="Actor"
              />
            </>
          )}

          {/* Pattern 3: Fire Actions */}
          {config.pattern === 'fire' && (
            <>
              {/* Actor Name */}
              <div
                style={{
                  width: '368px',
                  height: '204.01px',
                  left: '587px',
                  top: '455px',
                  position: 'absolute',
                  color: 'white',
                  fontSize: '150px',
                  fontFamily: 'Inter',
                  fontWeight: '400',
                  wordWrap: 'break-word',
                  animation: 'fadeIn 0.6s ease-out 0.1s backwards',
                }}
              >
                {actor?.name}
              </div>

              {/* Gun Image */}
              {config.gun && (
                <img
                  style={{
                    width: `${config.gun.width}px`,
                    height: `${config.gun.height}px`,
                    left: `${config.gun.left}px`,
                    top: `${config.gun.top}px`,
                    position: 'absolute',
                    transform: `rotate(${config.gun.rotation}deg)`,
                    transformOrigin: 'top left',
                    animation: 'fadeIn 0.6s ease-out 0.15s backwards',
                  }}
                  src={config.gun.image}
                  alt="Gun"
                />
              )}

              {/* Fire/Smoke Effect */}
              {config.effect && (
                <img
                  style={{
                    width: `${config.effect.width}px`,
                    height: `${config.effect.height}px`,
                    left: `${config.effect.left}px`,
                    top: `${config.effect.top}px`,
                    position: 'absolute',
                    transform: `rotate(${config.effect.rotation}deg)`,
                    transformOrigin: 'top left',
                    animation: 'fadeIn 0.6s ease-out 0.25s backwards',
                  }}
                  src={config.effect.image}
                  alt="Fire Effect"
                />
              )}

              {/* Right Avatar */}
              <img
                style={{
                  width: '356px',
                  height: '474px',
                  left: '981px',
                  top: '504px',
                  position: 'absolute',
                  transform: 'rotate(180deg)',
                  transformOrigin: 'top left',
                }}
                src={actor?.URLavatar || ''}
                alt="Actor"
              />
            </>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ActionOverlay;

