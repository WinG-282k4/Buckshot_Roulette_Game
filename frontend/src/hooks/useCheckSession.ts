import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { API_BASE_URL } from '../config/api.config';

export const useCheckSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPlayer, setCurrentPlayer } = useGameStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/me`, {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const player = await response.json();
          console.log('✅ Session found:', player);

          // Lưu player vào gameStore
          setCurrentPlayer(player);

          // Nếu có roomid trong session, vào phòng luôn
          if (player.roomid) {
            console.log('🎮 Redirecting to room:', player.roomid);
            navigate(`/room/${player.roomid}`);
          } else {
            // Nếu chưa vào phòng, vào lobby
            console.log('📋 Redirecting to lobby');
            navigate('/lobby');
          }
        } else {
          // Không có session, redirect về home page (trang đăng nhập)
          console.log('❌ No session found, redirecting to home page');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Nếu lỗi, redirect về home page
        navigate('/', { replace: true });
      }
    };

    // Không kiểm tra trên home page vì đó là trang tạo player
    if (location.pathname === '/') {
      return;
    }

    // Chỉ kiểm tra nếu chưa có currentPlayer trong store
    if (!currentPlayer) {
      checkSession();
    }
  }, [currentPlayer, navigate, location.pathname, setCurrentPlayer]);
};

