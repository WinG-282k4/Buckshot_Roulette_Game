import { Player } from './player.types';

export interface RoomStatusResponse {
  status: string;
  roomid: number;
  gun: number[]; // [fakeCount, realCount]
  players: Player[];
  nextPlayer: Player | null;
  isSoloMode: boolean;
  actionResponse: ActionResponse | null;
}

export interface ActionResponse {
  action: string;
  actor?: Player;
  target?: Player;
  message?: string;
  result?: any;
}

