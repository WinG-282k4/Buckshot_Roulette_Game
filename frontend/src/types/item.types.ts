export enum ItemType {
  BEER = 1,
  BULLET = 2,
  CHAINSAW = 3,
  CIGARETTE = 4,
  GLASS = 5,
  HANDCUFFS = 6,
  VIEWFINDER = 7
}

export interface Item {
  typeItem: ItemType;
  name: string;
  isTargetNulltable: boolean;
}

export const ItemNames: Record<ItemType, string> = {
  [ItemType.BEER]: "Beer",
  [ItemType.BULLET]: "Bullet",
  [ItemType.CHAINSAW]: "Chainsaw",
  [ItemType.CIGARETTE]: "Cigarette",
  [ItemType.GLASS]: "Glass",
  [ItemType.HANDCUFFS]: "Handcuffs",
  [ItemType.VIEWFINDER]: "Viewfinder"
};

