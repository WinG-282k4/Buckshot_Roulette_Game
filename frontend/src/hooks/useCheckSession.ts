import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { API_BASE_URL } from '../config/api.config';

export const useCheckSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPlayer, setCurrentPlayer } = useGameStore();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Chỉ kiểm tra session 1 lần khi component mount
    if (hasCheckedRef.current) {
      return;
    }

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

          // Nếu user đang ở trang home hoặc root path, redirect thích hợp
          if (location.pathname === '/' || location.pathname === '') {
            // Nếu có roomid trong session, vào phòng luôn
            if (player.roomid) {
              console.log('🎮 Redirecting to room:', player.roomid);
              navigate(`/room/${player.roomid}`, { replace: true });
            } else {
              // Nếu chưa vào phòng, vào lobby
              console.log('📋 Redirecting to lobby');
              navigate('/lobby', { replace: true });
            }
          }
        } else {
          // Không có session
          console.log('❌ No session found');
          if (location.pathname !== '/' && location.pathname !== '') {
            // Nếu không ở trang home, redirect về home
            console.log('Redirecting to home page');
            navigate('/', { replace: true });
          }
          // Nếu đã ở trang home, stay ở đây
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (location.pathname !== '/' && location.pathname !== '') {
          // Nếu lỗi và không ở trang home, redirect về home
          navigate('/', { replace: true });
        }
      } finally {
        hasCheckedRef.current = true;
      }
    };

    checkSession();
  }, [currentPlayer, navigate, location.pathname, setCurrentPlayer]);
};

