import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { wsService } from '../../services/websocket.service';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GameLayout from './GameLayout';
import ActionOverlay from './ActionOverlay';
import { ActionOverlayTestPanel } from './ActionOverlayTestPanel';
import { getColorFromAvatarUrl, AVATAR_MAP } from '../../utils/avatarMap';
import purpleAvatarImg from '../../assets/img/avatar/purple.png';

export default function GameBoard() {
  const { roomStatus, isMyTurn, myPlayer, clearRoom } = useGameStore();
  const currentPlayer = myPlayer();
  const navigate = useNavigate();
  const [localSelectedTarget, setLocalSelectedTarget] = useState<string | null>(null);
  const [showActionOverlay, setShowActionOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState<{
    actionType: string;
    actor: any;
    target: any;
    message?: string;
  } | null>(null);
  const [lastProcessedActionId, setLastProcessedActionId] = useState<string | null>(null);

  // Function to convert avatar color name to image path using utility functions
  const getAvatarUrl = (avatar: string): string => {
    if (!avatar) return purpleAvatarImg;

    // Parse color name from URL or plain color name
    const colorName = getColorFromAvatarUrl(avatar);
    const colorLower = colorName.toLowerCase();

    // Return imported image path from AVATAR_MAP
    if (AVATAR_MAP[colorLower]) {
      return AVATAR_MAP[colorLower];
    }

    // Fallback: construct URL from color name
    return `/assets/img/avatar/${colorLower}.png`;
  };

  console.log('🎮 GameBoard render - roomStatus:', roomStatus);
  console.log('📊 Room status value:', roomStatus?.status);
  console.log('🔍 ActionResponse:', roomStatus?.actionResponse);
  console.log('📌 Overlay state:', { showActionOverlay, overlayData });

  // Watch for action responses
  useEffect(() => {
    if (roomStatus?.actionResponse?.action) {
      const { action, actorId, targetid } = roomStatus.actionResponse;

      // Create stable ID for this action to prevent duplicate processing
      // Using only action, actorId, targetid (no timestamp) so it's consistent across renders
      const actionId = `${action}-${actorId}-${targetid}`;

      // Skip if we already processed this exact action
      if (lastProcessedActionId === actionId) {
        console.log('⏭️ Action already processed, skipping:', actionId);
        return;
      }

      console.log('🎯 Processing action:', actionId);

      // Get actor and target from roomStatus.players
      let actor = roomStatus.players?.find(p => p.ID === actorId);
      let targetPlayer = roomStatus.players?.find(p => p.ID === targetid);

      // Convert avatar BEFORE rendering - set URLavatar properly
      if (actor) {
        actor.URLavatar = getAvatarUrl(actor.URLavatar);
      }
      if (targetPlayer) {
        targetPlayer.URLavatar = getAvatarUrl(targetPlayer.URLavatar);
      }

      // Map backend action to ActionOverlay action type
      let mappedAction = action;

      if (action === 'FIRE_REAL') {
        mappedAction = actorId === targetid ? 'fire yourseft real' : 'attack real';
      } else if (action === 'FIRE_FAKE') {
        mappedAction = actorId === targetid ? 'fire yourseft fake' : 'attack fake';
      } else if (action.startsWith('USE_ITEM_')) {
        const itemType = action.replace('USE_ITEM_', '');
        const itemNameMap: Record<string, string> = {
          '1': 'use beer',
          '2': 'use bullet',
          '3': 'use chainsaw',
          '4': 'use medicine',
          '5': 'use glass',
          '6': 'use handcuff',
          '7': 'use solo',
        };
        mappedAction = itemNameMap[itemType] || action;
      } else {
        // Skip TARGET or any other non-action types
        console.log('⏭️ Skipping non-action type:', action);
        setLastProcessedActionId(actionId);
        return;
      }

      console.log('🎬 Showing ActionOverlay for action:', mappedAction);

      // Mark this action as processed BEFORE setting state
      setLastProcessedActionId(actionId);

      // Set overlay data with converted avatars - actor/target sẽ render với avatar đúng ngay lần đầu
      setOverlayData({
        actionType: mappedAction,
        actor,
        target: targetPlayer || null,
        message: roomStatus?.message,  // Include message from roomStatus
      });
      setShowActionOverlay(true);
    } else {
      setShowActionOverlay(false);
      setOverlayData(null);
    }
  }, [roomStatus?.actionResponse, roomStatus?.players, lastProcessedActionId]);

  // Separate effect for auto-hiding overlay after 3 seconds
  // This prevents cleanup from canceling the timeout on re-renders
  useEffect(() => {
    if (!showActionOverlay) return;

    console.log('⏱️ Starting 3-second hide timer for overlay');

    const hideTimer = setTimeout(() => {
      console.log('⏱️ 3 seconds passed - hiding overlay');
      setShowActionOverlay(false);
      setOverlayData(null);
    }, 3000);

    return () => {
      console.log('⏱️ Cleanup: clearing hide timer');
      clearTimeout(hideTimer);
    };
  }, [showActionOverlay]);

  // Game Ended - Hiển thị thông báo kết thúc
  if (roomStatus && roomStatus.status === 'Ended') {
    // Tìm người chiến thắng từ players (người có health > 0)
    const winner = roomStatus.players.find(p => p.health > 0);
    const currentPlayerObj = currentPlayer;
    const isCurrentPlayerWinner = currentPlayerObj && winner && currentPlayerObj.ID === winner.ID;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          {/* Game Over Banner */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">
              {isCurrentPlayerWinner ? '🏆' : '💀'}
            </div>

            {isCurrentPlayerWinner ? (
              <>
                <h1 className="text-5xl font-bold text-yellow-400 mb-4">
                  🎉 BẠN THẮNG! 🎉
                </h1>
                <p className="text-2xl text-white mb-2">
                  Chúc mừng bạn chiến thắng!
                </p>
              </>
            ) : (
              <>
                <h1 className="text-5xl font-bold text-red-500 mb-4">
                  GAME OVER
                </h1>
                <p className="text-2xl text-white mb-2">
                  {winner ? `Người chiến thắng: ${winner.name}` : 'Không có người chiến thắng'}
                </p>
              </>
            )}
          </div>

          {/* Winner Info Card */}
          {winner && (
            <div className="bg-gray-800 border-4 border-yellow-500 rounded-lg p-8 mb-8">
              <div className="text-center">
                <div className="text-6xl mb-4">👑</div>
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                  {winner.name}
                </h2>
                <div className="text-xl text-white mb-4">
                  💚 Sức khỏe còn lại: {winner.health} / 6
                </div>
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded flex items-center justify-center text-lg ${
                        i < winner.health ? 'bg-red-500' : 'bg-gray-700'
                      }`}
                    >
                      {i < winner.health && '❤️'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Game Stats */}
          <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">📊 Thống kê cuối game</h3>
            <div className="space-y-4">
              {roomStatus.players.map((player) => (
                <div
                  key={player.ID}
                  className={`flex justify-between items-center p-4 rounded-lg ${
                    player.ID === winner?.ID
                      ? 'bg-yellow-900/30 border-2 border-yellow-500'
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                >
                  <div>
                    <p className="text-white font-semibold">
                      {player.name}
                      {player.ID === winner?.ID && ' 👑'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      player.health > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      HP: {player.health} / 6
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => wsService.startGame()}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg transition-colors"
            >
              🔄 CHƠI LẠI
            </button>
            <button
              onClick={() => navigate('/lobby')}
              className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold rounded-lg transition-colors"
            >
              ← QUAY LẠI LOBBY
            </button>
          </div>
        </div>
      </div>
    );
  }
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
  const messageText = roomStatus.message?.trim();

  // Debug: Log the status and what we're going to render
  console.log('🎯 Status check:', {
    status: roomStatus?.status,
    isPlaying: roomStatus?.status === 'Playing',
    hasPlayers: !!roomStatus?.players,
    fallbackCheck: roomStatus ? true : false,
  });

  const handleSelectTarget = (targetId: string, gunAngle: number) => {
    // Update local state immediately for UI responsiveness
    console.log('📤 handleSelectTarget called with:', { targetId, gunAngle });
    if (targetId) {
      setLocalSelectedTarget(targetId);
      console.log('📤 Sending selectTarget to server:', { targetId, gunAngle });
      wsService.selectTarget(targetId, gunAngle);
    } else {
      console.log('📤 Clearing selected target');
      setLocalSelectedTarget(null);
      wsService.selectTarget('', gunAngle);
    }
  };

  const getSelectedTargetId = (): string | null => {
    // Priority: Server response > Local state
    if (roomStatus?.actionResponse?.action === 'TARGET' && roomStatus.actionResponse.targetid) {
      console.log('📥 Using server TARGET response:', roomStatus.actionResponse.targetid);
      return roomStatus.actionResponse.targetid;
    }
    console.log('📥 Using local selected target:', localSelectedTarget);
    return localSelectedTarget;
  };

  const handleUseItem = (itemType: number, targetId?: string) => {
    if (!isMyTurnFlag) {
      console.warn('Attempted to use item outside your turn');
      return;
    }
    console.log('🎒 GameBoard handleUseItem:', { itemType, targetId });
    wsService.useItem(itemType, targetId);
  };

  const handleFire = (targetId: string) => {
    if (!isMyTurnFlag) {
      console.warn('Attempted to fire outside your turn');
      return;
    }

    wsService.fire(targetId);
  };

  const handleBack = () => {
    // Leave room and go back to lobby
    console.log('👋 Leaving room...');
    const roomId = roomStatus?.roomid;
    if (roomId) {
      wsService.leaveRoom(roomId);
      // Clear room state but keep currentPlayer
      clearRoom();
      // Wait a bit for websocket message to be processed, then navigate
      setTimeout(() => {
        navigate('/lobby');
      }, 500);
    } else {
      navigate('/lobby');
    }
  };

  // Game Playing state - Use GameLayout
  if (roomStatus?.status === 'Playing') {
    return (
      <div style={{ position: 'relative' }}>
        <GameLayout
          players={roomStatus.players}
          currentPlayerId={currentPlayer?.ID}  // ✓ Current player (me)
          nextPlayerId={roomStatus.nextPlayer?.ID}  // ✓ Whose turn it is (for highlight)
          gun={roomStatus.gun}
          actionResponse={roomStatus.actionResponse}
          isMyTurn={isMyTurnFlag}
          onFire={handleFire}
          onSelectTarget={handleSelectTarget}
          onUseItem={handleUseItem}
          onBack={handleBack}
          selectedTargetId={getSelectedTargetId()}
          notifyMessage={messageText}
        />

        {/* ActionOverlay - Displays action animations */}
        {overlayData && (
          <ActionOverlay
            actionType={overlayData.actionType}
            actor={overlayData.actor}
            target={overlayData.target}
            message={overlayData.message}
            isVisible={showActionOverlay}
            onAnimationComplete={() => {
              setShowActionOverlay(false);
              setOverlayData(null);
            }}
          />
        )}
      </div>
    );
  }

  // Waiting state or fallback - Show GameLayout
  return (
    <div style={{ position: 'relative' }}>
      <GameLayout
        players={roomStatus?.players || []}
        currentPlayerId={currentPlayer?.ID}
        nextPlayerId={roomStatus?.nextPlayer?.ID}
        gun={roomStatus?.gun || []}
        actionResponse={roomStatus?.actionResponse || null}
        isMyTurn={isMyTurnFlag}
        onFire={handleFire}
        onSelectTarget={handleSelectTarget}
        onUseItem={handleUseItem}
        onBack={handleBack}
        selectedTargetId={getSelectedTargetId()}
        notifyMessage={messageText}
      />

      {/* ActionOverlay - Displays action animations */}
      {overlayData && (
        <ActionOverlay
          actionType={overlayData.actionType}
          actor={overlayData.actor}
          target={overlayData.target}
          isVisible={showActionOverlay}
          onAnimationComplete={() => {
            setShowActionOverlay(false);
            setOverlayData(null);
          }}
        />
      )}

      {/* Test Panel - Remove before production */}
      <ActionOverlayTestPanel />
    </div>
  );
}
