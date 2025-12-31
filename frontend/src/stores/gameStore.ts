import { create } from 'zustand';
import { RoomStatusResponse } from '../types/room.types';
import { Player } from '../types/player.types';

interface GameState {
  // Room data
  roomStatus: RoomStatusResponse | null;
  currentPlayer: Player | null;
  maxAmmo: number; // Lưu số đạn tối đa khi round bắt đầu

  // Actions
  setRoomStatus: (status: RoomStatusResponse) => void;
  setCurrentPlayer: (player: Player) => void;
  setMaxAmmo: (max: number) => void;
  clearRoom: () => void;  // Clear room state but keep currentPlayer

  // Computed
  isMyTurn: () => boolean;
  myPlayer: () => Player | null;
}

export const useGameStore = create<GameState>((set, get) => ({
  roomStatus: null,
  currentPlayer: null,
  maxAmmo: 0,

  setRoomStatus: (status) => {
    // Khi nhận dữ liệu từ server, nếu status = "Playing" lần đầu, lưu maxAmmo
    set((state) => {
      const isGameJustStarted = !state.roomStatus?.gun && status.gun;
      const maxAmmoValue = isGameJustStarted ? (status.gun[0] + status.gun[1]) : state.maxAmmo;

      return {
        roomStatus: status,
        maxAmmo: maxAmmoValue
      };
    });
  },
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setMaxAmmo: (max) => set({ maxAmmo: max }),
  clearRoom: () => set({ roomStatus: null, maxAmmo: 0 }),  // Clear room but keep currentPlayer

  isMyTurn: () => {
    const { roomStatus, currentPlayer } = get();
    if (!roomStatus || !currentPlayer) return false;
    return roomStatus.nextPlayer?.ID === currentPlayer.ID;
  },

  myPlayer: () => {
    const { roomStatus, currentPlayer } = get();
    if (!roomStatus || !currentPlayer) return null;
    return roomStatus.players.find(p => p.ID === currentPlayer.ID) || null;
  }
}));

