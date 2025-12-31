import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { wsService } from '../services/websocket.service';
import { useGameStore } from '../stores/gameStore';
import GameBoard from '../components/Game/GameBoard';
import { getColorFromAvatarUrl, AVATAR_MAP } from '../utils/avatarMap';

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize playerName from URL or localStorage
  const [playerName, setPlayerName] = useState('');

  const [isConnected, setIsConnected] = useState(false);
  const [isPlayerCreated, setIsPlayerCreated] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('purple');
  const [isLeavingRoom, setIsLeavingRoom] = useState(false);
  const { roomStatus, setRoomStatus, setCurrentPlayer, clearRoom } = useGameStore();

  // Ref to prevent duplicate WebSocket connections
  const wsConnectionSetupRef = useRef(false);
  const hasRequestedLeaveRef = useRef(false);

  // Initialize playerName - run only once on mount
  useEffect(() => {
    const name = searchParams.get('name') || localStorage.getItem('lastPlayerName') || 'Anonymous';

    // If playerName is still 'Anonymous', try to fetch from backend (incognito mode scenario)
    if (name === 'Anonymous') {
      const fetchPlayerName = async () => {
        try {
          const backendUrl = `http://${window.location.hostname}:8080`;
          const response = await fetch(`${backendUrl}/user/me`, {
            method: 'POST',
            credentials: 'include'
          });

          if (response.ok) {
            const player = await response.json();
            console.log('✅ Got player from backend:', player.name);
            setPlayerName(player.name);
          } else {
            // Backend returned error, use Anonymous
            setPlayerName('Anonymous');
          }
        } catch (error) {
          console.error('Error fetching player from backend:', error);
          setPlayerName('Anonymous');
        }
      };

      fetchPlayerName();
    } else {
      setPlayerName(name);
    }

    if (roomId) {
      localStorage.setItem('lastRoomId', roomId);
      localStorage.setItem('lastPlayerName', name);
      console.log('💾 Saved room info to localStorage:', { roomId, playerName: name });
    }
  }, []); // Empty dependency - run only once

  // Nếu không có roomId từ URL, thử lấy từ localStorage
  useEffect(() => {
    if (!roomId && playerName) {
      const savedRoomId = localStorage.getItem('lastRoomId');
      if (savedRoomId) {
        console.log('🔄 Khôi phục roomId từ localStorage:', savedRoomId);
        navigate(`/room/${savedRoomId}?name=${encodeURIComponent(playerName)}`);
      }
    }
  }, [roomId, playerName, navigate]);

  // Initialize player creation and setup WebSocket
  useEffect(() => {
    // Only proceed if we have roomId and playerName
    if (!roomId || !playerName) return;

    // Set player as created - backend will handle creation if needed
    // This ensures WebSocket setup proceeds even if localStorage is empty (e.g., incognito mode)
    setIsPlayerCreated(true);
  }, [roomId, playerName]);

  // Setup WebSocket connection when player is ready
  useEffect(() => {
    // Only connect when player is marked as created
    if (!isPlayerCreated) return;

    // Reset ref khi roomId thay đổi (user joins different room)
    wsConnectionSetupRef.current = false;

    // Prevent duplicate setup due to React StrictMode in development
    if (wsConnectionSetupRef.current) {
      console.log('⚠️ WebSocket setup already in progress, skipping duplicate setup');
      return;
    }
    wsConnectionSetupRef.current = true;

    // Set pending room rejoin (important for reload scenario)
    if (roomId) {
      wsService.setPendingRoomRejoin(Number(roomId), playerName);
    }

    // Setup WebSocket callbacks
    wsService.onConnect(() => {
      console.log('✅ WebSocket connected! Joining room:', roomId);
      setIsConnected(true);
      // Auto-rejoin already handled by wsService.onConnect
      // But explicitly call for non-reload scenarios
      if (roomId && !wsService.getPlayerId()) {
        wsService.joinRoom(Number(roomId), playerName);
      }
    });

    wsService.onRoomUpdate((data) => {
      console.log('📨 Room update received:', data);
      console.log('👥 Players in room:', data.players.map(p => ({ id: p.ID, name: p.name })));
      setRoomStatus(data);

      // Priority 1: Try to find by playerName (for multi-room scenarios where ID might differ)
      let myPlayer = data.players.find(p => p.name === playerName);

      if (myPlayer) {
        // Found by name - this is our player
        console.log('✅ Found player by name:', { id: myPlayer.ID, name: myPlayer.name });
        wsService.setPlayerId(myPlayer.ID);  // Update playerId to current room's player ID
        setCurrentPlayer(myPlayer);
        setSelectedAvatar(getAvatarKeyFromUrl(myPlayer.URLavatar));
        setIsViewer(false);
      } else {
        // Priority 2: Try to find by playerId (for single room scenarios)
        const myPlayerId = wsService.getPlayerId();
        console.log('🔍 Player name not found, looking for playerId:', myPlayerId);

        if (myPlayerId) {
          myPlayer = data.players.find(p => p.ID === myPlayerId);
          if (myPlayer) {
            console.log('✅ Found player by ID:', { id: myPlayer.ID, name: myPlayer.name });
            setCurrentPlayer(myPlayer);
            setSelectedAvatar(getAvatarKeyFromUrl(myPlayer.URLavatar));
            setIsViewer(false);
          } else {
            console.log('⚠️ Player ID not found in room:', myPlayerId, ' - treating as VIEWER');
            setIsViewer(true);
          }
        } else {
          console.log('⚠️ No playerId or playerName found - treating as VIEWER');
          setIsViewer(true);
        }
      }
    });


    // Connect
    wsService.connect();

    // Cleanup: Send leave API when unmounting or changing rooms
    return () => {
      console.log('🚪 Cleaning up - leaving room:', roomId);
      // Only send leave if user didn't explicitly click "leave" button
      // (handleLeaveRoom sets hasRequestedLeaveRef.current = true)
      if (roomId && !hasRequestedLeaveRef.current) {
        // Send leave API to remove player from this room
        wsService.leaveRoom(Number(roomId));
      }
      wsConnectionSetupRef.current = false;
      wsService.disconnect();
    };
  }, [isPlayerCreated, roomId, playerName, setRoomStatus, setCurrentPlayer]);

  // Function to get avatar color from URL or color name
  const getAvatarKeyFromUrl = (url?: string): string => {
    return getColorFromAvatarUrl(url);
  };

  // Handle leave room
  const handleLeaveRoom = () => {
    setIsLeavingRoom(true);
    hasRequestedLeaveRef.current = true; // Mark that user explicitly requested leave
    console.log('👋 Requesting to leave room:', roomId);
    (window as any).__lastLeaveResult = null; // Clear any previous result
    wsService.leaveRoom(Number(roomId));

    // Check leave result after a moment
    const timeoutId = setTimeout(() => {
      const leaveResult = (window as any).__lastLeaveResult;
      console.log('🔍 Leave result received:', leaveResult);
      console.log('  - isSuccess type:', typeof leaveResult?.isSuccess, 'value:', leaveResult?.isSuccess);

      // Only navigate if isSuccess is explicitly true
      if (leaveResult && leaveResult.isSuccess === true) {
        // Leave successful - ONLY navigate here
        console.log('✅ Left room successfully');
        localStorage.removeItem('playerId');
        clearRoom();
        navigate(`/lobby?name=${encodeURIComponent(playerName)}`);
      } else {
        // Leave failed or no result
        if (leaveResult) {
          console.log('⚠️ Cannot leave room:', leaveResult.message);
          alert(leaveResult.message || 'Không thể rời phòng lúc này!');
        } else {
          console.log('⚠️ No leave result received - timeout');
          alert('Không thể rời phòng lúc này!');
        }
        // Reset flag so cleanup can handle it if needed
        hasRequestedLeaveRef.current = false;
        setIsLeavingRoom(false);
      }
      // Clear the result
      (window as any).__lastLeaveResult = null;
    }, 500);

    // Cleanup function (not actually used in this case)
    return () => clearTimeout(timeoutId);
  };

  // Loading state
  if (!isPlayerCreated || !isConnected) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #7f1d1d, #000000)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⏳</div>
          <div style={{ color: 'white', fontSize: '24px', marginBottom: '10px' }}>
            {!isPlayerCreated ? 'Đang tạo người chơi...' : 'Đang kết nối...'}
          </div>
          <div style={{ color: '#9ca3af', fontSize: '14px' }}>
            Vui lòng chờ...
          </div>
        </div>
      </div>
    );
  }

  // Waiting Room - Khi status là "Waiting"
  if (!roomStatus || roomStatus.status === 'Waiting') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #7f1d1d, #000000)',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '48px',
              color: '#ef4444',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              🎯 PHÒNG CHỜ
            </h1>
            <div style={{
              display: 'inline-block',
              background: '#1f2937',
              padding: '10px 30px',
              borderRadius: '20px',
              border: '2px solid #374151'
            }}>
              <p style={{ color: '#fbbf24', fontSize: '20px', fontWeight: 'bold' }}>
                Room #{roomId}
              </p>
              {isViewer && (
                <p style={{ color: '#f97316', fontSize: '14px', marginTop: '8px' }}>
                  📺 Bạn đang xem như VIEWER
                </p>
              )}
            </div>
          </div>

          {/* Players Section */}
          <div style={{
            background: '#111827',
            borderRadius: '12px',
            border: '2px solid #374151',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '24px',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              👥 Người chơi ({roomStatus?.players.length || 1}/4)
              {roomStatus && roomStatus.players.length >= 2 && roomStatus.players.length < 4 && (
                <span style={{
                  marginLeft: '10px',
                  fontSize: '14px',
                  color: '#22c55e',
                  fontWeight: 'normal'
                }}>
                  ✓ Đủ người để bắt đầu
                </span>
              )}
              {roomStatus && roomStatus.players.length >= 4 && (
                <span style={{
                  marginLeft: '10px',
                  fontSize: '14px',
                  color: '#fbbf24',
                  fontWeight: 'normal'
                }}>
                  ⚠️ Phòng đã đầy
                </span>
              )}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {roomStatus?.players.map((player, index) => (
                <div
                  key={player.ID}
                  style={{
                    background: player.name === playerName ? '#1e3a8a' : '#1f2937',
                    padding: '20px',
                    borderRadius: '8px',
                    border: `2px solid ${player.name === playerName ? '#3b82f6' : '#374151'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}
                >
                  {player.name === playerName ? (
                    <img
                      src={AVATAR_MAP[selectedAvatar]}
                      alt="Avatar"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        border: '2px solid #3b82f6'
                      }}
                    />
                  ) : (
                    <img
                      src={AVATAR_MAP[getColorFromAvatarUrl(player.URLavatar)] || AVATAR_MAP['purple']}
                      alt={`${player.name}'s Avatar`}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        border: '2px solid #374151'
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '5px'
                    }}>
                      {player.name}
                      {player.name === playerName && (
                        <span style={{
                          marginLeft: '10px',
                          color: '#fbbf24',
                          fontSize: '14px'
                        }}>
                          (Bạn)
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                      ● Đã sẵn sàng
                    </div>
                  </div>
                  {index === 0 && (
                    <div style={{
                      background: '#fbbf24',
                      color: '#000',
                      padding: '5px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      HOST
                    </div>
                  )}
                </div>
              )) || (
                <div style={{
                  background: '#1f2937',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '2px solid #374151',
                  textAlign: 'center',
                  color: '#9ca3af'
                }}>
                  <p>Đang chờ dữ liệu...</p>
                </div>
              )}
            </div>

            {/* Waiting message */}
            {(!roomStatus || roomStatus.players.length < 2) && (
              <div style={{
                marginTop: '25px',
                padding: '20px',
                background: '#1e293b',
                borderRadius: '8px',
                border: '2px dashed #475569',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>
                  Đang chờ thêm người chơi...
                </p>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
                  Cần tối thiểu 2 người để bắt đầu game
                </p>
              </div>
            )}
          </div>

          {/* Start Button */}
          <button
            onClick={() => wsService.startGame()}
            disabled={!roomStatus || roomStatus.players.length < 2 || isViewer}
            style={{
              width: '100%',
              padding: '20px',
              background: (roomStatus && roomStatus.players.length >= 2 && !isViewer) ? '#22c55e' : '#4b5563',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '24px',
              fontWeight: 'bold',
              cursor: (roomStatus && roomStatus.players.length >= 2 && !isViewer) ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              marginBottom: '20px'
            }}
            onMouseEnter={(e) => {
              if (roomStatus && roomStatus.players.length >= 2 && !isViewer) {
                e.currentTarget.style.background = '#16a34a';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }
            }}
            onMouseLeave={(e) => {
              if (roomStatus && roomStatus.players.length >= 2 && !isViewer) {
                e.currentTarget.style.background = '#22c55e';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isViewer ? (
              <>📺 BẠN LÀ VIEWER</>
            ) : roomStatus && roomStatus.players.length >= 2 ? (
              <>🎮 BẮT ĐẦU GAME</>
            ) : (
              <>⏳ CHỜ NGƯỜI CHƠI</>
            )}
          </button>

          {/* Back button */}
          <button
            onClick={handleLeaveRoom}
            disabled={isLeavingRoom || (roomStatus && roomStatus.status === 'Playing')}
            style={{
              width: '100%',
              padding: '14px',
              background: (roomStatus && roomStatus.status === 'Playing') ? '#6b7280' : '#374151',
              color: (roomStatus && roomStatus.status === 'Playing') ? '#9ca3af' : '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: (roomStatus && roomStatus.status === 'Playing') || isLeavingRoom ? 'not-allowed' : 'pointer',
              opacity: (roomStatus && roomStatus.status === 'Playing') ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!((roomStatus && roomStatus.status === 'Playing') || isLeavingRoom)) {
                e.currentTarget.style.background = '#4b5563';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (!((roomStatus && roomStatus.status === 'Playing') || isLeavingRoom)) {
                e.currentTarget.style.background = '#374151';
                e.currentTarget.style.color = '#9ca3af';
              }
            }}
          >
            {isLeavingRoom ? '⏳ Đang rời...' : (roomStatus && roomStatus.status === 'Playing') ? '🎮 Game đang chơi...' : '← Quay lại Lobby'}
          </button>
        </div>
      </div>
    );
  }

  // Game Board - Khi đã có nextPlayer (game đã start)
  return <GameBoard />;
}
