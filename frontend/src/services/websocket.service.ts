import { Client, IMessage, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RoomStatusResponse } from '../types/room.types';

export class WebSocketService {
  private client: Client | null = null;
  private roomId: number | null = null;
  private playerId: string | null = null;
  private pendingRoomRejoin: { roomId: number; playerName: string } | null = null;
  private lastJoinRoomId: number | null = null;  // Track last join to prevent duplicates
  private lastJoinPlayerName: string | null = null;

  // Callbacks
  private onRoomUpdateCallback: ((data: RoomStatusResponse) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: IFrame) => void) | null = null;

  constructor(serverUrl?: string) {
    // Auto-detect backend URL từ frontend hostname
    const backendUrl = serverUrl || (() => {
      // Lấy hostname hiện tại (có thể là localhost, 192.168.153.1, etc.)
      const hostname = window.location.hostname;
      // Nếu là localhost/127.0.0.1, dùng localhost (dev mode)
      // Nếu là IP, dùng IP đó (production/LAN mode)
      return `http://${hostname}:8080`;
    })();

    console.log('🔌 Connecting to backend at:', backendUrl);

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${backendUrl}/ws-game`),
      debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('✅ WebSocket connected!');

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

    this.lastJoinRoomId = roomId;
    this.lastJoinPlayerName = playerName;

    this.roomId = roomId;

    // Subscribe to room updates
    this.client.subscribe(`/topic/room/${roomId}`, (message: IMessage) => {
      const data = JSON.parse(message.body);
      console.log('📨 Room update received:', data);

      // Backend trả về Map {message: "..."} cho join/leave
      // Backend trả về RoomStatusResponse cho game actions

      if (data.message && typeof data.message === 'string' && !data.status && !data.roomid) {
        // Map message từ join/leave
        console.log('📬 Join/Leave event:', data.message);
        // Fetch room status để update UI
        this.fetchRoomStatus(roomId);
      } else if (data.status || data.roomid !== undefined || data.players) {
        // RoomStatusResponse từ game actions
        console.log('🎮 Game update:', data);
        this.onRoomUpdateCallback?.(data);
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
  private async fetchRoomStatus(roomId: number) {
    try {
      const response = await fetch(`http://${window.location.hostname}:8080/api/rooms/${roomId}`, {
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
    console.log('Player ID stored:', id);
  }

  getPlayerId(): string | null {
    return this.playerId;
  }

  // Set pending room rejoin for page reload scenario
  setPendingRoomRejoin(roomId: number, playerName: string) {
    this.pendingRoomRejoin = { roomId, playerName };
    console.log('🔔 Pending room rejoin set:', { roomId, playerName });
  }
}

// Singleton instance
export const wsService = new WebSocketService();

