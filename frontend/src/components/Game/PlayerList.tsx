import { Player } from '../../types/player.types';

interface PlayerListProps {
  players: Player[];
  nextPlayer: Player | null;
  currentPlayerId?: string;
}

export default function PlayerList({ players, nextPlayer, currentPlayerId }: PlayerListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">👥 Người chơi</h2>

      {players.map((player) => {
        const isNext = nextPlayer?.ID === player.ID;
        const isMe = player.ID === currentPlayerId;
        const isDead = player.health <= 0;

        return (
          <div
            key={player.ID}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${isNext ? 'border-yellow-500 bg-yellow-900/20' : 'border-gray-700 bg-gray-800'}
              ${isDead ? 'opacity-50' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {player.name}
                  {isMe && ' 👈'}
                  {isDead && ' ☠️'}
                </h3>
                {player.isHandcuffed && (
                  <span className="text-orange-500 text-sm">🔗 Bị còng</span>
                )}
              </div>

              {/* Health */}
              <div className="flex gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      w-6 h-6 rounded flex items-center justify-center text-xs
                      ${i < player.health ? 'bg-red-500' : 'bg-gray-700'}
                    `}
                  >
                    {i < player.health && '❤️'}
                  </div>
                ))}
              </div>
            </div>

            {/* Items Count */}
            <div className="mt-2 text-sm text-gray-400">
              🎒 {player.items.length} items
            </div>
          </div>
        );
      })}
    </div>
  );
}

