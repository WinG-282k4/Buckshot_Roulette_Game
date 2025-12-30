import './GameLayout.css';

interface Player {
  ID: string;
  name: string;
  health: number;
  color?: string;
  effects?: string[];
  items?: Array<{ name: string }>;
}

interface ActionResponse {
  action: string;
}

interface GameLayoutProps {
  players: Player[];
  currentPlayerId?: string;  // Current player ID (me - who I am)
  nextPlayerId?: string;     // Next player ID (whose turn it is)
  gun?: number[];
  actionResponse?: ActionResponse | null;
  isMyTurn: boolean;
  onFire: (targetId: string) => void;
  onSelectTarget?: (targetId: string) => void;  // NEW: Callback when selecting target
  selectedTargetId?: string | null;  // NEW: Target selected by current player (from server)
  notifyMessage?: string;
}

// Avatar images
import blackAvatar from '../../assets/img/avatar/black.png';
import blueAvatar from '../../assets/img/avatar/blue.png';
import browAvatar from '../../assets/img/avatar/brow.png';
import grayAvatar from '../../assets/img/avatar/gray.png';
import greenAvatar from '../../assets/img/avatar/green.png';
import purpleAvatar from '../../assets/img/avatar/purple.png';
import redAvatar from '../../assets/img/avatar/red.png';
import timAvatar from '../../assets/img/avatar/tim.png';
import yellowAvatar from '../../assets/img/avatar/yellow.png';

// Action images
import hitImg from '../../assets/img/Action/Hit.png';
import useImg from '../../assets/img/Action/use.png';
import gunImg from '../../assets/img/Gun/gun2d(no bg).png';

// Effect images
import soloingImg from '../../assets/img/effect/soloing.jpg';
import handcuffedImg from '../../assets/img/effect/handcuffed.jpg';

// Background
import backgroundImg from '../../assets/img/background/background main v2.png';

// Item images
import beerImg from '../../assets/img/item/Beer .png';
import bulletImg from '../../assets/img/item/bullet.png';
import chainsawImg from '../../assets/img/item/chainsaw.png';
import glassImg from '../../assets/img/item/glass.png';
import handcuffsImg from '../../assets/img/item/còng tay.jpg';
import viewfinderImg from '../../assets/img/item/solo.jpg';
import vegerateImg from '../../assets/img/item/vigerate.png';

// Item images map
const itemImageMap: Record<string, string> = {
  'Beer': beerImg,
  'Bullet': bulletImg,
  'Chainsaw': chainsawImg,
  'Cigarette': glassImg, // Use glass as placeholder
  'Glass': glassImg,
  'Handcuffs': handcuffsImg,
  'Viewfinder': viewfinderImg,
  'Vigerate': vegerateImg,
};

const avatarMap: Record<string, string> = {
  'black': blackAvatar,
  'blue': blueAvatar,
  'brown': browAvatar,
  'brow': browAvatar,
  'gray': grayAvatar,
  'green': greenAvatar,
  'purple': purpleAvatar,
  'red': redAvatar,
  'tim': timAvatar,
  'yellow': yellowAvatar
};

function GameLayout({
  players,
  currentPlayerId,
  nextPlayerId,
  gun = [],
  actionResponse,
  isMyTurn,
  onFire,
  onSelectTarget,
  selectedTargetId,
  notifyMessage
}: GameLayoutProps) {
  // Use selectedTargetId from props instead of local state
  const selectedTarget = selectedTargetId || null;

  // Find "me" - người đang chơi game này
  // Use currentPlayerId (từ gameStore's currentPlayer.ID) - đây là player ID của bạn
  const me = players.find(p => p.ID === currentPlayerId);

  // If currentPlayerId is not found, fall back to first player (shouldn't happen in normal flow)
  const fallbackPlayer = me || players[0];

  // Find danh sách đối thủ (loại bỏ mình)
  const opponents = players.filter(p => p.ID !== fallbackPlayer?.ID);

  // Assign positions cố định
  const player3 = opponents[0]; // Top
  const player4 = opponents[1]; // Left
  const player2 = opponents[2]; // Right
  const currentPlayer = fallbackPlayer; // Người chơi hiện tại ở dưới

  // Debug log
  console.log('👤 Current Player (me):', currentPlayer?.ID, currentPlayer?.name);
  console.log('🎯 Next Turn (nextPlayer):', currentPlayerId, 'isMyTurn:', isMyTurn);
  console.log('⚔️ Opponents - Top:', player3?.ID, '| Left:', player4?.ID, '| Right:', player2?.ID);

  const getAvatarImage = (color?: string): string => {
    if (!color) return purpleAvatar;
    const colorLower = color.toLowerCase();
    return avatarMap[colorLower] || purpleAvatar;
  };

  const getItemImage = (itemName?: string): string => {
    if (!itemName) return '';
    return itemImageMap[itemName] || '';
  };

  const getHealthBar = (health: number) => {
    return Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className={`health-slot ${i < health ? 'alive' : 'dead'}`}
      />
    ));
  };

  const getItemSlots = (items: Array<{ name: string }> | undefined) => {
    return Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="item-slot">
        {items?.[i] && (
          <img
            src={getItemImage(items[i].name)}
            alt={items[i].name}
            className="item-image"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>
    ));
  };

  const handleFireClick = () => {
    if (!isMyTurn || !selectedTarget) return;
    onFire(selectedTarget);
    // Clear target after firing by calling onSelectTarget with empty string
    onSelectTarget?.('');
  };

  // Vị trí các player trong main-ui (1920x1080)
  const playerPositions: Record<string, { x: number; y: number }> = {};
  playerPositions[currentPlayer?.ID || ''] = { x: 1029, y: 960 }; // player-me bottom center: left:560px + width:938px/2 = 1029, top:850px + height:220px/2 = 960
  if (player3) playerPositions[player3.ID] = { x: 1031, y: 117 }; // player-3 top center: left:562px + width:938px/2 = 1031, top:7px + height:220px/2 = 117
  if (player4) playerPositions[player4.ID] = { x: 160, y: 350 }; // player-4 left: left:10px + width:300px/2 = 160, top:250px + ~100px = 350
  if (player2) playerPositions[player2.ID] = { x: 1760, y: 350 }; // player-2 right: right:10px means left:1610px, 1610+150 = 1760, top:250px + ~100px = 350

  // Vị trí súng (center của main-ui)
  // gun-display: left: 50% = 960px, top: calc(50% - 30px) = 540 - 30 = 510px
  const gunX = 960;
  const gunY = 510;

  // Tính angle từ súng tới target
  const calculateGunAngle = (targetId: string | null): number => {
    if (!targetId) {
      return -165; // Default angle khi không có target
    }

    const targetPos = playerPositions[targetId];
    if (!targetPos) {
      console.warn('🎯 Target position not found for:', targetId, 'Available positions:', Object.keys(playerPositions));
      return -165; // Default nếu không tìm được position
    }

    const dx = targetPos.x - gunX;
    const dy = targetPos.y - gunY;

    // Tính angle từ hướng trên (0°), phù hợp với scaleY(-1)
    // 0° = up, 90° = right, -90° = left, 180° = down
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    console.log('🔫 Gun angle for target', targetId, ':', angle, 'dx:', dx, 'dy:', dy, 'target pos:', targetPos);
    return angle;
  };

  const getGunStyle = (): React.CSSProperties => {
    const angle = calculateGunAngle(selectedTarget);
    return {
      transform: `translate(-50%, -50%) rotate(${angle}deg) scaleY(-1)`,
    };
  };

  // Tính ammo từ [fakeCount, realCount]
  const fakeCount = Array.isArray(gun) && gun.length >= 1 ? gun[0] : 0;
  const realCount = Array.isArray(gun) && gun.length >= 2 ? gun[1] : 0;

  return (
    <div className="game-container">
      <div className="main-ui">
        {/* Background */}
        <img className="background-main" src={backgroundImg} alt="background" />

        {/* Ammo Display */}
        <div className="ammo-display">
          <div className="ammo-number current">{fakeCount}</div>
          <div className="ammo-divider">/</div>
          <div className="ammo-number total">{realCount}</div>
        </div>

        {/* Hit Effect Animation */}
        {actionResponse?.action === 'fire' && (
          <img className="hit-effect" src={hitImg} alt="hit" />
        )}

        {/* Gun Display */}
        <img className="gun-display" src={gunImg} alt="gun" style={getGunStyle()} />

        {/* Player Me - Bottom Center */}
        {currentPlayer && (
          <div
            className={`player-me ${isMyTurn ? 'is-my-turn' : ''} ${selectedTarget === currentPlayer.ID ? 'selected' : ''}`}
            onClick={() => {
              if (isMyTurn && currentPlayer.health > 0) {
                const newTarget = selectedTarget === currentPlayer.ID ? '' : currentPlayer.ID;
                console.log('👤 Click player-me, newTarget:', newTarget, 'previousTarget:', selectedTarget);
                onSelectTarget?.(newTarget);
              }
            }}
            style={{ cursor: isMyTurn && currentPlayer.health > 0 ? 'pointer' : 'default' }}
          >
            {/* Avatar - Column 1, Row 1-2 */}
            <div className="player-avatar-circle" />
            <img
              className="player-avatar"
              src={getAvatarImage(currentPlayer.color)}
              alt={currentPlayer.name}
            />

            {/* HP Bar - Column 2, Row 1 */}
            <div className="player-hp-bar">
              <div className="player-name-hp">
                <span className="player-name-text">{currentPlayer.name}</span>
              </div>
              <div className="health-bar">
                {getHealthBar(currentPlayer.health)}
              </div>
            </div>

            {/* Items - Column 2, Row 2 */}
            <div className="player-items">
              {getItemSlots(currentPlayer.items)}
            </div>

            {/* Effect - Column 3, Row 1-2 */}
            <div className="player-effect">
              {currentPlayer.effects?.includes('soloing') && (
                <img src={soloingImg} alt="soloing" className="effect-icon" />
              )}
              {currentPlayer.effects?.includes('handcuffed') && (
                <img src={handcuffedImg} alt="handcuffed" className="effect-icon" />
              )}
            </div>

            {/* Use Icon - Column 4, Row 2 - Always show */}
            <img className="use-icon" src={useImg} alt="use" />

            {/* Fire Button - Column 5, Row 1-2 - Only show when my turn */}
            {isMyTurn && (
              <button
                className={`fire-button ${selectedTarget ? 'active' : ''}`}
                onClick={handleFireClick}
                disabled={!selectedTarget}
                title="Bắn"
              >
                <img src={hitImg} alt="Fire" className="fire-button-img" />
              </button>
            )}
          </div>
        )}

        {/* Player 3 - Top Center */}
        {player3 && (
          <div
            className={`player-3 ${selectedTarget === player3.ID ? 'selected' : ''} ${nextPlayerId === player3.ID ? 'is-my-turn' : ''}`}
            onClick={() => {
              if (isMyTurn && player3.health > 0) {
                const newTarget = selectedTarget === player3.ID ? '' : player3.ID;
                console.log('🎯 Click player-3 (' + player3.name + '), newTarget:', newTarget, 'previousTarget:', selectedTarget);
                onSelectTarget?.(newTarget);
              }
            }}
            style={{ cursor: isMyTurn && player3.health > 0 ? 'pointer' : 'default' }}
          >
            <div className="player-avatar-circle" />
            <img
              className="player-avatar"
              src={getAvatarImage(player3.color)}
              alt={player3.name}
            />

            <div className="player-hp-bar">
              <div className="player-name-hp">
                <span className="player-name-text">{player3.name}</span>
              </div>
              <div className="health-bar">
                {getHealthBar(player3.health)}
              </div>
            </div>

            <div className="player-effect">
              {player3.effects?.includes('soloing') && (
                <img src={soloingImg} alt="soloing" className="effect-icon" />
              )}
              {player3.effects?.includes('handcuffed') && (
                <img src={handcuffedImg} alt="handcuffed" className="effect-icon" />
              )}
            </div>

            <div className="player-items">
              {getItemSlots(player3.items)}
            </div>

            {selectedTarget === player3.ID && (
              <div className="target-indicator">✓</div>
            )}
          </div>
        )}

        {/* Player 4 - Left */}
        {player4 && (
          <div
            className={`player-4 ${selectedTarget === player4.ID ? 'selected' : ''} ${nextPlayerId === player4.ID ? 'is-my-turn' : ''}`}
            onClick={() => {
              if (isMyTurn && player4.health > 0) {
                const newTarget = selectedTarget === player4.ID ? '' : player4.ID;
                console.log('🎯 Click player-4 (' + player4.name + '), newTarget:', newTarget, 'previousTarget:', selectedTarget);
                onSelectTarget?.(newTarget);
              }
            }}
            style={{ cursor: isMyTurn && player4.health > 0 ? 'pointer' : 'default' }}
          >
            {/* Row 1: Avatar | Name + HP */}
            <div className="player-4-row1">
              {/* Column 1: Avatar */}
              <img
                className="player-avatar"
                src={getAvatarImage(player4.color)}
                alt={player4.name}
              />

              {/* Column 2: Name + HP */}
              <div className="player-4-name-hp-col">
                <div className="player-name-hp">
                  <span className="player-name-text">{player4.name}</span>
                </div>
                <div className="player-hp-bar-vertical">
                  <div className="health-bar-vertical">
                    {getHealthBar(player4.health)}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Effects */}
            <div className="player-effect">
              {player4.effects?.includes('soloing') && (
                <img src={soloingImg} alt="soloing" className="effect-icon" />
              )}
              {player4.effects?.includes('handcuffed') && (
                <img src={handcuffedImg} alt="handcuffed" className="effect-icon" />
              )}
            </div>

            {/* Row 3: Items 4x2 */}
            <div className="player-items">
              {getItemSlots(player4.items)}
            </div>

            {selectedTarget === player4.ID && (
              <div className="target-indicator">✓</div>
            )}
          </div>
        )}

        {/* Player 2 - Right */}
        {player2 && (
          <div
            className={`player-2 ${selectedTarget === player2.ID ? 'selected' : ''} ${nextPlayerId === player2.ID ? 'is-my-turn' : ''}`}
            onClick={() => {
              if (isMyTurn && player2.health > 0) {
                const newTarget = selectedTarget === player2.ID ? '' : player2.ID;
                console.log('🎯 Click player-2 (' + player2.name + '), newTarget:', newTarget, 'previousTarget:', selectedTarget);
                onSelectTarget?.(newTarget);
              }
            }}
            style={{ cursor: isMyTurn && player2.health > 0 ? 'pointer' : 'default' }}
          >
            {/* Row 1: Name + HP | Avatar */}
            <div className="player-2-row1">
              {/* Column 1: Name + HP */}
              <div className="player-2-name-hp-col">
                <div className="player-name-hp">
                  <span className="player-name-text">{player2.name}</span>
                </div>
                <div className="player-hp-bar-vertical">
                  <div className="health-bar-vertical">
                    {getHealthBar(player2.health)}
                  </div>
                </div>
              </div>

              {/* Column 2: Avatar */}
              <img
                className="player-avatar"
                src={getAvatarImage(player2.color)}
                alt={player2.name}
              />
            </div>

            {/* Row 2: Effects */}
            <div className="player-effect">
              {player2.effects?.includes('soloing') && (
                <img src={soloingImg} alt="soloing" className="effect-icon" />
              )}
              {player2.effects?.includes('handcuffed') && (
                <img src={handcuffedImg} alt="handcuffed" className="effect-icon" />
              )}
            </div>

            {/* Row 3: Items 4x2 */}
            <div className="player-items">
              {getItemSlots(player2.items)}
            </div>

            {selectedTarget === player2.ID && (
              <div className="target-indicator">✓</div>
            )}
          </div>
        )}

        {/* Back Button */}
        <button className="back-button" title="Quay lại">
          ←
        </button>

        {/* Rule Button */}
        <button className="rule-button" title="Luật chơi">
          ?
        </button>
        {notifyMessage && (
          <div className="notify">
            {notifyMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default GameLayout;

