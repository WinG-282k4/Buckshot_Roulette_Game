import { Player } from './player.types';

export interface RoomStatusResponse {
  status: string;
  message?: string;  // Thông báo chung trong phòng
  roomid: number;
  gun: number[]; // [fakeCount, realCount]
  players: Player[];
  nextPlayer: Player | null;
  isSoloMode: boolean;
  ownerid?: string;  // ID của chủ phòng
  actionResponse: ActionResponse | null;
}

export interface ActionResponse {
  action: string;
  actor?: Player;
  actorId?: string;
  targetid?: string;
  message?: string;
  result?: any;
}

