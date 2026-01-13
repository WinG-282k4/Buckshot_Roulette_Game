import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.config';
import backgroundImage from '../assets/img/background/background main v2.png';

// Avatar map for display
import { AVATAR_MAP } from '../utils/avatarMap';

const avatarOptions = [
  { key: 'black', name: 'Black' },
  { key: 'blue', name: 'Blue' },
  { key: 'brown', name: 'Brown' },
  { key: 'gray', name: 'Gray' },
  { key: 'green', name: 'Green' },
  { key: 'purple', name: 'Purple' },
  { key: 'red', name: 'Red' },
  { key: 'tim', name: 'Tim' },
  { key: 'yellow', name: 'Yellow' }
];

interface Room {
  roomid: number;
  status: string;
}

export default function LobbyPage() {
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('name') || 'Anonymous';
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('purple');
  const [tempSelectedAvatar, setTempSelectedAvatar] = useState('purple');
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  useEffect(() => {
    fetchRooms();
    // Initialize tempSelectedAvatar with selectedAvatar
    setTempSelectedAvatar(selectedAvatar);
  }, [selectedAvatar]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/list/0`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const roomList: Room[] = await response.json();
      console.log('📋 Fetched rooms:', roomList);

      setRooms(roomList);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/room/createroom`, {
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

  const handleAvatarSelect = (avatarKey: string) => {
    setTempSelectedAvatar(avatarKey);
  };

  const handleUpdateAvatar = async () => {
    try {
      setIsUpdatingAvatar(true);
      const response = await fetch(`${API_BASE_URL}/api/user/updateavatar/${tempSelectedAvatar}`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('✅ Avatar updated to:', tempSelectedAvatar);
        setSelectedAvatar(tempSelectedAvatar);
      } else {
        console.error('Failed to update avatar');
        alert('Cập nhật avatar thất bại!');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Lỗi khi cập nhật avatar!');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleBack = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/off`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('✅ Player removed from session');
        localStorage.removeItem('playerId');
        localStorage.removeItem('lastPlayerName');
        navigate('/');
      } else {
        console.error('Failed to remove player');
        navigate('/');
      }
    } catch (error) {
      console.error('Error removing player:', error);
      navigate('/');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px 20px',
        position: 'relative'
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }}
      ></div>

      {/* Content Container */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '48px',
              color: '#ef4444',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}
          >
            🎯 LOBBY
          </h1>
          <p style={{ color: '#d1d5db', fontSize: '18px' }}>
            Xin chào, <strong style={{ color: '#fbbf24' }}>{playerName}</strong>!
          </p>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '30px'
            }}
          >
            {/* Left: Danh sách phòng */}
            <div>
              <div
                style={{
                  background: '#111827',
                  borderRadius: '12px',
                  border: '2px solid #374151',
                  padding: '30px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px'
                  }}
                >
                  <h2
                    style={{
                      fontSize: '28px',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
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
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = '#4b5563')}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = '#374151')}
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
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '60px 20px',
                      background: '#1f2937',
                      borderRadius: '8px',
                      border: '2px dashed #374151'
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>🚪</div>
                    <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '10px' }}>
                      Chưa có phòng nào
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Hãy tạo phòng mới để bắt đầu!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {rooms.map((room: Room) => (
                      <div
                        key={room.roomid}
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
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.currentTarget.style.borderColor = '#ef4444';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.currentTarget.style.borderColor = '#374151';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              color: 'white',
                              fontSize: '20px',
                              marginBottom: '8px',
                              fontWeight: 'bold'
                            }}
                          >
                            🎮 Phòng #{room.roomid}
                          </h3>
                          <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
                            <span
                              style={{
                                color: room.status === 'Waiting' ? '#10b981' : '#ef4444'
                              }}
                            >
                              ● {room.status === 'Waiting' ? 'Đang chờ' : 'Đang chơi'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleJoinRoom(room.roomid)}
                          disabled={room.status !== 'Waiting'}
                          style={{
                            padding: '12px 28px',
                            background: room.status === 'Waiting' ? '#3b82f6' : '#4b5563',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: room.status === 'Waiting' ? 'pointer' : 'not-allowed'
                          }}
                          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                            if (room.status === 'Waiting') {
                              e.currentTarget.style.background = '#2563eb';
                            }
                          }}
                          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                            if (room.status === 'Waiting') {
                              e.currentTarget.style.background = '#3b82f6';
                            }
                          }}
                        >
                          {room.status !== 'Waiting' ? 'ĐANG CHƠI' : 'THAM GIA'}
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
              <div
                style={{
                  background: '#111827',
                  borderRadius: '12px',
                  border: '2px solid #374151',
                  padding: '30px'
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    marginBottom: '15px',
                    fontWeight: 'bold'
                  }}
                >
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
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = '#b91c1c';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = '#dc2626';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🎮 TẠO PHÒNG
                </button>
              </div>

              {/* Join by ID */}
              <div
                style={{
                  background: '#111827',
                  borderRadius: '12px',
                  border: '2px solid #374151',
                  padding: '30px'
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    marginBottom: '15px',
                    fontWeight: 'bold'
                  }}
                >
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
                    marginBottom: '15px',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = '#374151')}
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
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (roomIdInput) e.currentTarget.style.background = '#2563eb';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (roomIdInput) e.currentTarget.style.background = '#3b82f6';
                  }}
                >
                  THAM GIA
                </button>
              </div>

              {/* Avatar Selection */}
              <div
                style={{
                  background: '#111827',
                  borderRadius: '12px',
                  border: '2px solid #374151',
                  padding: '30px'
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    marginBottom: '15px',
                    fontWeight: 'bold'
                  }}
                >
                  🎨 Chọn Avatar
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>
                  Lựa chọn avatar trước khi vào phòng
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px'
                  }}
                >
                  {avatarOptions.map((avatar: typeof avatarOptions[0]) => (
                    <button
                      key={avatar.key}
                      onClick={() => handleAvatarSelect(avatar.key)}
                      style={{
                        background: tempSelectedAvatar === avatar.key ? '#3b82f6' : '#1f2937',
                        border: `2px solid ${tempSelectedAvatar === avatar.key ? '#60a5fa' : '#374151'}`,
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.currentTarget.style.background = tempSelectedAvatar === avatar.key ? '#3b82f6' : '#374151';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.currentTarget.style.background = tempSelectedAvatar === avatar.key ? '#3b82f6' : '#1f2937';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                  <img
                      src={AVATAR_MAP[avatar.key]}
                      alt={avatar.name}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%'
                        }}
                      />
                      <span
                        style={{
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          textAlign: 'center'
                        }}
                      >
                        {avatar.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Update Avatar Button */}
                <button
                  onClick={handleUpdateAvatar}
                  disabled={isUpdatingAvatar || tempSelectedAvatar === selectedAvatar}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: tempSelectedAvatar === selectedAvatar ? '#6b7280' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: tempSelectedAvatar === selectedAvatar ? 'not-allowed' : 'pointer',
                    marginTop: '12px',
                    opacity: tempSelectedAvatar === selectedAvatar ? 0.6 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (tempSelectedAvatar !== selectedAvatar && !isUpdatingAvatar) {
                      e.currentTarget.style.background = '#059669';
                    }
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (tempSelectedAvatar !== selectedAvatar) {
                      e.currentTarget.style.background = '#10b981';
                    }
                  }}
                >
                  {isUpdatingAvatar ? '⏳ Đang cập nhật...' : '✓ Cập nhật Avatar'}
                </button>
              </div>

              {/* Back button */}
              <button
                onClick={handleBack}
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
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.background = '#4b5563';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
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
    </div>
  );
}
