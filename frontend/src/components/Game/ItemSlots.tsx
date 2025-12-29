import { useState } from 'react';
import { Item, ItemType, ItemDescriptions } from '../../types/item.types';
import { Player } from '../../types/player.types';

interface ItemSlotsProps {
  items: Item[];
  onUseItem: (itemType: number, targetId?: string) => void;
  canUse: boolean;
  players: Player[];
}

export default function ItemSlots({ items, onUseItem, canUse, players }: ItemSlotsProps) {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isChoosingTarget, setIsChoosingTarget] = useState(false);

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

  const resetSelection = () => {
    setSelectedItem(null);
    setSelectedItemIndex(null);
    setIsChoosingTarget(false);
  };

  const handleItemClick = (item: Item, index: number) => {
    if (!canUse) return;

    if (selectedItemIndex === index) {
      resetSelection();
      return;
    }

    setSelectedItem(item);
    setSelectedItemIndex(index);
    setIsChoosingTarget(false);
  };

  const handleConfirmUseItem = () => {
    if (!selectedItem) return;

    if (selectedItem.isTargetNulltable) {
      // Show target selection modal
      setIsChoosingTarget(true);
    } else {
      // Use item directly without target
      onUseItem(selectedItem.typeItem);
      resetSelection();
    }
  };

  const handleUseOnTarget = (targetId: string) => {
    if (!selectedItem) return;

    onUseItem(selectedItem.typeItem, targetId);
    resetSelection();
  };

  const isItemSelected = (index: number) => selectedItemIndex === index;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
      <h3 className="text-xl font-bold text-white mb-3">🎒 Items của bạn</h3>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Không có item</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3">
            {items.map((item, index) => (
              <button
                key={`${item.typeItem}-${index}`}
                onClick={() => handleItemClick(item, index)}
                disabled={!canUse}
                className={`
                  aspect-square rounded-lg border-2 text-4xl transition-all
                  ${isItemSelected(index)
                    ? 'border-yellow-300 bg-yellow-900/60 scale-110 shadow-[0_0_20px_rgba(253,224,71,0.55)] '
                    : canUse
                      ? 'border-yellow-600 bg-yellow-900/20 hover:scale-110 hover:bg-yellow-800/30'
                      : 'border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed'}
                `}
                title={item.name}
              >
                {getItemIcon(item.typeItem)}
              </button>
            ))}
          </div>

          {selectedItem && !isChoosingTarget && (
            <>
              <div className="mt-4 px-3 py-2 bg-yellow-900/30 rounded-lg border border-yellow-600 text-sm text-yellow-200">
                <p className="font-semibold">{selectedItem.name}</p>
                <p className="text-yellow-100">{ItemDescriptions[selectedItem.typeItem]}</p>
              </div>

              <button
                onClick={handleConfirmUseItem}
                disabled={!canUse}
                className="mt-3 w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                USE ITEM
              </button>
            </>
          )}
        </>
      )}

      {/* Target Selection Modal */}
      {selectedItem && isChoosingTarget && (
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
              onClick={resetSelection}
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
