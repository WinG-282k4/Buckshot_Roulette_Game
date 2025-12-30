import { useState } from 'react';
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
  currentPlayerId?: string;
  gun?: number[];
  actionResponse?: ActionResponse | null;
  isMyTurn: boolean;
  onFire: (targetId: string) => void;
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
  gun = [],
  actionResponse,
  isMyTurn,
  onFire,
  notifyMessage
}: GameLayoutProps) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  // Lấy thông tin từ props
  // currentPlayerId = nextPlayer.ID (từ WebSocket) - người có lượt hiện tại
  // isMyTurn = có phải lượt của tôi không
  // Suy ra: myPlayerId = player có isMyTurn = true hoặc là currentPlayer của localStorage

  // Find "me" - người đang chơi game này
  const me = players.find(p => p.ID === players[0]?.ID); // Hoặc lấy từ localStorage/context

  // Find danh sách đối thủ (loại bỏ mình)
  const opponents = players.filter(p => p.ID !== me?.ID);

  // Assign positions cố định
  const player3 = opponents[0]; // Top
  const player4 = opponents[1]; // Left
  const player2 = opponents[2]; // Right
  const currentPlayer = me; // Me luôn ở dưới

  // Debug log
  console.log('me:', me?.ID, 'nextPlayer (có lượt):', currentPlayerId, 'isMyTurn:', isMyTurn);
  console.log('player3:', player3?.ID, 'player4:', player4?.ID, 'player2:', player2?.ID);

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
    setSelectedTarget(null);
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
        <img className="gun-display" src={gunImg} alt="gun" />

        {/* Player Me - Bottom Center */}
        {currentPlayer && (
          <div
            className={`player-me ${currentPlayerId === currentPlayer.ID ? 'is-my-turn' : ''} ${selectedTarget === currentPlayer.ID ? 'selected' : ''}`}
            onClick={() => {
              if (isMyTurn && currentPlayer.health > 0) {
                setSelectedTarget(selectedTarget === currentPlayer.ID ? null : currentPlayer.ID);
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
            className={`player-3 ${selectedTarget === player3.ID ? 'selected' : ''} ${currentPlayerId === player3.ID ? 'is-my-turn' : ''}`}
            onClick={() => {
              if (isMyTurn && player3.health > 0) {
                setSelectedTarget(selectedTarget === player3.ID ? null : player3.ID);
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
            className={`player-4 ${selectedTarget === player4.ID ? 'selected' : ''} ${currentPlayerId === player4.ID ? 'is-my-turn' : ''}`}
            onClick={() => {
              if (isMyTurn && player4.health > 0) {
                setSelectedTarget(selectedTarget === player4.ID ? null : player4.ID);
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
            className={`player-2 ${selectedTarget === player2.ID ? 'selected' : ''} ${currentPlayerId === player2.ID ? 'is-my-turn' : ''}`}
            onClick={() => {
              if (isMyTurn && player2.health > 0) {
                setSelectedTarget(selectedTarget === player2.ID ? null : player2.ID);
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

