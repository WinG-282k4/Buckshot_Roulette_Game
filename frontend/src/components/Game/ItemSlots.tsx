import { useState } from 'react';
import { Item, ItemType } from '../../types/item.types';
import { Player } from '../../types/player.types';

interface ItemSlotsProps {
  items: Item[];
  onUseItem: (itemType: number, targetId?: string) => void;
  canUse: boolean;
  players: Player[];
}

export default function ItemSlots({ items, onUseItem, canUse, players }: ItemSlotsProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const getItemIcon = (type: ItemType) => {
    switch (type) {
      case ItemType.BEER: return '🍺';
      case ItemType.CIGARETTE: return '🚬';
      case ItemType.CHAINSAW: return '🪚';
      case ItemType.HANDCUFFS: return '🔗';
      case ItemType.GLASS: return '🔍';
      case ItemType.VIEWFINDER: return '🔭';
      case ItemType.BULLET: return '🔫';
      default: return '❓';
    }
  };

  const handleItemClick = (item: Item) => {
    if (!canUse) return;

    // Items that need target
    if (item.isTargetNulltable) {
      setSelectedItem(item);
    } else {
      // Items that don't need target
      onUseItem(item.typeItem);
    }
  };

  const handleUseOnTarget = (targetId: string) => {
    if (selectedItem) {
      onUseItem(selectedItem.typeItem, targetId);
      setSelectedItem(null);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
      <h3 className="text-xl font-bold text-white mb-3">🎒 Items của bạn</h3>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Không có item</p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              disabled={!canUse}
              className={`
                aspect-square rounded-lg border-2 text-4xl
                transition-all hover:scale-110
                ${canUse ? 'border-yellow-600 bg-yellow-900/20 hover:bg-yellow-800/30' : 'border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed'}
              `}
              title={item.name}
            >
              {getItemIcon(item.typeItem)}
            </button>
          ))}
        </div>
      )}

      {/* Target Selection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border-2 border-yellow-600 m-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Chọn mục tiêu cho {selectedItem.name} {getItemIcon(selectedItem.typeItem)}
            </h3>

            <div className="space-y-2">
              {players.filter(p => p.health > 0).map((player) => (
                <button
                  key={player.ID}
                  onClick={() => handleUseOnTarget(player.ID)}
                  className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded text-white text-left transition-colors"
                >
                  {player.name} (HP: {player.health})
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full mt-4 p-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

