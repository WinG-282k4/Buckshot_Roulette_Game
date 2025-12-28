import { useGameStore } from '../../stores/gameStore';
import { wsService } from '../../services/websocket.service';
import PlayerList from './PlayerList';
import GunDisplay from './GunDisplay';
import ActionButtons from './ActionButtons';
import ItemSlots from './ItemSlots';

export default function GameBoard() {
  const { roomStatus, isMyTurn, myPlayer } = useGameStore();
  const currentPlayer = myPlayer();

  console.log('🎮 GameBoard render - roomStatus:', roomStatus);


  // Debug mode: Hiển thị UI ngay cả khi chưa có data
  if (!roomStatus) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #7f1d1d, #000000)',
        color: 'white',
        padding: '40px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', color: '#ef4444', marginBottom: '20px' }}>
            🎯 BUCKSHOT ROULETTE
          </h1>
          <div style={{
            background: '#1f2937',
            padding: '30px',
            borderRadius: '12px',
            border: '2px solid #374151',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <p style={{ fontSize: '20px', marginBottom: '20px', color: '#fbbf24' }}>
              ⏳ Đang chờ dữ liệu từ server...
            </p>
            <div style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'left' }}>
              <p>🔍 Debug Info:</p>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                <li>• roomStatus: {roomStatus ? 'có dữ liệu' : 'NULL'}</li>
                <li>• WebSocket: Kiểm tra F12 Console</li>
                <li>• Nếu không thấy log "📨 Room update" → WebSocket chưa nhận data</li>
              </ul>
            </div>
            <p style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280' }}>
              💡 Nếu bị stuck ở đây quá lâu, reload page (F5)
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isMyTurnFlag = isMyTurn();
  const nextPlayer = roomStatus.nextPlayer;
  const messageText = roomStatus.message?.trim();

  const handleStartGame = () => {
    wsService.startGame();
  };

  const handleFire = (targetId: string) => {
    if (!isMyTurnFlag) {
      console.warn('Attempted to fire outside your turn');
      return;
    }

    wsService.fire(targetId);
  };

  const handleUseItem = (itemType: number, targetId?: string) => {
    if (!isMyTurnFlag) {
      console.warn('Attempted to use item outside your turn');
      return;
    }

    wsService.useItem(itemType, targetId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-red-500">ROOM #{roomStatus.roomid}</h1>
        <p className="text-gray-400 mt-2">
          {nextPlayer ? 'Đang chơi' : 'Đang chờ...'}
        </p>
        {roomStatus.isSoloMode && (
          <p className="text-yellow-500 font-semibold mt-2">⚔️ SOLO MODE ACTIVE</p>
        )}

        {/* Message Notification */}
        {messageText && (
          <div className="mt-3 flex justify-center">
            <div className="inline-block bg-blue-900 border-2 border-blue-500 px-6 py-2 rounded-lg max-w-2xl text-left">
              <p className="text-blue-300 font-medium">
                📢 {messageText}
              </p>
            </div>
          </div>
        )}

        {/* Turn Indicator */}
        {nextPlayer && currentPlayer && (
          <div className="mt-4 flex justify-center">
            {nextPlayer.ID === currentPlayer.ID ? (
              <div className="bg-green-900 border-2 border-green-500 px-6 py-3 rounded-lg">
                <p className="text-green-400 font-bold text-xl">
                  🎯 LƯỢT CỦA BẠN!
                </p>
              </div>
            ) : (
              <div className="bg-gray-800 border-2 border-gray-600 px-6 py-3 rounded-lg">
                <p className="text-gray-300 font-bold text-lg">
                  ⏳ Lượt của: <span className="text-yellow-400">{nextPlayer.name}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Players List */}
        <div className="lg:col-span-1">
          <PlayerList
            players={roomStatus.players}
            nextPlayer={nextPlayer}
            currentPlayerId={currentPlayer?.ID}
          />
        </div>

        {/* Center: Gun & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gun Display */}
          <GunDisplay
            gun={roomStatus.gun}
            actionResponse={roomStatus.actionResponse}
          />

          {/* Items */}
          {currentPlayer && (
            <ItemSlots
              items={currentPlayer.items}
              onUseItem={handleUseItem}
              canUse={isMyTurnFlag}
              players={roomStatus.players}
            />
          )}

          {/* Action Buttons */}
          {roomStatus.status === 'Waiting' ? (
            <button
              onClick={handleStartGame}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg transition-colors"
            >
              🎮 BẮT ĐẦU GAME
            </button>
          ) : (
            <ActionButtons
              players={roomStatus.players}
              currentPlayerId={currentPlayer?.ID}
              isMyTurn={isMyTurnFlag}
              onFire={handleFire}
            />
          )}
        </div>
      </div>

      {/* Turn Indicator */}
      {nextPlayer && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 px-6 py-3 rounded-full border-2 border-yellow-500">
          <p className="text-yellow-500 font-bold">
            🎯 Lượt: {nextPlayer.name}
            {isMyTurnFlag && ' (Bạn!)'}
          </p>
        </div>
      )}
    </div>
  );
}
