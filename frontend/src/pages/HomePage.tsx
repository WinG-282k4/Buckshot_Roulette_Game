import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import backgroundImage from '../assets/img/background/background main v2.png';

export default function HomePage() {
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentPlayer } = useGameStore();

  // Note: We don't clear player session here because player might just be browsing back
  // Player session is only cleared when user explicitly logs out or when creating a new player

  const handleCreatePlayer = async () => {
    if (!playerName.trim()) {
      alert('Vui lòng nhập tên!');
      return;
    }

    setIsLoading(true);
    try {
      const backendUrl = `http://${window.location.hostname}:8080`;
      const response = await fetch(`${backendUrl}/user/create/${encodeURIComponent(playerName)}`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create player');
      }

      const player = await response.json();
      console.log('✅ Player created/verified:', player);

      // Lưu player vào gameStore
      setCurrentPlayer(player);
      console.log('💾 Saved player to gameStore:', player);

      // Chuyển sang trang Lobby
      navigate(`/lobby?name=${encodeURIComponent(playerName)}`);
    } catch (error) {
      console.error('Error creating player:', error);
      alert('Không thể tạo người chơi. Vui lòng kiểm tra backend!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreatePlayer();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1
      }}></div>

      <div style={{
        background: '#111827',
        padding: '60px 40px',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%',
        border: '2px solid #991b1b',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Logo/Title */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎯</div>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#ef4444',
            marginBottom: '10px',
            letterSpacing: '2px'
          }}>
            BUCKSHOT ROULETTE
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            A deadly game of chance and strategy
          </p>
        </div>

        {/* Input Section */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            color: '#d1d5db',
            fontSize: '16px',
            marginBottom: '12px',
            textAlign: 'left'
          }}>
            👤 Nhập tên của bạn:
          </label>
          <input
            type="text"
            placeholder="Player Name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '18px',
              borderRadius: '10px',
              border: '2px solid #374151',
              background: '#1f2937',
              color: 'white',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ef4444'}
            onBlur={(e) => e.target.style.borderColor = '#374151'}
            autoFocus
          />
        </div>

        {/* Button */}
        <button
          onClick={handleCreatePlayer}
          disabled={!playerName.trim() || isLoading}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '20px',
            fontWeight: 'bold',
            borderRadius: '10px',
            border: 'none',
            background: (playerName.trim() && !isLoading) ? '#dc2626' : '#4b5563',
            color: 'white',
            cursor: (playerName.trim() && !isLoading) ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            if (playerName.trim() && !isLoading) {
              e.currentTarget.style.background = '#b91c1c';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (playerName.trim() && !isLoading) {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {isLoading ? (
            <>
              <span>⏳</span>
              <span>Đang tạo...</span>
            </>
          ) : (
            <>
              <span>🎮</span>
              <span>VÀO LOBBY</span>
            </>
          )}
        </button>

        {/* Footer Info */}
        <p style={{
          marginTop: '30px',
          color: '#6b7280',
          fontSize: '13px',
          lineHeight: '1.6'
        }}>
          💡 Sau khi nhập tên, bạn sẽ vào lobby để<br/>
          xem danh sách phòng hoặc tạo phòng mới
        </p>
      </div>
    </div>
  );
}

