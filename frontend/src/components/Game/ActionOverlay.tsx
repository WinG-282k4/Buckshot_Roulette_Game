import React, { useState } from 'react';
import './ActionOverlay.css';

// Import all images with correct paths
import backgroundEventImg from '../../assets/img/background/background event.png';

// Pattern 1 - Two-sided actions
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
import { AVATAR_MAP, getColorFromAvatarUrl } from '../../utils/avatarMap';

// Audio files
import fireEventAudio from '../../assets/audio/fire event.mp3';
import hitRealAudio from '../../assets/audio/hit real.mp3';
import hitFakeAudio from '../../assets/audio/hit fake.mp3';
import useItemAudio from '../../assets/audio/use-item.mp3';
import useGlassAudio from '../../assets/audio/use glass.mp3';

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
  message?: string;
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
  message,
  isVisible,
  onAnimationComplete,
}) => {
  const [fadeOut, setFadeOut] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Helper function to get avatar image - handles both color names and URLs
  const getAvatarImage = (avatarUrl?: string): string => {
    if (!avatarUrl) return purpleAvatarImg;

    // Parse color name from URL or plain color name
    const colorName = getColorFromAvatarUrl(avatarUrl);
    const avatarImage = AVATAR_MAP[colorName.toLowerCase()];

    return avatarImage || purpleAvatarImg;
  };

  // Helper function to check if action is a use item action (kept for potential future use)

  // Reset fadeOut when isVisible changes
  React.useEffect(() => {
    setFadeOut(false);
  }, [isVisible]);


  // Cleanup audio on unmount or when isVisible changes
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Play use glass audio IMMEDIATELY - highest priority
  React.useEffect(() => {
    if (!isVisible || actionType !== 'use glass') return;

    // Create and play audio immediately without delay
    const audio = new Audio(useGlassAudio);
    audio.volume = 1;
    audio.currentTime = 0;
    audioRef.current = audio;

    // Play audio and handle autoplay policy
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => console.error('Error playing use glass audio:', err));
    }

    // Stop after 3 seconds
    const stopTimer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }, 3000);

    return () => {
      clearTimeout(stopTimer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isVisible, actionType]);

  // Play other use item audio (beer, bullet, chainsaw, medicine)
  React.useEffect(() => {
    if (!isVisible || !actionType) return;
    if (!actionType.startsWith('use') || actionType === 'use glass') return;

    // Play use item audio immediately
    const audio = new Audio(useItemAudio);
    audio.volume = 1;
    audio.currentTime = 0;
    audioRef.current = audio;

    // Play audio and handle autoplay policy
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => console.error('Error playing use item audio:', err));
    }

    // Stop after 3 seconds
    const stopTimer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }, 3000);

    return () => {
      clearTimeout(stopTimer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isVisible, actionType]);

  // Play fire/attack audio with delays
  React.useEffect(() => {
    if (!isVisible || !actionType) return;
    if (actionType.startsWith('use')) return; // Skip use item actions

    // Check if this is a fire action or attack action
    const isFireAction = actionType.startsWith('fire yourseft');
    const isAttackAction = actionType.startsWith('attack');

    const audioRefs: HTMLAudioElement[] = [];

    const playAudio = (audioSrc: string, delay: number = 0, duration: number | null = null) => {
      const timer = setTimeout(() => {
        const audio = new Audio(audioSrc);
        audio.volume = 1;
        audio.currentTime = 0;
        audioRefs.push(audio);

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => console.error('Error playing audio:', err));
        }

        // Stop after duration if specified
        if (duration !== null) {
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
          }, duration);
        }
      }, delay);

      return timer;
    };

    if (isFireAction || isAttackAction) {
      // Play fire event audio immediately
      const fireTimer = playAudio(fireEventAudio, 0, 3000);

      // Play hit audio after 1 second
      const hitTimer = setTimeout(() => {
        const isReal = actionType.includes('real');
        const hitAudio = isReal ? hitRealAudio : hitFakeAudio;
        playAudio(hitAudio, 0, 1000);
      }, 1000);

      return () => {
        clearTimeout(fireTimer);
        clearTimeout(hitTimer);
        // Cleanup all audio elements
        audioRefs.forEach(audio => {
          audio.pause();
          audio.currentTime = 0;
        });
      };
    }
  }, [isVisible, actionType]);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      onAnimationComplete?.();
    }, 300);
  };

  if (!isVisible || !actionType) {
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
          {/* Notify Action Text - Show for all actions */}
          <div className="notify-action-text">
            {message || config.notifyText}
          </div>
        </div>

        {/* Dynamic Action Structure */}
        <div className="dynamic-action-structure">
          {/* Pattern 1: Two-Sided */}
          {config.pattern === 'two-sided' && (
            <>
              {/* Left Avatar - TARGET */}
              <img
                className="avatar-left"
                src={getAvatarImage(target?.URLavatar)}
                alt="Target"
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

              {/* Right Avatar - ACTOR */}
              <img
                className="avatar-right"
                src={getAvatarImage(actor?.URLavatar)}
                alt="Actor"
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
                src={getAvatarImage(actor?.URLavatar)}
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
                src={getAvatarImage(actor?.URLavatar)}
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

