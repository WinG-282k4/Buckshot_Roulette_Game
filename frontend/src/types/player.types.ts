import { Item } from './item.types';

export interface Player {
  ID: string;
  name: string;
  health: number;
  isHandcuffed: boolean;
  items: Item[];
  isSoloing: boolean;
  avatar?: string; // Avatar image path or color
  URLavatar?: string; // Avatar URL from backend (e.g., "/assets/avatar/black.png")
}

