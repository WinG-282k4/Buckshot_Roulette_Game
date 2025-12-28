import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Room {
  id: number;
  playerCount: number;
  status: string;
}

export default function LobbyPage() {
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('name') || 'Anonymous';
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roomIdInput, setRoomIdInput] = useState('');

  // Fetch danh sách phòng - Chỉ khi mount và khi click Làm mới
  useEffect(() => {
    fetchRooms();
    // Bỏ auto-refresh
  }, []);

  const fetchRooms = async () => {
    try {
      // Call API để lấy danh sách room IDs
      const response = await fetch('http://localhost:8080/api/rooms/list/0', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const roomIds: number[] = await response.json();
      console.log('📋 Fetched room IDs:', roomIds);

      // Fetch chi tiết từng phòng
      const roomDetails = await Promise.all(
        roomIds.map(async (id) => {
          try {
            const res = await fetch(`http://localhost:8080/api/rooms/${id}`, {
              credentials: 'include'
            });
            if (res.ok) {
              const data = await res.json();
              return {
                id: data.roomid,
                playerCount: data.players.length,
                status: data.status // Backend đã trả về "Playing" hoặc "Waiting"
              };
            }
          } catch (err) {
            console.error('Error fetching room', id, err);
          }
          return null;
        })
      );

      // Filter out null values
      setRooms(roomDetails.filter(r => r !== null) as Room[]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/createroom', {
        method: 'POST',
        credentials: 'include'
      });
      const text = await response.text();
      const newRoomId = text.match(/\d+/)?.[0];

      if (newRoomId) {
        navigate(`/room/${newRoomId}?name=${encodeURIComponent(playerName)}`);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Không thể tạo phòng!');
    }
  };

  const handleJoinRoom = (roomId: number | string) => {
    navigate(`/room/${roomId}?name=${encodeURIComponent(playerName)}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #7f1d1d, #000000)',
      padding: '40px 20px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '48px',
          color: '#ef4444',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          🎯 LOBBY
        </h1>
        <p style={{ color: '#d1d5db', fontSize: '18px' }}>
          Xin chào, <strong style={{ color: '#fbbf24' }}>{playerName}</strong>!
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

          {/* Left: Danh sách phòng */}
          <div>
            <div style={{
              background: '#111827',
              borderRadius: '12px',
              border: '2px solid #374151',
              padding: '30px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px'
              }}>
                <h2 style={{
                  fontSize: '28px',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  🏠 Phòng có sẵn
                </h2>
                <button
                  onClick={fetchRooms}
                  style={{
                    padding: '8px 16px',
                    background: '#374151',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#4b5563'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#374151'}
                >
                  🔄 Làm mới
                </button>
              </div>

              {/* Room List */}
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  ⏳ Đang tải...
                </div>
              ) : rooms.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: '#1f2937',
                  borderRadius: '8px',
                  border: '2px dashed #374151'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>🚪</div>
                  <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '10px' }}>
                    Chưa có phòng nào
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    Hãy tạo phòng mới để bắt đầu!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      style={{
                        background: '#1f2937',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '2px solid #374151',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#ef4444';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#374151';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div>
                        <h3 style={{
                          color: 'white',
                          fontSize: '20px',
                          marginBottom: '8px',
                          fontWeight: 'bold'
                        }}>
                          🎮 Phòng #{room.id}
                        </h3>
                        <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
                          <span style={{ color: '#9ca3af' }}>
                            👥 {room.playerCount} người
                          </span>
                          <span style={{
                            color: room.status === 'Waiting' ? '#10b981' : '#ef4444'
                          }}>
                            ● {room.status === 'Waiting' ? 'Đang chờ' : 'Đang chơi'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinRoom(room.id)}
                        disabled={room.status !== 'Waiting' || room.playerCount >= 4}
                        style={{
                          padding: '12px 28px',
                          background: (room.status === 'Waiting' && room.playerCount < 4) ? '#3b82f6' : '#4b5563',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: (room.status === 'Waiting' && room.playerCount < 4) ? 'pointer' : 'not-allowed'
                        }}
                        onMouseEnter={(e) => {
                          if (room.status === 'Waiting' && room.playerCount < 4) {
                            e.currentTarget.style.background = '#2563eb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (room.status === 'Waiting' && room.playerCount < 4) {
                            e.currentTarget.style.background = '#3b82f6';
                          }
                        }}
                      >
                        {room.status !== 'Waiting'
                          ? 'ĐANG CHƠI'
                          : room.playerCount >= 4
                            ? 'ĐẦY (4/4)'
                            : 'THAM GIA'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Create Room */}
            <div style={{
              background: '#111827',
              borderRadius: '12px',
              border: '2px solid #374151',
              padding: '30px'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '20px',
                marginBottom: '15px',
                fontWeight: 'bold'
              }}>
                ➕ Tạo phòng mới
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>
                Tạo phòng mới và mời bạn bè tham gia
              </p>
              <button
                onClick={handleCreateRoom}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#b91c1c';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🎮 TẠO PHÒNG
              </button>
            </div>

            {/* Join by ID */}
            <div style={{
              background: '#111827',
              borderRadius: '12px',
              border: '2px solid #374151',
              padding: '30px'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '20px',
                marginBottom: '15px',
                fontWeight: 'bold'
              }}>
                🔑 Nhập mã phòng
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>
                Tham gia phòng của bạn bè
              </p>
              <input
                type="text"
                placeholder="Nhập Room ID..."
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '2px solid #374151',
                  background: '#1f2937',
                  color: 'white',
                  outline: 'none',
                  marginBottom: '15px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#374151'}
              />
              <button
                onClick={() => handleJoinRoom(roomIdInput)}
                disabled={!roomIdInput}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: roomIdInput ? '#3b82f6' : '#4b5563',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: roomIdInput ? 'pointer' : 'not-allowed'
                }}
                onMouseEnter={(e) => {
                  if (roomIdInput) e.currentTarget.style.background = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  if (roomIdInput) e.currentTarget.style.background = '#3b82f6';
                }}
              >
                THAM GIA
              </button>
            </div>

            {/* Back button */}
            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                padding: '12px',
                background: '#374151',
                color: '#9ca3af',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
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
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

