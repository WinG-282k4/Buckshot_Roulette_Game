import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RoomStatusResponse } from '../types/room.types';

export class WebSocketService {
  private client: Client | null = null;
  private roomId: number | null = null;
  private playerId: string | null = null;

  // Callbacks
  private onRoomUpdateCallback: ((data: RoomStatusResponse) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;

  constructor(serverUrl: string = 'http://localhost:8080') {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${serverUrl}/ws-game`),
      debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('✅ WebSocket connected!');
      this.onConnectCallback?.();
    };

    this.client.onStompError = (frame) => {
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

    // Send join message
    this.client.publish({
      destination: `/app/join/${roomId}`,
      body: JSON.stringify({ name: playerName })
    });
  }

  // Fetch room status từ REST API
  private async fetchRoomStatus(roomId: number) {
    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
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

  // Set callbacks
  onRoomUpdate(callback: (data: RoomStatusResponse) => void) {
    this.onRoomUpdateCallback = callback;
  }

  onConnect(callback: () => void) {
    this.onConnectCallback = callback;
  }

  onError(callback: (error: any) => void) {
    this.onErrorCallback = callback;
  }

  setPlayerId(id: string) {
    this.playerId = id;
  }
}

// Singleton instance
export const wsService = new WebSocketService();

