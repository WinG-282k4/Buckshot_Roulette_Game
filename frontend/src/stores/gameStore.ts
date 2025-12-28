import { create } from 'zustand';
import { RoomStatusResponse } from '../types/room.types';
import { Player } from '../types/player.types';

interface GameState {
  // Room data
  roomStatus: RoomStatusResponse | null;
  currentPlayer: Player | null;

  // Actions
  setRoomStatus: (status: RoomStatusResponse) => void;
  setCurrentPlayer: (player: Player) => void;

  // Computed
  isMyTurn: () => boolean;
  myPlayer: () => Player | null;
}

export const useGameStore = create<GameState>((set, get) => ({
  roomStatus: null,
  currentPlayer: null,

  setRoomStatus: (status) => set({ roomStatus: status }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),

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

