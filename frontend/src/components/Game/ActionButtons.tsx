import { useState } from 'react';
import { Player } from '../../types/player.types';

interface ActionButtonsProps {
  players: Player[];
  currentPlayerId?: string;
  isMyTurn: boolean;
  onFire: (targetId: string) => void;
  onReload: () => void;
}

export default function ActionButtons({
  players,
  currentPlayerId,
  isMyTurn,
  onFire,
  onReload
}: ActionButtonsProps) {
  const [showTargetSelection, setShowTargetSelection] = useState(false);

  const handleFireClick = () => {
    setShowTargetSelection(true);
  };

  const handleSelectTarget = (targetId: string) => {
    onFire(targetId);
    setShowTargetSelection(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleFireClick}
          disabled={!isMyTurn}
          className={`
            py-6 rounded-lg text-xl font-bold transition-all
            ${isMyTurn 
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/50' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
          `}
        >
          🔫 BẮN
        </button>

        <button
          onClick={onReload}
          disabled={!isMyTurn}
          className={`
            py-6 rounded-lg text-xl font-bold transition-all
            ${isMyTurn 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
          `}
        >
          🔄 NẠP ĐẠN
        </button>
      </div>

      {/* Target Selection Modal */}
      {showTargetSelection && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border-2 border-red-600 m-4">
            <h3 className="text-2xl font-bold text-white mb-4">🎯 Chọn mục tiêu</h3>

            <div className="space-y-2">
              {players.filter(p => p.health > 0).map((player) => (
                <button
                  key={player.ID}
                  onClick={() => handleSelectTarget(player.ID)}
                  className={`
                    w-full p-4 rounded text-left transition-all
                    ${player.ID === currentPlayerId 
                      ? 'bg-yellow-900 hover:bg-yellow-800 border-2 border-yellow-600' 
                      : 'bg-gray-800 hover:bg-gray-700'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">
                      {player.name}
                      {player.ID === currentPlayerId && ' (Tự bắn)'}
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: player.health }).map((_, i) => (
                        <span key={i}>❤️</span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowTargetSelection(false)}
              className="w-full mt-4 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

