import './GameLayout.css';
import { useState, useEffect } from 'react';

interface Player {
  ID: string;
  name: string;
  health: number;
  color?: string;
  URLavatar?: string;
  effects?: string[];
  items?: Array<{ name: string }>;
}

interface ActionResponse {
  action: string;
}

interface ActionMessage {
  id: string;
  text: string;
  timestamp: number;
}

interface GameLayoutProps {
  players: Player[];
  currentPlayerId?: string;  // Current player ID (me - who I am)
  nextPlayerId?: string;     // Next player ID (whose turn it is)
  gun?: number[];
  actionResponse?: ActionResponse | null;
  isMyTurn: boolean;
  onFire: (targetId: string) => void;
  onSelectTarget?: (targetId: string, gunAngle: number) => void;  // NEW: Callback with gunAngle
  onUseItem?: (itemType: number, targetId?: string) => void;  // NEW: Use item callback
  onBack?: () => void;  // NEW: Back button callback
  selectedTargetId?: string | null;  // NEW: Target selected by current player (from server)
  notifyMessage?: string;
}
import purpleAvatar from '../../assets/img/avatar/purple.png';
import { AVATAR_MAP, getColorFromAvatarUrl } from '../../utils/avatarMap';

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
  'Cigarette': vegerateImg,  // Cigarette = Vigor/Bình thuốc
  'Glass': glassImg,
  'Handcuffs': handcuffsImg,
  'Viewfinder': viewfinderImg,
  'Vigerate': vegerateImg,
};

// Item description map
const itemDescriptionMap: Record<string, string> = {
  'Beer': 'Rút viên đạn tiếp theo ra khỏi súng',
  'Bullet': 'Thêm 1 viên đạn ngẫu nhiên vào súng',
  'Chainsaw': 'Sát thương x2 cho lần bắn tiếp theo',
  'Cigarette': 'Hồi phục 1 điểm máu',
  'Glass': 'Xem viên đạn tiếp theo là thật hay giả',
  'Handcuffs': 'Khóa 1 đối thủ được chọn',
  'Viewfinder': 'Kéo 1 người vào solo',
  'Vigerate': 'Hồi phục 1 điểm máu',
};

// ...existing code...

// Avatar mapping is now done via utility functions
// const avatarMap - removed, use AVATAR_MAP from utility instead

// ...existing code...

function GameLayout({
  players,
  currentPlayerId,
  nextPlayerId,
  gun = [],
  actionResponse,
  isMyTurn,
  onFire,
  onSelectTarget,
  onUseItem,
  onBack,
  selectedTargetId,
  notifyMessage
}: GameLayoutProps) {
  // State for message history
  const [messageHistory, setMessageHistory] = useState<ActionMessage[]>([]);
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Update message history when notifyMessage changes
  useEffect(() => {
    if (notifyMessage && notifyMessage.trim()) {
      setMessageHistory(prev => {
        const newMessage: ActionMessage = {
          id: Date.now().toString(),
          text: notifyMessage,
          timestamp: Date.now()
        };
        // Keep only last 20 messages
        return [newMessage, ...prev].slice(0, 20);
      });
    }
  }, [notifyMessage]);

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
  console.log('👤 Current Player (me):', currentPlayer?.ID, currentPlayer?.name, 'URLavatar:', currentPlayer?.URLavatar);
  console.log('🎯 Next Turn (nextPlayer):', currentPlayerId, 'isMyTurn:', isMyTurn);
  console.log('⚔️ Opponents - Top:', player3?.ID, player3?.name, 'URLavatar:', player3?.URLavatar, '| Left:', player4?.ID, player4?.name, 'URLavatar:', player4?.URLavatar, '| Right:', player2?.ID, player2?.name, 'URLavatar:', player2?.URLavatar);

  const getAvatarImage = (avatarUrl?: string, color?: string): string => {
    // Priority 1: Parse color name from backend (can be plain color name like "blue" or URL)
    if (avatarUrl) {
      const colorName = getColorFromAvatarUrl(avatarUrl);
      console.log('Using avatar from backend:', avatarUrl, '-> color:', colorName);
      return AVATAR_MAP[colorName] || purpleAvatar;
    }

    // Priority 2: Fall back to color parameter
    if (color) {
      const colorLower = color.toLowerCase();
      return AVATAR_MAP[colorLower] || purpleAvatar;
    }

    // Priority 3: Default avatar
    return purpleAvatar;
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

  const getItemSlots = (items: Array<{ name: string }> | undefined, playerId?: string) => {
    const handleItemClick = (itemIndex: number, itemName: string) => {
      if (!isMyTurn) {
        console.log('⏸️ Not your turn yet');
        return;
      }
      console.log('🎒 Using item:', { itemIndex, itemName });
      // Map item name to type number (based on backend ItemFactory)
      const itemTypeMap: Record<string, number> = {
        'Beer': 1,
        'bullet': 2,
        'Bullet': 2,
        'chainsaw': 3,
        'Chainsaw': 3,
        'cigarette': 4,
        'Cigarette': 4,
        'glass': 5,
        'Glass': 5,
        'handcuffs': 6,
        'Handcuffs': 6,
        'viewfinder': 7,
        'Viewfinder': 7
      };
      const itemType = itemTypeMap[itemName] ?? 0;
      onUseItem?.(itemType, selectedTarget || undefined);
    };

    return Array.from({ length: 7 }).map((_, i) => {
      const itemId = playerId ? `${playerId}-item-${i}` : `item-${i}`;
      const isHovered = hoveredItemId === itemId;

      return (
        <div
          key={i}
          className={`item-slot ${items?.[i] ? 'has-item' : ''}`}
          onClick={() => items?.[i] && handleItemClick(i, items[i].name)}
          onMouseEnter={() => items?.[i] && setHoveredItemId(itemId)}
          onMouseLeave={() => setHoveredItemId(null)}
          style={{ cursor: items?.[i] ? 'pointer' : 'default', position: 'relative' }}
        >
          {items?.[i] && (
            <>
              <img
                src={getItemImage(items[i].name)}
                alt={items[i].name}
                className="item-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  bottom: '110%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  color: '#fbbf24',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  width: '180px',
                  textAlign: 'center',
                  zIndex: 10000,
                  border: '2px solid #fbbf24',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                  wordWrap: 'break-word',
                  lineHeight: '1.4',
                  boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
                }}>
                  {itemDescriptionMap[items[i].name] || items[i].name}
                </div>
              )}
            </>
          )}
        </div>
      );
    });
  };

  const handleFireClick = () => {
    if (!isMyTurn || !selectedTarget) return;
    onFire(selectedTarget);
    // Clear target after firing by calling onSelectTarget with empty string
    onSelectTarget?.('', -165);
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
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    console.log('🔫 Gun angle for target', targetId, ':', angle, 'dx:', dx, 'dy:', dy, 'target pos:', targetPos);
    return angle;
  };

  // Helper function to handle target selection with gun angle calculation
  const handleTargetSelect = (targetId: string) => {
    if (!isMyTurn) return;

    if (selectedTarget === targetId) {
      // Deselect target
      onSelectTarget?.('', -165);
    } else {
      // Select new target and calculate gun angle
      const angle = calculateGunAngle(targetId);
      console.log('🎯 Target selected:', targetId, 'with gun angle:', angle);
      onSelectTarget?.(targetId, angle);
    }
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
                handleTargetSelect(currentPlayer.ID);
              }
            }}
            style={{ cursor: isMyTurn && currentPlayer.health > 0 ? 'pointer' : 'default' }}
          >
            {/* Avatar - Column 1, Row 1-2 */}
            <div className="player-avatar-circle" />
            <img
              className="player-avatar"
              src={getAvatarImage(currentPlayer?.URLavatar, currentPlayer?.color)}
              alt={currentPlayer.name}
              onError={(e) => {
                console.error('❌ Failed to load avatar for', currentPlayer.name, '- using fallback');
                (e.target as HTMLImageElement).src = purpleAvatar;
              }}
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
              {getItemSlots(currentPlayer.items, currentPlayer.ID)}
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
                handleTargetSelect(player3.ID);
              }
            }}
            style={{ cursor: isMyTurn && player3.health > 0 ? 'pointer' : 'default' }}
          >
            <div className="player-avatar-circle" />
            <img
              className="player-avatar"
              src={getAvatarImage(player3?.URLavatar, player3?.color)}
              alt={player3.name}
              onError={(e) => {
                console.error('❌ Failed to load avatar for', player3.name, '- using fallback');
                (e.target as HTMLImageElement).src = purpleAvatar;
              }}
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
              {getItemSlots(player3.items, player3.ID)}
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
                handleTargetSelect(player4.ID);
              }
            }}
            style={{ cursor: isMyTurn && player4.health > 0 ? 'pointer' : 'default' }}
          >
            {/* Row 1: Avatar | Name + HP */}
            <div className="player-4-row1">
              {/* Column 1: Avatar */}
              <img
                className="player-avatar"
                src={getAvatarImage(player4?.URLavatar, player4?.color)}
                alt={player4.name}
                onError={(e) => {
                  console.error('❌ Failed to load avatar for', player4.name, '- using fallback');
                  (e.target as HTMLImageElement).src = purpleAvatar;
                }}
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
              {getItemSlots(player4.items, player4.ID)}
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
                handleTargetSelect(player2.ID);
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
                src={getAvatarImage(player2?.URLavatar, player2?.color)}
                alt={player2.name}
                onError={(e) => {
                  console.error('❌ Failed to load avatar for', player2.name, '- using fallback');
                  (e.target as HTMLImageElement).src = purpleAvatar;
                }}
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
              {getItemSlots(player2.items, player2.ID)}
            </div>

            {selectedTarget === player2.ID && (
              <div className="target-indicator">✓</div>
            )}
          </div>
        )}

        {/* Back Button */}
        <button className="back-button" title="Quay lại" onClick={onBack}>
          ←
        </button>

        {/* Rule Button */}
        <button
          className="rule-button"
          title="Hướng dẫn"
          onClick={() => window.open('/guide', '_blank')}
        >
          ?
        </button>

        {/* Action Message Display with History */}
        <div
          className={`action-message-container ${isMessageExpanded ? 'expanded' : 'collapsed'}`}
          onMouseEnter={() => messageHistory.length > 0 && setIsMessageExpanded(true)}
          onMouseLeave={() => setIsMessageExpanded(false)}
        >
          {/* Latest Message (always shown) */}
          {messageHistory.length > 0 && (
            <div className="latest-message">
              <div className="message-text">{messageHistory[0].text}</div>
            </div>
          )}

          {/* Message History (shown when expanded) */}
          {isMessageExpanded && messageHistory.length > 1 && (
            <div className="message-history">
              {messageHistory.slice(1).map((msg, index) => (
                <div key={msg.id} className={`history-message ${index === 0 ? 'latest' : ''}`}>
                  <div className="history-index">{messageHistory.length - index}</div>
                  <div className="history-text">{msg.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameLayout;

