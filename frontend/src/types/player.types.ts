import { Item } from './item.types';

export interface Player {
  ID: string;
  name: string;
  health: number;
  isHandcuffed: boolean;
  items: Item[];
  isSoloing: boolean;
}

