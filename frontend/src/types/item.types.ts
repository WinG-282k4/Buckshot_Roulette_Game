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

export const ItemDescriptions: Record<ItemType, string> = {
  [ItemType.BEER]: "Loại bỏ viên đạn hiện tại khỏi súng.",
  [ItemType.BULLET]: "Thêm một viên đạn vào súng.",
  [ItemType.CHAINSAW]: "Gây 2 sát thương cho lần bắn tiếp.",
  [ItemType.CIGARETTE]: "Hồi phục 1 máu cho bản thân.",
  [ItemType.GLASS]: "Xem viên đạn tiếp theo trong súng.",
  [ItemType.HANDCUFFS]: "Mục tiêu bỏ lượt tiếp theo.",
  [ItemType.VIEWFINDER]: "Chọn 1 đối thủ để solo."
};
