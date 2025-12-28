import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { wsService } from '../services/websocket.service';
import { useGameStore } from '../stores/gameStore';
import GameBoard from '../components/Game/GameBoard';

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('name') || 'Anonymous';
  const navigate = useNavigate();

  const [isConnected, setIsConnected] = useState(false);
  const [isPlayerCreated, setIsPlayerCreated] = useState(false);
  const { roomStatus, setRoomStatus, setCurrentPlayer } = useGameStore();

  // Tạo player trước khi connect WebSocket
  useEffect(() => {
    const createPlayer = async () => {
      try {
        const response = await fetch(`http://localhost:8080/user/create/${encodeURIComponent(playerName)}`, {
          method: 'POST',
          credentials: 'include'
        });

        if (response.ok) {
          const player = await response.json();
          console.log('✅ Player created/verified:', player);
          setIsPlayerCreated(true);
        } else {
          throw new Error('Failed to create player');
        }
      } catch (error) {
        console.error('❌ Error creating player:', error);
        alert('Không thể tạo người chơi. Vui lòng quay lại trang chủ!');
        navigate('/');
      }
    };

    createPlayer();
  }, [playerName, navigate]);

  useEffect(() => {
    // Chỉ connect WebSocket khi player đã được tạo
    if (!isPlayerCreated) return;

    // Setup WebSocket callbacks
    wsService.onConnect(() => {
      console.log('✅ WebSocket connected! Joining room:', roomId);
      setIsConnected(true);
      wsService.joinRoom(Number(roomId), playerName);
    });

    wsService.onRoomUpdate((data) => {
      console.log('📨 Room update received:', data);
      setRoomStatus(data);

      // Tìm player hiện tại trong danh sách
      const myPlayer = data.players.find(p => p.name === playerName);
      if (myPlayer) {
        setCurrentPlayer(myPlayer);
        wsService.setPlayerId(myPlayer.ID);
      }
    });

    // Connect
    wsService.connect();

    // Cleanup
    return () => {
      wsService.disconnect();
    };
  }, [isPlayerCreated, roomId, playerName, setRoomStatus, setCurrentPlayer]);

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

  // Waiting Room (status === "WAITING")
  if (!roomStatus || roomStatus.status === 'WAITING') {
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
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: '#374151',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {index === 0 ? '👑' : '👤'}
                  </div>
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
            disabled={!roomStatus || roomStatus.players.length < 2}
            style={{
              width: '100%',
              padding: '20px',
              background: (roomStatus && roomStatus.players.length >= 2) ? '#22c55e' : '#4b5563',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '24px',
              fontWeight: 'bold',
              cursor: (roomStatus && roomStatus.players.length >= 2) ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              marginBottom: '20px'
            }}
            onMouseEnter={(e) => {
              if (roomStatus && roomStatus.players.length >= 2) {
                e.currentTarget.style.background = '#16a34a';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }
            }}
            onMouseLeave={(e) => {
              if (roomStatus && roomStatus.players.length >= 2) {
                e.currentTarget.style.background = '#22c55e';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {roomStatus && roomStatus.players.length >= 2 ? (
              <>🎮 BẮT ĐẦU GAME</>
            ) : (
              <>⏳ CHỜ NGƯỜI CHƠI</>
            )}
          </button>

          {/* Back button */}
          <button
            onClick={() => navigate('/lobby?name=' + encodeURIComponent(playerName))}
            style={{
              width: '100%',
              padding: '14px',
              background: '#374151',
              color: '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4b5563';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#374151';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            ← Quay lại Lobby
          </button>
        </div>
      </div>
    );
  }

  // Game Board (status === "PLAYING")
  return <GameBoard />;
}

