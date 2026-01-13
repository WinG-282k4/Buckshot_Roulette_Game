import { Client, IMessage, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RoomStatusResponse } from '../types/room.types';
import { API_BASE_URL } from '../config/api.config';

export class WebSocketService {
  private client: Client | null = null;
  private roomId: number | null = null;
  private playerId: string | null = null;
  private pendingRoomRejoin: { roomId: number; playerName: string } | null = null;
  private lastJoinRoomId: number | null = null;  // Track last join to prevent duplicates
  private lastJoinPlayerName: string | null = null;
  private roomSubscription: { unsubscribe: () => void } | null = null;  // Track current room subscription
  private lastMessageTime: number = 0;  // Track last message time
  private messageTimeoutId: number | null = null;  // Track timeout ID for clearing

  // Callbacks
  private onRoomUpdateCallback: ((data: RoomStatusResponse) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: IFrame) => void) | null = null;

  constructor(serverUrl?: string) {
    // Auto-detect backend URL từ frontend hostname
    const backendUrl = serverUrl || (() => {
      // Check for env variable first (Docker mode)
      if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
      }
      // Lấy hostname hiện tại (có thể là localhost, 192.168.153.1, etc.)
      const hostname = window.location.hostname;
      // Nếu là localhost/127.0.0.1, dùng localhost (dev mode)
      // Nếu là IP, dùng IP đó (production/LAN mode)
      return `http://${hostname}:80`;
    })();

    console.log('🔌 Connecting to backend at:', backendUrl);

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${backendUrl}/ws-game`),
      debug: (str: string) => console.log('[STOMP]', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    if (this.client) {
      this.client.onConnect = () => {
        console.log('✅ WebSocket connected!');

        // Subscribe to leave result (ActionResult from leave request)
        this.client!.subscribe('/user/topic/leave-result', (message: IMessage) => {
          const data = JSON.parse(message.body) as Record<string, unknown>;
          console.log('🚪 Leave result:', data);
          (window as unknown as Record<string, unknown>).__lastLeaveResult = data;
        });

        // Auto-rejoin phòng nếu có pending rejoin (from page reload)
        if (this.pendingRoomRejoin) {
          console.log('🔄 Auto-rejoin phòng after reconnection:', this.pendingRoomRejoin);
          const { roomId, playerName } = this.pendingRoomRejoin;
          setTimeout(() => {
            this.joinRoom(roomId, playerName);
          }, 500);
          this.pendingRoomRejoin = null; // Clear after rejoin
        }

        this.onConnectCallback?.();
      };

      this.client.onStompError = (frame: IFrame) => {
        console.error('❌ STOMP error:', frame);
        this.onErrorCallback?.(frame);
      };
    }
  }

  // Connect to WebSocket
  connect() {
    if (this.client && !this.client.active) {
      this.client.activate();
    }
  }

  // Disconnect
  disconnect() {
    if (this.client?.active) {
      this.client.deactivate();
    }
    this.clearMessageTimeout();
  }

  // Start/reset 20-second timeout to detect missing messages
  private startMessageTimeout() {
    // Clear previous timeout
    this.clearMessageTimeout();

    this.lastMessageTime = Date.now();

    // Set new timeout - if no message in 20 seconds, fetch and reconnect
    this.messageTimeoutId = setTimeout(() => {
      console.warn('⚠️ No WebSocket message received for 20 seconds');
      console.log('🔄 Attempting to fetch room status and reconnect...');

      if (this.roomId) {
        // Fetch latest room status
        this.fetchRoomStatus(this.roomId).then(() => {
          console.log('✅ Room status updated');
        }).catch(() => {
          console.error('❌ Failed to fetch room status');
        });

        // Try to reconnect WebSocket
        if (this.client && !this.client.connected) {
          console.log('🔌 Reconnecting WebSocket...');
          this.client.activate();
        }
      }

      // Restart timeout for next check
      this.startMessageTimeout();
    }, 20000);  // 20 seconds
  }

  // Clear message timeout
  private clearMessageTimeout() {
    if (this.messageTimeoutId) {
      clearTimeout(this.messageTimeoutId);
      this.messageTimeoutId = null;
    }
  }

  // Join room and subscribe to updates
  joinRoom(roomId: number, playerName: string) {
    if (!this.client?.connected) {
      console.error('WebSocket not connected!');
      return;
    }

    // Prevent duplicate join calls (especially from React StrictMode)
    if (this.lastJoinRoomId === roomId && this.lastJoinPlayerName === playerName) {
      console.log('⚠️ Already joining/joined room', roomId, 'with player', playerName, '- skipping duplicate join');
      return;
    }

    // Unsubscribe from previous room if joining new room
    if (this.roomSubscription && this.roomId !== roomId) {
      console.log('🔕 Unsubscribing from previous room:', this.roomId);
      this.roomSubscription.unsubscribe();
      this.roomSubscription = null;
    }

    this.lastJoinRoomId = roomId;
    this.lastJoinPlayerName = playerName;

    this.roomId = roomId;

    // Subscribe to room updates
    this.roomSubscription = this.client.subscribe(`/topic/room/${roomId}`, (message: IMessage) => {
      const data = JSON.parse(message.body) as RoomStatusResponse;
      console.log('📨 Room update received:', data);

      // Only start timeout when game is PLAYING, not during Waiting or Ended
      if (data.status === 'Playing') {
        console.log('🎮 Game is PLAYING - starting 20s timeout check');
        this.startMessageTimeout();
      } else {
        console.log('⏸️ Game is ' + data.status + ' - skipping timeout check');
        this.clearMessageTimeout();
      }

      // Handle RoomStatusResponse (from join success or game actions)
      if (data.status || data.roomid !== undefined || data.players) {
        console.log('🎮 Room update:', data);
        this.onRoomUpdateCallback?.(data);
      } else if (data.message && typeof data.message === 'string') {
        // Handle message from other actions
        console.log('📬 Action event:', data.message);
        this.fetchRoomStatus(roomId);
      } else {
        // Unknown format - fetch to be safe
        console.log('⚠️ Unknown format, fetching...');
        this.fetchRoomStatus(roomId);
      }
    });

    // Send join message with playerName in body (as fallback when session expires)
    this.client.publish({
      destination: `/app/join/${roomId}`,
      body: JSON.stringify({ name: playerName })
    });
  }

  // Fetch room status từ REST API
  public async fetchRoomStatus(roomId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Fetched room status:', data);
        this.onRoomUpdateCallback?.(data);
      }
    } catch (error) {
      console.error('Error fetching room status:', error);
    }
  }

  // Start game
  startGame() {
    if (!this.roomId || !this.client?.connected) return;

    this.client.publish({
      destination: `/app/room/${this.roomId}/startgame`,
      body: JSON.stringify({})
    });
  }

  // Fire at target
  fire(targetPlayerId: string) {
    if (!this.roomId || !this.client?.connected) return;

    console.log('🔫 Firing at target:', targetPlayerId);
    this.client.publish({
      destination: `/app/room/${this.roomId}/fire/${targetPlayerId}`,
      body: JSON.stringify({})  // Backend lấy actor từ session
    });
  }

  // Reload gun
  reload() {
    if (!this.roomId || !this.client?.connected) return;

    this.client.publish({
      destination: `/app/room/${this.roomId}/reload`,
      body: JSON.stringify({})
    });
  }

  // Select target
  selectTarget(targetId: string, gunAngle: number) {
    if (!this.roomId || !this.client?.connected) return;

    console.log('🎯 Selecting target:', { targetId, gunAngle });
    // Gửi targetId lên server, frontend tự tính góc
    this.client.publish({
      destination: `/app/room/${this.roomId}/target/${targetId}`,
      body: JSON.stringify({})
    });
  }

  // Use item
  useItem(itemType: number, targetId?: string) {
    if (!this.roomId || !this.client?.connected) return;

    console.log('🎒 Using item:', { itemType, targetId });
    this.client.publish({
      destination: `/app/room/${this.roomId}/use-item`,
      body: JSON.stringify({
        targetid: targetId || null,
        typeitem: itemType.toString()
      })
    });
  }

  // Leave room
  leaveRoom(roomId: number) {
    if (!this.client?.connected) return;

    console.log('👋 Leaving room:', roomId);

    // Unsubscribe from room topic
    if (this.roomSubscription) {
      console.log('🔕 Unsubscribing from room:', roomId);
      this.roomSubscription.unsubscribe();
      this.roomSubscription = null;
    }

    this.roomId = null;
    this.lastJoinRoomId = null;
    this.lastJoinPlayerName = null;

    this.client.publish({
      destination: `/app/leave/${roomId}`,
      body: JSON.stringify({})
    });
  }

  // Set callbacks
  onRoomUpdate(callback: (data: RoomStatusResponse) => void) {
    this.onRoomUpdateCallback = callback;
  }

  onConnect(callback: () => void) {
    this.onConnectCallback = callback;
  }

  onError(callback: (error: IFrame) => void) {
    this.onErrorCallback = callback;
  }


  setPlayerId(id: string) {
    this.playerId = id;
    // console.log('Player ID stored:', id);
  }

  getPlayerId(): string | null {
    return this.playerId;
  }

  // Set pending room rejoin for page reload scenario
  setPendingRoomRejoin(roomId: number, playerName: string) {
    this.pendingRoomRejoin = { roomId, playerName };
    // console.log('🔔 Pending room rejoin set:', { roomId, playerName });
  }
}

// Singleton instance
export const wsService = new WebSocketService();

